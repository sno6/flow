import { useState } from "react";
import { motion } from "motion/react";
import type { SavedSession } from "../lib/sessions";

interface SidebarProps {
  sessions: SavedSession[];
  onSelect: (session: SavedSession) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function SessionRow({
  session,
  onSelect,
  onDelete,
}: {
  session: SavedSession;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        textAlign: "left",
        padding: "0.7rem 0.75rem",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.12s",
        background: hovered ? "#e8e7e4" : "transparent",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 400,
            color: "#3a3a3a",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {session.idea}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 300,
            color: "#b0b0b0",
            marginTop: "0.2rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <span>{formatRelativeDate(session.createdAt)}</span>
        </div>
      </div>

      {/* Delete button */}
      <button
        aria-label="Delete session"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          color: "#ccc",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s, color 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#e07070")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </div>
  );
}

export function Sidebar({
  sessions,
  onSelect,
  onDelete,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -280, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          background: "#f0efec",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.25rem 1rem",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#3a3a3a",
              letterSpacing: "0.02em",
            }}
          >
            Flows
          </span>
          <button
            aria-label="Close sidebar"
            onClick={onClose}
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
              width="16"
              height="16"
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
        </div>

        {/* Session list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 0.5rem 1rem",
          }}
        >
          {sessions.length === 0 ? (
            <div
              style={{
                padding: "2rem 0.75rem",
                fontSize: "0.85rem",
                color: "#b0b0b0",
                fontWeight: 300,
              }}
            >
              Complete a flow to see it here.
            </div>
          ) : (
            sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                onSelect={() => onSelect(session)}
                onDelete={() => onDelete(session.id)}
              />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
