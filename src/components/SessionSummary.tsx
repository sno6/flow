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
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        height: "100%",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Back arrow — top left, same as the writing screen */}
      {onNewSession && (
        <button
          aria-label="New session"
          onClick={onNewSession}
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
            color: "#ccc",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
        >
          <svg
            width="28"
            height="28"
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

      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Transcript
        </div>
        <h1
          style={{
            marginTop: "0.5rem",
            fontSize: "1.8rem",
            fontWeight: 500,
            color: "#3a3a3a",
            lineHeight: 1.3,
            overflowWrap: "anywhere",
          }}
        >
          {idea}
        </h1>
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: 300,
            color: "#b0b0b0",
          }}
        >
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>

        <div
          style={{
            margin: "2rem 0",
            borderTop: "1px solid #e0deda",
          }}
        />

        {/* Body */}
        <div
          style={{
            lineHeight: 1.9,
            color: "#3a3a3a",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            fontSize: "1.05rem",
            fontWeight: 300,
          }}
        >
          {rawText}
        </div>
      </div>
    </motion.div>
  );
}
