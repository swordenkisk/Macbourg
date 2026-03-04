import { useState, useEffect, useRef } from "react";

const AGENTS = [
  {
    id: "planner",
    name: "Planner",
    arabic: "المخطط",
    icon: "◈",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.4)",
    role: "Breaks the request into structured development tasks",
    systemPrompt: `You are a senior software architect and Planner Agent.
Your job: Analyze the user's request and break it into clear, structured development tasks.
Output a numbered list of specific, actionable tasks (5-8 tasks).
Be concise, technical, and precise. No code yet — only planning.
Format as:
**Development Plan:**
1. [Task]
2. [Task]
...`
  },
  {
    id: "developer",
    name: "Developer",
    arabic: "المطور",
    icon: "⬡",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.4)",
    role: "Writes clean, production-ready Python code",
    systemPrompt: `You are an expert Python Developer Agent.
Your job: Write clean, production-ready Python code based on the plan provided.
Include proper imports, docstrings, type hints, and error handling.
Output ONLY the code with brief inline comments. No extra explanation outside the code block.`
  },
  {
    id: "tester",
    name: "Tester",
    arabic: "المختبر",
    icon: "⬟",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.4)",
    role: "Creates comprehensive unit tests",
    systemPrompt: `You are a QA Engineer and Tester Agent.
Your job: Write comprehensive pytest unit tests for the provided code.
Cover: happy paths, edge cases, error cases, and boundary conditions.
Use pytest fixtures where appropriate. Output ONLY the test code.`
  },
  {
    id: "verifier",
    name: "Verifier",
    arabic: "المراجع",
    icon: "◉",
    color: "#10F5A0",
    glow: "rgba(16,245,160,0.4)",
    role: "Reviews code & tests, approves or requests fixes",
    systemPrompt: `You are a senior Code Reviewer and Verifier Agent.
Your job: Review the code and tests critically.
Provide:
1. **Overall Assessment**: APPROVED ✅ or NEEDS FIXES ⚠️
2. **Code Quality Score**: X/10
3. **Strengths**: What's done well
4. **Issues Found**: Any bugs, missing cases, or improvements
5. **Final Verdict**: One sentence summary

Be direct and professional.`
  }
];

const EXAMPLE_PROMPTS = [
  "Build a Python API to calculate sales statistics",
  "Create a password strength validator with scoring",
  "Build a CSV file parser with data cleaning utilities",
];

function TypingText({ text, speed = 8, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIdx(0);
  }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(text.slice(0, idx + 1));
        setIdx(i => i + 1);
      }, speed);
      return () => clearTimeout(t);
    } else if (idx === text.length && text.length > 0 && onDone) {
      onDone();
    }
  }, [idx, text, speed, onDone]);

  return <span>{displayed}</span>;
}

function AgentCard({ agent, status, output, isActive, index }) {
  const statusMap = {
    idle: { label: "IDLE", color: "#444" },
    running: { label: "PROCESSING", color: agent.color },
    done: { label: "COMPLETE", color: "#10F5A0" },
  };
  const s = statusMap[status] || statusMap.idle;

  return (
    <div style={{
      border: `1px solid ${isActive ? agent.color : "#1a1a2e"}`,
      borderRadius: 12,
      padding: "20px 24px",
      background: isActive
        ? `radial-gradient(ellipse at top left, ${agent.glow} 0%, #0a0a14 70%)`
        : "#0a0a14",
      boxShadow: isActive ? `0 0 30px ${agent.glow}, inset 0 0 30px rgba(0,0,0,0.5)` : "none",
      transition: "all 0.4s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated border glow */}
      {isActive && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 12,
          background: `linear-gradient(90deg, transparent, ${agent.color}22, transparent)`,
          animation: "shimmer 1.5s infinite",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{
          fontSize: 28, color: agent.color,
          filter: isActive ? `drop-shadow(0 0 8px ${agent.color})` : "none",
          transition: "filter 0.3s",
          animation: isActive ? "pulse 1s infinite" : "none",
        }}>{agent.icon}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 15 }}>
              {agent.name} Agent
            </span>
            <span style={{ color: "#666", fontFamily: "'Noto Naskh Arabic', serif", fontSize: 13 }}>
              {agent.arabic}
            </span>
          </div>
          <div style={{ color: "#555", fontSize: 11, fontFamily: "'Space Mono', monospace", marginTop: 2 }}>
            {agent.role}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <span style={{
            fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: 1,
            color: s.color, border: `1px solid ${s.color}`,
            padding: "3px 8px", borderRadius: 4,
            boxShadow: status !== "idle" ? `0 0 8px ${s.color}44` : "none",
          }}>
            {s.label}
          </span>
          <div style={{ color: "#333", fontSize: 10, marginTop: 4, fontFamily: "monospace" }}>
            AGENT_{String(index + 1).padStart(2, "0")}
          </div>
        </div>
      </div>

      {output && (
        <div style={{
          background: "#060610", border: "1px solid #1a1a2e",
          borderRadius: 8, padding: "14px 16px", marginTop: 8,
          fontFamily: "'Space Mono', monospace", fontSize: 12,
          color: "#ccc", lineHeight: 1.7, maxHeight: 220, overflowY: "auto",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {status === "running"
            ? <TypingText text={output} speed={4} />
            : output}
        </div>
      )}

      {status === "running" && !output && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: agent.color,
              animation: `bounce 0.8s ${i * 0.15}s infinite`,
            }} />
          ))}
          <span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, marginLeft: 6 }}>
            Analyzing...
          </span>
        </div>
      )}
    </div>
  );
}

function FlowArrow({ active, color }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: 32, position: "relative",
    }}>
      <div style={{
        width: 2, height: "100%",
        background: active
          ? `linear-gradient(to bottom, ${color}, ${color}88)`
          : "#1a1a2e",
        transition: "background 0.4s",
        position: "relative",
      }}>
        {active && (
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, borderRight: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`, transform: "translateX(-50%) rotate(45deg)",
            marginBottom: 2,
          }} />
        )}
      </div>
      {active && (
        <div style={{
          position: "absolute",
          width: 4, height: 4, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: "flowDot 1s infinite linear",
        }} />
      )}
    </div>
  );
}

export default function MacbourgAgents() {
  const [prompt, setPrompt] = useState("");
  const [agentStatuses, setAgentStatuses] = useState({ planner: "idle", developer: "idle", tester: "idle", verifier: "idle" });
  const [agentOutputs, setAgentOutputs] = useState({});
  const [currentAgent, setCurrentAgent] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [activeArrows, setActiveArrows] = useState([false, false, false]);
  const abortRef = useRef(false);

  const callClaude = async (systemPrompt, userMessage) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.content.map(b => b.text || "").join("\n");
  };

  const runPipeline = async () => {
    if (!prompt.trim() || isRunning) return;
    abortRef.current = false;
    setIsRunning(true);
    setDone(false);
    setError(null);
    setAgentStatuses({ planner: "idle", developer: "idle", tester: "idle", verifier: "idle" });
    setAgentOutputs({});
    setActiveArrows([false, false, false]);
    setCurrentAgent(null);

    const state = {};

    try {
      // PLANNER
      setCurrentAgent("planner");
      setAgentStatuses(s => ({ ...s, planner: "running" }));
      const plan = await callClaude(AGENTS[0].systemPrompt, `User request: ${prompt}`);
      state.plan = plan;
      setAgentOutputs(o => ({ ...o, planner: plan }));
      setAgentStatuses(s => ({ ...s, planner: "done" }));
      setActiveArrows([true, false, false]);
      await new Promise(r => setTimeout(r, 400));

      // DEVELOPER
      setCurrentAgent("developer");
      setAgentStatuses(s => ({ ...s, developer: "running" }));
      const code = await callClaude(AGENTS[1].systemPrompt, `Plan:\n${state.plan}\n\nOriginal request: ${prompt}`);
      state.code = code;
      setAgentOutputs(o => ({ ...o, developer: code }));
      setAgentStatuses(s => ({ ...s, developer: "done" }));
      setActiveArrows([true, true, false]);
      await new Promise(r => setTimeout(r, 400));

      // TESTER
      setCurrentAgent("tester");
      setAgentStatuses(s => ({ ...s, tester: "running" }));
      const tests = await callClaude(AGENTS[2].systemPrompt, `Code to test:\n${state.code}`);
      state.tests = tests;
      setAgentOutputs(o => ({ ...o, tester: tests }));
      setAgentStatuses(s => ({ ...s, tester: "done" }));
      setActiveArrows([true, true, true]);
      await new Promise(r => setTimeout(r, 400));

      // VERIFIER
      setCurrentAgent("verifier");
      setAgentStatuses(s => ({ ...s, verifier: "running" }));
      const review = await callClaude(AGENTS[3].systemPrompt, `Code:\n${state.code}\n\nTests:\n${state.tests}`);
      state.review = review;
      setAgentOutputs(o => ({ ...o, verifier: review }));
      setAgentStatuses(s => ({ ...s, verifier: "done" }));
      setCurrentAgent(null);
      setDone(true);

    } catch (e) {
      setError(e.message);
      setCurrentAgent(null);
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setPrompt("");
    setAgentStatuses({ planner: "idle", developer: "idle", tester: "idle", verifier: "idle" });
    setAgentOutputs({});
    setCurrentAgent(null);
    setDone(false);
    setError(null);
    setActiveArrows([false, false, false]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#05050f",
      fontFamily: "'Space Mono', monospace",
      color: "#fff",
      padding: "0 0 60px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Noto+Naskh+Arabic&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 2px; }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes flowDot { 0%{top:0} 100%{top:100%} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        @keyframes glow { 0%,100%{text-shadow:0 0 10px #00D4FF,0 0 20px #00D4FF44} 50%{text-shadow:0 0 20px #00D4FF,0 0 40px #00D4FF} }
        textarea { resize: none; outline: none; }
        button:hover { opacity: 0.85; transform: scale(0.98); }
        button { transition: all 0.15s ease; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #0d0d2a",
        padding: "28px 40px 24px",
        background: "linear-gradient(to bottom, #08081a, #05050f)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, #00D4FF, transparent)",
        }} />
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
            <h1 style={{
              fontSize: 32, fontWeight: 700, letterSpacing: -1,
              color: "#00D4FF", animation: "glow 3s infinite",
            }}>
              MACBOURG
            </h1>
            <span style={{ color: "#FF6B35", fontSize: 14, letterSpacing: 3, fontWeight: 700 }}>
              AI AGENTS
            </span>
            <span style={{ color: "#333", fontSize: 11, letterSpacing: 1, marginLeft: "auto" }}>
              v0.1.0 — MULTI-AGENT PIPELINE
            </span>
          </div>
          <p style={{ color: "#444", fontSize: 12, lineHeight: 1.6 }}>
            أكتب Prompt واحد → يعمل فريق كامل من الوكلاء الذكيين &nbsp;|&nbsp;
            One prompt. Four specialized AI agents. Full software factory.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>

        {/* Input section */}
        <div style={{
          background: "#0a0a14", border: "1px solid #1a1a2e",
          borderRadius: 14, padding: 24, marginBottom: 28,
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>
            // MISSION INPUT
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what you want to build... (e.g. Build a Python API to calculate sales statistics)"
            rows={3}
            style={{
              width: "100%", background: "#060610",
              border: "1px solid #1a1a2e", borderRadius: 8,
              padding: "14px 16px", color: "#ddd",
              fontFamily: "'Space Mono', monospace", fontSize: 13, lineHeight: 1.7,
            }}
            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) runPipeline(); }}
          />

          {/* Example prompts */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {EXAMPLE_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => setPrompt(p)} style={{
                background: "transparent", border: "1px solid #1a1a2e",
                color: "#555", fontSize: 10, padding: "4px 10px",
                borderRadius: 4, cursor: "pointer", fontFamily: "monospace",
              }}>
                {p.slice(0, 35)}…
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={runPipeline}
              disabled={isRunning || !prompt.trim()}
              style={{
                background: isRunning ? "#1a1a2e" : "linear-gradient(135deg, #00D4FF, #0090CC)",
                color: isRunning ? "#555" : "#000",
                border: "none", borderRadius: 8,
                padding: "12px 28px", fontFamily: "'Space Mono', monospace",
                fontWeight: 700, fontSize: 13, cursor: isRunning ? "not-allowed" : "pointer",
                letterSpacing: 1,
              }}
            >
              {isRunning ? "⟳ RUNNING PIPELINE..." : "▶ LAUNCH AGENTS"}
            </button>
            {(done || error) && (
              <button onClick={reset} style={{
                background: "transparent", border: "1px solid #333",
                color: "#666", borderRadius: 8,
                padding: "12px 20px", fontFamily: "monospace",
                fontSize: 12, cursor: "pointer",
              }}>
                ↺ RESET
              </button>
            )}
            <span style={{ color: "#333", fontSize: 10, alignSelf: "center", marginLeft: "auto" }}>
              ⌘ + Enter to run
            </span>
          </div>
        </div>

        {/* Pipeline status bar */}
        {(isRunning || done) && (
          <div style={{
            display: "flex", gap: 0, marginBottom: 24,
            border: "1px solid #1a1a2e", borderRadius: 8, overflow: "hidden",
            animation: "fadeIn 0.3s ease",
          }}>
            {AGENTS.map((a, i) => (
              <div key={a.id} style={{
                flex: 1, padding: "8px 0", textAlign: "center",
                background: agentStatuses[a.id] === "done" ? `${a.color}15`
                  : agentStatuses[a.id] === "running" ? `${a.color}22` : "transparent",
                borderRight: i < 3 ? "1px solid #1a1a2e" : "none",
                transition: "background 0.3s",
              }}>
                <div style={{ fontSize: 9, color: agentStatuses[a.id] === "done" ? a.color : "#444", letterSpacing: 1 }}>
                  {agentStatuses[a.id] === "done" ? "✓" : agentStatuses[a.id] === "running" ? "●" : "○"} {a.name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agents pipeline */}
        <div>
          {AGENTS.map((agent, i) => (
            <div key={agent.id}>
              <AgentCard
                agent={agent}
                status={agentStatuses[agent.id]}
                output={agentOutputs[agent.id]}
                isActive={currentAgent === agent.id}
                index={i}
              />
              {i < AGENTS.length - 1 && (
                <FlowArrow active={activeArrows[i]} color={AGENTS[i + 1].color} />
              )}
            </div>
          ))}
        </div>

        {/* Success banner */}
        {done && (
          <div style={{
            marginTop: 28,
            border: "1px solid #10F5A0",
            borderRadius: 12, padding: "20px 24px",
            background: "radial-gradient(ellipse at center, rgba(16,245,160,0.08) 0%, #05050f 70%)",
            boxShadow: "0 0 40px rgba(16,245,160,0.15)",
            animation: "fadeIn 0.5s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, filter: "drop-shadow(0 0 8px #10F5A0)" }}>✓</span>
              <div>
                <div style={{ color: "#10F5A0", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>
                  PIPELINE COMPLETE — ALL AGENTS FINISHED
                </div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 4 }}>
                  خطة + كود + اختبارات + مراجعة &nbsp;|&nbsp; Plan → Code → Tests → Review
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 20, border: "1px solid #FF4444",
            borderRadius: 8, padding: "14px 18px",
            background: "rgba(255,68,68,0.05)",
            color: "#FF6666", fontSize: 12, fontFamily: "monospace",
            animation: "fadeIn 0.3s ease",
          }}>
            ✗ ERROR: {error}
          </div>
        )}

        {/* Architecture diagram */}
        {!isRunning && !done && (
          <div style={{
            marginTop: 32, border: "1px solid #0d0d2a",
            borderRadius: 12, padding: 24,
            background: "#07071200",
            animation: "fadeIn 0.6s ease 0.2s both",
          }}>
            <div style={{ color: "#333", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>
              // ARCHITECTURE — المعمارية
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
              gap: 4, alignItems: "center",
            }}>
              {AGENTS.map((a, i) => (
                <>
                  <div key={a.id} style={{
                    border: `1px solid ${a.color}44`,
                    borderRadius: 8, padding: "10px 14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 18, color: a.color }}>{a.icon}</div>
                    <div style={{ fontSize: 10, color: a.color, marginTop: 4 }}>{a.name}</div>
                    <div style={{ fontSize: 9, color: "#333", marginTop: 2 }}>{a.arabic}</div>
                  </div>
                  {i < AGENTS.length - 1 && (
                    <div key={`arrow-${i}`} style={{ color: "#222", fontSize: 16, textAlign: "center" }}>→</div>
                  )}
                </>
              ))}
            </div>
            <div style={{
              marginTop: 16, color: "#333", fontSize: 10, lineHeight: 1.8, letterSpacing: 0.5,
            }}>
              Each agent has a single responsibility. No agent reviews its own work. Same principle as Antfarm.
              <br/>
              كل وكيل له دور واحد فقط. لا يراجع الوكيل عمله بنفسه. نفس مبدأ Antfarm.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
