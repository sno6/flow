import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Setup } from "./components/Setup";
import { FlowSession } from "./components/FlowSession";
import { SessionSummary } from "./components/SessionSummary";
import { Sidebar } from "./components/Sidebar";
import {
  getSessions,
  saveSession,
  deleteSession,
  type SavedSession,
} from "./lib/sessions";

type Phase = "setup" | "flow" | "done";

interface SessionConfig {
  idea: string;
  duration: number;
}

export function App() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<SessionConfig>({
    idea: "",
    duration: 5,
  });
  const [completedText, setCompletedText] = useState("");
  const [savedSessions, setSavedSessions] =
    useState<SavedSession[]>(getSessions);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleStart(idea: string, duration: number) {
    setConfig({ idea, duration });
    setPhase("flow");
  }

  function handleSessionEnd(rawText: string) {
    setCompletedText(rawText);

    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    saveSession({ idea: config.idea, rawText, wordCount });
    setSavedSessions(getSessions());
    setPhase("done");
  }

  function handleNewSession() {
    setConfig({ idea: "", duration: 5 });
    setCompletedText("");
    setPhase("setup");
  }

  function handleSelectSession(session: SavedSession) {
    setConfig({ idea: session.idea, duration: 5 });
    setCompletedText(session.rawText);
    setSidebarOpen(false);
    setPhase("done");
  }

  function handleDeleteSession(id: string) {
    deleteSession(id);
    setSavedSessions(getSessions());
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {phase === "setup" && (
        <>
          {/* Sidebar toggle — top left */}
          {savedSessions.length > 0 && (
            <button
              aria-label="Past sessions"
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                top: "2.5rem",
                left: "2.5rem",
                zIndex: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                color: "#bbb",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
          )}
          <Setup onStart={handleStart} />
        </>
      )}
      {phase === "flow" && (
        <FlowSession
          idea={config.idea}
          duration={config.duration}
          onEnd={handleSessionEnd}
          onBack={handleNewSession}
        />
      )}
      {phase === "done" && (
        <SessionSummary
          idea={config.idea}
          rawText={completedText}
          onNewSession={handleNewSession}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar
            sessions={savedSessions}
            onSelect={handleSelectSession}
            onDelete={handleDeleteSession}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
