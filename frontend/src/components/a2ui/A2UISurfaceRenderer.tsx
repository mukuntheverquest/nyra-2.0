"use client";

import React, { useState } from "react";
import { SurfaceState } from "./processor";
import { WIDGET_REGISTRY, isComponentWhitelisted } from "./NyraWidgetCatalog";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

export interface A2UISurfaceRendererProps {
  surface: SurfaceState;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
}

export const A2UISurfaceRenderer: React.FC<A2UISurfaceRendererProps> = ({ surface, onAction }) => {
  const [showWireDrawer, setShowWireDrawer] = useState(false);

  const renderComponentNode = (componentId: string): React.ReactNode => {
    const comp = surface.componentsById.get(componentId);
    if (!comp) {
      return null;
    }

    if (!isComponentWhitelisted(comp.component)) {
      return (
        <div className="p-2 border border-dashed border-red-500/50 rounded text-[11px] font-mono text-red-400 bg-red-950/20">
          [A2UI Security Boundary] Unregistered component discriminator: &quot;{comp.component}&quot;
        </div>
      );
    }

    const ComponentWidget = WIDGET_REGISTRY[comp.component];
    return (
      <ComponentWidget
        key={comp.id}
        component={comp}
        dataModel={surface.dataModel}
        renderChild={renderComponentNode}
        onAction={(actionName, context) => onAction(surface.surfaceId, actionName, context, surface.dataModel)}
      />
    );
  };

  const rootComponent = surface.componentsById.get("root");

  if (!rootComponent) {
    return (
      <div className="p-3 rounded-lg border border-[#383E4E]/50 bg-[#121620]/60 text-xs text-slate-400 font-mono">
        Waiting for A2UI root envelope... ({surface.surfaceId})
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      {/* Render component tree from root */}
      {renderComponentNode("root")}

      {/* Monospace A2UI wire drawer toggle */}
      <div className="mt-1 flex justify-end">
        <button
          onClick={() => setShowWireDrawer(!showWireDrawer)}
          className="text-[10px] font-mono text-[#64748B] hover:text-[#3A8EE0] flex items-center gap-1 transition-colors px-1 py-0.5 rounded cursor-pointer"
          title="Toggle A2UI v1.0 Wire Inspector"
        >
          <Code className="w-3 h-3" />
          <span>&lt;/&gt; A2UI</span>
          {showWireDrawer ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
        </button>
      </div>

      {/* Inline wire inspector drawer */}
      {showWireDrawer && (
        <div className="mt-1 p-2.5 rounded-lg bg-[#0B0E14] border border-[#383E4E] font-mono text-[10px] text-slate-300 overflow-x-auto max-h-48">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#383E4E]/50 text-slate-400 font-semibold">
            <span>surfaceId: {surface.surfaceId}</span>
            <span className="text-[#3A8EE0]">{surface.catalogId}</span>
          </div>
          <div className="mb-2">
            <span className="text-slate-500 uppercase text-[9px] block">Live Data Model:</span>
            <pre className="text-[#34C759] mt-0.5">{JSON.stringify(surface.dataModel, null, 2)}</pre>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[9px] block">Raw Envelopes ({surface.rawMessages.length}):</span>
            <pre className="text-slate-400 mt-0.5">{JSON.stringify(surface.rawMessages, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
