"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp, Copy, Check, Radio } from "lucide-react";
import { SurfaceState } from "./a2ui/processor";

interface A2UIWireInspectorProps {
  surfaces?: Map<string, SurfaceState>;
  latestA2UIMessages: any[];
}

export const A2UIWireInspector: React.FC<A2UIWireInspectorProps> = ({
  surfaces,
  latestA2UIMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSurfaceId, setActiveSurfaceId] = useState<string | null>(null);

  const surfaceList = surfaces ? Array.from(surfaces.values()) : [];
  const selectedSurface =
    (activeSurfaceId && surfaces?.get(activeSurfaceId)) ||
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
    <div className="w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-200">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition select-none"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#2177D1]" />
          <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
            A2UI PROTOCOL WIRE INSPECTOR
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            application/a2ui+json · v0.9
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 font-medium">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>{latestA2UIMessages.length > 0 ? `${latestA2UIMessages.length} Envelopes` : "Ready"}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="p-4 space-y-3 font-mono text-xs bg-white">
          {/* Surface Selector Pills */}
          {surfaceList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-500 uppercase text-[10px] font-medium">Surface:</span>
              {surfaceList.map((s) => (
                <button
                  key={s.surfaceId}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSurfaceId(s.surfaceId);
                  }}
                  className={`px-2.5 py-1 rounded-md border transition cursor-pointer font-medium ${
                    selectedSurface && selectedSurface.surfaceId === s.surfaceId
                      ? "bg-[#2177D1] border-[#2177D1] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {s.surfaceId.slice(0, 16)}...
                </button>
              ))}
            </div>
          )}

          {/* Quick Copy Action */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <span>
              Catalog:{" "}
              <span className="text-blue-700 font-semibold">
                {selectedSurface?.catalogId || "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}
              </span>
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
              <span>{copied ? "Copied JSON" : "Copy Payload"}</span>
            </button>
          </div>

          {/* JSON Tree View */}
          <div className="max-h-72 overflow-y-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
            <pre className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap">
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
