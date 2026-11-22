"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp, Copy, Check, Radio } from "lucide-react";
import { SurfaceState } from "./a2ui/processor";

interface A2UIWireInspectorProps {
  surfaces: Map<string, SurfaceState>;
  latestA2UIMessages: any[];
}

export const A2UIWireInspector: React.FC<A2UIWireInspectorProps> = ({
  surfaces,
  latestA2UIMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSurfaceId, setActiveSurfaceId] = useState<string | null>(null);

  const surfaceList = Array.from(surfaces.values());
  const selectedSurface =
    (activeSurfaceId && surfaces.get(activeSurfaceId)) ||
    (surfaceList.length > 0 ? surfaceList[surfaceList.length - 1] : null);

  const handleCopy = () => {
    const content = JSON.stringify(
      selectedSurface ? selectedSurface.rawMessages : latestA2UIMessages,
      null,
      2
    );
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#121620]/90 border border-[#383E4E] overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#0B0E14] border-b border-[#383E4E]/60 flex items-center justify-between cursor-pointer hover:bg-[#121620]/80 transition select-none"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#3A8EE0]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            A2UI PROTOCOL WIRE INSPECTOR
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2177D1]/15 text-[#3A8EE0] border border-[#2177D1]/30">
            application/a2ui+json
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#34C759]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>{surfaceList.length} Active Surfaces</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="p-4 space-y-3 font-mono text-xs bg-[#0B0E14]">
          {/* Surface Selector Pills */}
          {surfaceList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-500 uppercase text-[10px]">Surface:</span>
              {surfaceList.map((s) => (
                <button
                  key={s.surfaceId}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSurfaceId(s.surfaceId);
                  }}
                  className={`px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    (selectedSurface && selectedSurface.surfaceId === s.surfaceId)
                      ? "bg-[#2177D1] border-[#3A8EE0] text-white"
                      : "bg-[#121620] border-[#383E4E] text-slate-400 hover:text-white"
                  }`}
                >
                  {s.surfaceId.slice(0, 16)}...
                </button>
              ))}
            </div>
          )}

          {/* Quick Copy Action */}
          <div className="flex items-center justify-between text-[11px] text-[#B6BAC5] pt-1 border-t border-[#383E4E]/40">
            <span>
              Catalog: <span className="text-[#3A8EE0] font-semibold">{selectedSurface?.catalogId || "nyra.ffe.mobile.v1"}</span>
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#121620] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#383E4E] transition cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied JSON" : "Copy Payload"}</span>
            </button>
          </div>

          {/* JSON Tree View */}
          <div className="max-h-72 overflow-y-auto p-3 rounded-xl bg-[#090C12] border border-[#383E4E]/60 text-slate-300 custom-scrollbar">
            <pre className="text-[11px] leading-relaxed">
              {JSON.stringify(
                selectedSurface
                  ? {
                      surfaceId: selectedSurface.surfaceId,
                      catalogId: selectedSurface.catalogId,
                      dataModel: selectedSurface.dataModel,
                      envelopes: selectedSurface.rawMessages,
                    }
                  : latestA2UIMessages,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
