"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnMount?: boolean;
}

const GLYPHS = "0123456789ABCDEF!@#$%&*<>[]{}";

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = "",
  scrambleOnMount = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const triggerScramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < (iteration / maxIterations) * text.length) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 25);
  }, [text, isScrambling]);

  useEffect(() => {
    if (scrambleOnMount) {
      triggerScramble();
    }
  }, [scrambleOnMount, triggerScramble]);

  return (
    <span
      onMouseEnter={triggerScramble}
      className={`font-mono inline-block cursor-default select-none ${className}`}
    >
      {displayText}
    </span>
  );
};
