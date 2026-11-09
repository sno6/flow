import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";

interface SetupProps {
  onStart: (idea: string, duration: number) => void;
}

const DURATIONS = [5, 10, 15, 20, 25, 30] as const;

const GITHUB_URL = "https://github.com/sno6/flow";

const PLACEHOLDERS = [
  "What are we thinking about today?",
  "What's on your mind?",
  "What do you want to explore?",
  "Where should your thoughts go?",
  "What idea needs some air?",
  "What's worth thinking through?",
  "What do you want to untangle?",
];

export function Setup({ onStart }: SetupProps) {
  const [idea, setIdea] = useState("");
  const [duration, setDuration] = useState<number>(5);
  const [showAbout, setShowAbout] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
  );

  useEffect(() => {
    if (!showAbout) inputRef.current?.focus();
  }, [showAbout]);

  useEffect(() => {
    if (!showAbout) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAbout(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showAbout]);

  function handleSubmit() {
    if (idea.trim()) {
      onStart(idea.trim(), duration);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "2rem",
        position: "relative",
      }}
    >
      <AnimatePresence mode="wait">
        {!showAbout ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Input row: cursor + text + arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderBottom: "1px solid #e0deda",
                paddingBottom: "0.75rem",
              }}
            >
              <div
                onClick={() => inputRef.current?.focus()}
                style={{
                  position: "relative",
                  cursor: "text",
                }}
              >
                {/* Hidden input for capture */}
                <input
                  ref={inputRef}
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />
                {/* Invisible placeholder to hold width */}
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    visibility: "hidden",
                    whiteSpace: "pre",
                  }}
                >
                  {placeholder}
                </span>
                {/* Visible layer: cursor + text */}
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    whiteSpace: "pre",
                  }}
                >
                  {/* Text before cursor */}
                  {idea && (
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 300,
                        color: "#3a3a3a",
                      }}
                    >
                      {idea}
                    </span>
                  )}
                  {/* Custom cursor */}
                  <span
                    style={{
                      display: "inline-block",
                      width: "1px",
                      height: "1.8em",
                      backgroundColor: "#ccc",
                      animation: "blink 2s ease-in-out infinite",
                      marginLeft: idea ? "1px" : 0,
                      marginRight: idea ? 0 : "2px",
                      flexShrink: 0,
                    }}
                  />
                  {/* Placeholder when empty */}
                  {!idea && (
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 300,
                        color: "#bbb",
                      }}
                    >
                      {placeholder}
                    </span>
                  )}
                </span>
              </div>

              {/* Arrow button */}
              <motion.button
                aria-label="Start"
                onClick={handleSubmit}
                animate={{
                  opacity: idea.trim() ? 0.8 : 0.5,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: idea.trim() ? "pointer" : "default",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: idea.trim() ? "auto" : "none",
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#bbb"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </motion.button>
            </div>

            {/* Duration as inline text */}
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 300,
                color: "#ccc",
              }}
            >
              <span style={{ userSelect: "none" }}>
                for{" "}
                <span
                  onClick={() => {
                    const idx = DURATIONS.indexOf(
                      duration as (typeof DURATIONS)[number],
                    );
                    setDuration(DURATIONS[(idx + 1) % DURATIONS.length]);
                  }}
                  style={{
                    color: "#aaa",
                    cursor: "pointer",
                    borderBottom: "1px dashed #ccc",
                    paddingBottom: "1px",
                    transition: "color 0.2s ease",
                    display: "inline-flex",
                    alignItems: "baseline",
                  }}
                >
                  <NumberFlow value={duration} animated />
                </span>{" "}
                minutes
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: "340px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
              padding: "0 1rem",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 300,
                color: "#3a3a3a",
                lineHeight: 1.5,
              }}
            >
              A space for human thought.
            </p>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "#aaa",
                lineHeight: 1.7,
              }}
            >
              This app was inspired by the concept of freewriting, the act of
              continuously jotting down your flow of thoughts for a period of
              time.
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "#aaa",
                lineHeight: 1.7,
              }}
            >
              Try your best to keep typing. Even if you have to repeat yourself.
              After a brief period you will notice your ideas starting to flow
              in new directions. Follow them. Breathe life into them.
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "#c0bbb0",
                lineHeight: 1.6,
                fontStyle: "italic",
                marginTop: "0.75rem",
              }}
            >
              <a
                href="https://www.youtube.com/watch?v=dcolM6W5Odc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit",
                  textDecoration: "underline",
                  textDecorationColor: "#ddd",
                  textUnderlineOffset: "2px",
                }}
              >
                In a world where the cost of answers is dropping to zero, the
                value of the question becomes everything…
              </a>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <img
                src="/tree.png"
                alt=""
                style={{
                  width: "180px",
                  opacity: 0.45,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GitHub — bottom right */}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source on GitHub"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          color: "#ccc",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>

      {/* Info / back — bottom left */}
      <motion.button
        aria-label={showAbout ? "Back" : "About"}
        onClick={() => setShowAbout(!showAbout)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: showAbout ? "1px solid transparent" : "1px solid #ddd",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "border-color 0.3s ease",
        }}
      >
        {showAbout ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bbb"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        ) : (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "#bbb",
              lineHeight: 1,
            }}
          >
            ?
          </span>
        )}
      </motion.button>
    </div>
  );
}
