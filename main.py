"""
Macbourg AI Agents — Main Entry Point
Multi-agent pipeline: Planner → Developer → Tester → Verifier

Usage:
    python main.py
    python main.py "Build a REST API for user authentication"
"""

import sys
from dotenv import load_dotenv

load_dotenv()

from src.pipeline import run_pipeline


def main():
    if len(sys.argv) > 1:
        request = " ".join(sys.argv[1:])
    else:
        print("\n" + "═" * 60)
        print("   MACBOURG AI AGENTS — Multi-Agent Pipeline")
        print("   فريق وكلاء الذكاء الاصطناعي")
        print("═" * 60)
        request = input("\n🔷 Enter your request: ").strip()
        if not request:
            request = "Build a Python API to calculate sales statistics"
            print(f"   (using default: {request})")

    result = run_pipeline(request)

    print("\n" + "═" * 60)
    print("   ✓ PIPELINE COMPLETE — ALL AGENTS FINISHED")
    print("═" * 60 + "\n")

    return result


if __name__ == "__main__":
    main()
