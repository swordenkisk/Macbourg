# 🤖 Macbourg AI Agents

>  — A mini software factory powered by AI agents.  
> One prompt → Plan + Code + Tests + Review.

Inspired by the Antfarm architecture: each agent has a **single responsibility** and **no agent reviews its own work**.

---

## Architecture

```
User Prompt
    ↓
📋 Planner   — Breaks request into dev tasks
    ↓
💻 Developer — Writes production Python code
    ↓
🧪 Tester    — Creates pytest unit tests
    ↓
✅ Verifier  — Reviews code & tests, scores quality
    ↓
Final Output
```

---

## Quick Start

### 1. Clone & setup

```bash
git clone https://github.com/swordenkisk/macbourg-agents.git
cd macbourg-agents
python setup.py
```

### 2. Add your API key

```bash
# Edit .env — add your Anthropic or OpenAI key
nano .env
```

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Activate venv & run

```bash
# Mac / Linux
source .venv/bin/activate

# Windows
.\.venv\Scripts\activate

# Run
python main.py
```

### 4. Or pass a prompt directly

```bash
python main.py "Build a Python REST API for user authentication"
```

---

## Project Structure

```
macbourg-agents/
├── main.py              ← Entry point
├── setup.py             ← One-command setup
├── requirements.txt     ← Dependencies
├── .env.example         ← API key template
├── .gitignore
├── src/
│   ├── agents.py        ← 4 agent definitions
│   ├── pipeline.py      ← Pipeline orchestrator
│   └── llm_client.py    ← Anthropic / OpenAI client
└── tests/
    └── test_agents.py   ← Pytest unit tests
```

---

## Run Tests

```bash
pytest tests/ -v
```

---

## Supported LLMs

| Provider  | Model (default)            | Key in `.env`        |
|-----------|----------------------------|----------------------|
| Anthropic | `claude-sonnet-4-20250514` | `ANTHROPIC_API_KEY`  |
| OpenAI    | `gpt-4o-mini`              | `OPENAI_API_KEY`     |

The client auto-detects which key is present. Anthropic takes priority.

---

## Web UI Version

A React-based visual pipeline dashboard is also included in `macbourg-agents.jsx` — runs inside Claude.ai artifacts.

---

## License

MIT — built by [@swordenkisk](https://github.com/swordenkisk)
