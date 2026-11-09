import { motion } from "motion/react";

interface SessionSummaryProps {
  idea: string;
  rawText: string;
  onNewSession?: () => void;
}

export function SessionSummary({
  idea,
  rawText,
  onNewSession,
}: SessionSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1.5rem",
          flexShrink: 0,
          background: "#f7f6f3",
        }}
      >
        {onNewSession && (
          <button
            aria-label="New session"
            onClick={onNewSession}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              color: "#999",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3a3a3a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "#3a3a3a",
            maxWidth: "400px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {idea}
        </span>
      </div>

      {/* Transcript */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "3rem 2rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            width: "100%",
            lineHeight: 1.9,
            color: "#3a3a3a",
            whiteSpace: "pre-wrap",
            fontSize: "1.05rem",
            fontWeight: 300,
          }}
        >
          {rawText}
        </div>
        <div style={{ minHeight: "6rem", flexShrink: 0 }} />
      </div>
    </motion.div>
  );
}
