import { memo } from "react";

const CHAR_WIDTH = 13.3;
const FLOAT_DURATION_SEC = 1.4;

interface FloatingCharProps {
  char: string;
  birthIndex: number;
  totalChars: number;
  flushing?: boolean;
  onComplete: () => void;
}

export const FloatingChar = memo(function FloatingChar({
  char,
  birthIndex,
  totalChars,
  flushing,
  onComplete,
}: FloatingCharProps) {
  const offset = (totalChars - birthIndex + 1) * CHAR_WIDTH;

  return (
    <div
      onAnimationEnd={onComplete}
      style={{
        position: "absolute",
        top: "45%",
        left: `calc(50% - ${offset}px)`,
        fontSize: "1.5rem",
        fontWeight: 300,
        fontFamily: "'Commit Mono', monospace",
        color: "#aaa",
        pointerEvents: "none",
        userSelect: "none",
        transition: "left 0.05s ease-out",
        animation: flushing
          ? "quickFadeOut 0.4s ease-out forwards"
          : `fadeOut ${FLOAT_DURATION_SEC}s ease-out forwards`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </div>
  );
});
