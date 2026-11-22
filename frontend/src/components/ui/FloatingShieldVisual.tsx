"use client";

import React, { useState, useEffect } from "react";
import { Shield, Sparkles, Lock, CheckCircle2 } from "lucide-react";

export const FloatingShieldVisual: React.FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16; // ±8px
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Outer Nyra Blue Aurora Radial Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2177D1]/20 via-[#3A8EE0]/10 to-transparent blur-3xl pointer-events-none transform transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${offset.x * 1.5}px, ${offset.y * 1.5}px)`,
        }}
      />

      {/* Geometric Ambient Rings */}
      <div className="absolute inset-4 rounded-full border border-[#383E4E]/40 border-dashed animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-10 rounded-full border border-[#2177D1]/30 animate-[spin_40s_linear_infinite_reverse]" />

      {/* Parallax Frosted Shield Prism Container */}
      <div
        className="relative z-10 w-48 h-56 rounded-3xl bg-[#121620]/80 backdrop-blur-xl border border-[#383E4E] shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(33,119,209,0.3)] flex flex-col items-center justify-center p-6 text-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.4}deg)`,
        }}
      >
        {/* Crisp Hexagon/Shield Core */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2177D1] to-[#1658A8] flex items-center justify-center shadow-[0_0_25px_rgba(33,119,209,0.5)]">
            <Shield className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#34C759] border-2 border-[#121620] flex items-center justify-center shadow-[0_0_10px_rgba(52,199,89,0.5)]">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Telemetry Labels inside Prism */}
        <span className="font-mono text-xs font-bold tracking-tight text-white uppercase block">
          NYRA SHIELD
        </span>
        <span className="font-mono text-[10px] text-[#3A8EE0] mt-0.5 block">
          A2UI v1.0 · Zero-Trust
        </span>

        {/* Micro Status Chip */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0B0E14] border border-[#383E4E]/70 text-[9px] font-mono text-[#B6BAC5]">
          <Lock className="w-2.5 h-2.5 text-[#34C759]" />
          <span>PII Scrubber Active</span>
        </div>
      </div>
    </div>
  );
};
