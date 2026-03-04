#!/usr/bin/env python3
"""
Macbourg AI Agents — One-Command Setup
Creates venv, installs dependencies, and prepares .env

Usage:
    python setup.py
"""

import os
import sys
import subprocess
from pathlib import Path

VENV = ".venv"
REQ  = "requirements.txt"

def banner(msg): print(f"\n{'─'*50}\n  {msg}\n{'─'*50}")
def ok(msg):     print(f"  ✓  {msg}")
def info(msg):   print(f"  →  {msg}")
def fail(msg):   print(f"  ✗  {msg}"); sys.exit(1)


def create_venv():
    banner("Creating virtual environment")
    if Path(VENV).exists():
        info(f"{VENV}/ already exists — skipping")
        return
    r = subprocess.run([sys.executable, "-m", "venv", VENV])
    if r.returncode != 0:
        fail("venv creation failed")
    ok(f"Created {VENV}/")


def pip():
    if sys.platform == "win32":
        return str(Path(VENV) / "Scripts" / "pip.exe")
    return str(Path(VENV) / "bin" / "pip")


def python():
    if sys.platform == "win32":
        return str(Path(VENV) / "Scripts" / "python.exe")
    return str(Path(VENV) / "bin" / "python")


def install():
    banner("Installing dependencies")
    subprocess.run([pip(), "install", "--upgrade", "pip", "-q"])
    r = subprocess.run([pip(), "install", "-r", REQ, "-q"])
    if r.returncode != 0:
        fail("pip install failed")
    ok("All packages installed")


def setup_env():
    banner("Setting up .env")
    if Path(".env").exists():
        info(".env already exists — skipping")
        return
    Path(".env").write_text(Path(".env.example").read_text())
    ok("Created .env from .env.example")
    info("👉  Edit .env and add your ANTHROPIC_API_KEY")


def summary():
    activate = (
        f".\\{VENV}\\Scripts\\activate"
        if sys.platform == "win32"
        else f"source {VENV}/bin/activate"
    )
    banner("✓ SETUP COMPLETE")
    print(f"""
  Next steps:
  ──────────────────────────────────────────
  1. Activate venv:
     {activate}

  2. Add your API key to .env:
     nano .env

  3. Run the pipeline:
     python main.py

  4. Run tests:
     pytest tests/ -v
  ──────────────────────────────────────────
    """)


if __name__ == "__main__":
    print("\n" + "═"*50)
    print("   MACBOURG AI AGENTS — Setup")
    print("═"*50)
    create_venv()
    install()
    setup_env()
    summary()
