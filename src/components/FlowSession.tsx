import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { FloatingChar } from "./FloatingChar";

interface FlowSessionProps {
  idea: string;
  duration: number;
  onEnd: (rawText: string) => void;
  onBack: () => void;
}

interface FloatingCharData {
  id: number;
  char: string;
  birthIndex: number;
  flushing?: boolean;
}

export function FlowSession({
  idea,
  duration,
  onEnd,
  onBack,
}: FlowSessionProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [floatingChars, setFloatingChars] = useState<FloatingCharData[]>([]);
  const [totalChars, setTotalChars] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const allTextRef = useRef("");
  const totalCharsRef = useRef(0);
  const nextIdRef = useRef(0);
  const ended = useRef(false);
  const ready = useRef(false);

  // Ignore keypresses that bleed through from the previous screen
  useEffect(() => {
    const t = setTimeout(() => {
      ready.current = true;
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Timer — measured against a fixed deadline so background-tab
  // throttling can't stretch the session
  useEffect(() => {
    const deadline = Date.now() + duration * 60_000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 250);
    return () => clearInterval(interval);
  }, [duration]);

  const finish = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    onEnd(allTextRef.current);
  }, [onEnd]);

  // End session when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0) finish();
  }, [timeLeft, finish]);

  const releaseChar = useCallback((char: string) => {
    if (!ready.current || ended.current) return;

    allTextRef.current += char;

    totalCharsRef.current++;
    const birthIndex = totalCharsRef.current;
    const id = nextIdRef.current++;
    setFloatingChars((prev) => [...prev, { id, char, birthIndex }]);
    setTotalChars(totalCharsRef.current);

    if (char === " " || char === "\n") {
      const words = allTextRef.current.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  }, []);

  const removeFloatingChar = useCallback((id: number) => {
    setFloatingChars((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Input goes through a hidden textarea so IME / composed input works.
  // Its value is drained into floating chars on every input.
  function drain(el: HTMLTextAreaElement) {
    for (const char of el.value) releaseChar(char);
    el.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      releaseChar("\n");
      setFloatingChars((prev) => prev.map((c) => ({ ...c, flushing: true })));
    } else if (e.key === "Backspace" || e.key === "Delete") {
      // No editing in flow — keep moving forward
      e.preventDefault();
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    if ((e.nativeEvent as InputEvent).isComposing) return;
    drain(e.currentTarget);
  }

  // Leaving early keeps what you wrote; with nothing written, just go back
  function handleBack() {
    if (allTextRef.current.trim()) finish();
    else onBack();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back arrow — top left */}
      <motion.button
        aria-label="End session"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleBack}
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
      </motion.button>

      {/* Idea text — centered top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          paddingTop: "2.5rem",
          fontSize: "1.8rem",
          fontWeight: 500,
          color: "#999",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#ccc", marginRight: "0.4rem" }}>#</span>
        {idea}
      </motion.div>

      {/* Timer + word count — top right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: "absolute",
          top: "2rem",
          right: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.25rem",
        }}
      >
        <NumberFlowGroup>
          <div
            style={{
              fontSize: "0.9rem",
              fontFamily: "'Commit Mono', monospace",
              fontWeight: 300,
              color: "#b0b0b0",
              fontVariantNumeric: "tabular-nums",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <NumberFlow value={minutes} trend={-1} animated />
            <span>:</span>
            <NumberFlow
              value={seconds}
              trend={-1}
              format={{ minimumIntegerDigits: 2 }}
              animated
            />
          </div>
        </NumberFlowGroup>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 300,
            color: "#c0c0c0",
            display: "flex",
            alignItems: "baseline",
            gap: "0.3em",
          }}
        >
          <span style={{ fontFamily: "'Commit Mono', monospace" }}>
            <NumberFlow value={wordCount} trend={1} animated />
          </span>
          <span>{wordCount === 1 ? "word" : "words"}</span>
        </div>
      </motion.div>

      {/* Floating chars area — shifted up */}
      <div
        style={{
          flex: 1,
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-5vh",
        }}
      >
        {floatingChars.map((c) => (
          <FloatingChar
            key={c.id}
            char={c.char}
            birthIndex={c.birthIndex}
            totalChars={totalChars}
            flushing={c.flushing}
            onComplete={() => removeFloatingChar(c.id)}
          />
        ))}

        {/* Blinking cursor + hidden input */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
          }}
        >
          <textarea
            aria-label="Write"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onCompositionEnd={(e) => drain(e.currentTarget)}
            onBlur={(e) => e.currentTarget.focus()}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              border: 0,
              opacity: 0,
              resize: "none",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: totalChars > 0 ? "1px" : "2px",
              height: "2em",
              backgroundColor: totalChars > 0 ? "#ccc" : "#999",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
