/**
 * scrollCraftEngine.ts
 * Clean React-adapted runtime for genuine scroll-craft mechanics:
 * - --sc-p normalized scroll progress for acts/sections
 * - [data-sc-tilt="deg"] smooth 3D pointer tilt with spring damping
 * - [data-sc-magnet="k"] magnetic cursor pull inside bounds
 * - [data-sc-spotlight] dynamic specular sheen coordinates (--sc-mx, --sc-my)
 * - AnimatedNumber kinetic count-up component
 */

"use client";

import React, { useEffect, useState, useRef } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function clamp01(v: number) {
  return clamp(v, 0, 1);
}

interface TiltItem {
  el: HTMLElement;
  max: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

interface MagnetItem {
  el: HTMLElement;
  k: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

export function initScrollCraft(root: HTMLElement | Document = document): () => void {
  if (typeof window === "undefined") return () => {};

  let isDead = false;
  let rafId: number | null = null;
  const tilts: TiltItem[] = [];
  const magnets: MagnetItem[] = [];
  const spots: HTMLElement[] = [];
  const actEls: HTMLElement[] = [];

  // 1. Collect elements
  const tiltNodes = root.querySelectorAll<HTMLElement>("[data-sc-tilt]");
  tiltNodes.forEach((el) => {
    tilts.push({
      el,
      max: parseFloat(el.getAttribute("data-sc-tilt") || "6") || 6,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
    });
  });

  const magnetNodes = root.querySelectorAll<HTMLElement>("[data-sc-magnet]");
  magnetNodes.forEach((el) => {
    magnets.push({
      el,
      k: parseFloat(el.getAttribute("data-sc-magnet") || "0.2") || 0.2,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
    });
  });

  const spotNodes = root.querySelectorAll<HTMLElement>("[data-sc-spotlight]");
  spotNodes.forEach((el) => spots.push(el));

  const acts = root.querySelectorAll<HTMLElement>("[data-sc-act], [data-sc-section]");
  acts.forEach((el) => actEls.push(el));

  // 2. Scroll Progress (--sc-p)
  const onScroll = () => {
    if (isDead) return;
    const vh = window.innerHeight || 800;
    const scrollY = window.scrollY || window.pageYOffset;

    actEls.forEach((act) => {
      const rect = act.getBoundingClientRect();
      const top = rect.top + scrollY;
      const height = rect.height;
      const mode = act.getAttribute("data-sc-act") || "flow";

      let p = 0;
      if (mode === "pin") {
        const pinTravel = height - vh;
        p = pinTravel > 0 ? clamp01((scrollY - top) / pinTravel) : 0;
      } else {
        // flow
        p = clamp01((scrollY + vh - top) / (height + vh));
      }
      act.style.setProperty("--sc-p", p.toFixed(4));
    });
  };

  // 3. Pointer Move for Tilts, Magnets & Spotlights
  const onPointerMove = (e: PointerEvent) => {
    if (isDead || e.pointerType !== "mouse") return;
    const vh = window.innerHeight;

    for (let i = 0; i < tilts.length; i++) {
      const T = tilts[i];
      const r = T.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) {
        T.tx = 0;
        T.ty = 0;
        continue;
      }
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const inside = Math.abs(nx) < 1.4 && Math.abs(ny) < 1.4;
      T.tx = inside ? clamp(ny, -1, 1) * -T.max : 0;
      T.ty = inside ? clamp(nx, -1, 1) * T.max : 0;
    }

    for (let m = 0; m < magnets.length; m++) {
      const M = magnets[m];
      const mr = M.el.getBoundingClientRect();
      const dx = e.clientX - (mr.left + mr.width / 2);
      const dy = e.clientY - (mr.top + mr.height / 2);
      const near = Math.abs(dx) < mr.width && Math.abs(dy) < mr.height * 2.5;
      M.tx = near ? dx * M.k : 0;
      M.ty = near ? dy * M.k : 0;
    }

    for (let s = 0; s < spots.length; s++) {
      const sr = spots[s].getBoundingClientRect();
      spots[s].style.setProperty("--sc-mx", clamp01((e.clientX - sr.left) / sr.width).toFixed(3));
      spots[s].style.setProperty("--sc-my", clamp01((e.clientY - sr.top) / sr.height).toFixed(3));
    }
  };

  // 4. Spring RAF Loop
  const tick = () => {
    if (isDead) return;

    for (let i = 0; i < tilts.length; i++) {
      const T = tilts[i];
      T.x += (T.tx - T.x) * 0.1;
      T.y += (T.ty - T.y) * 0.1;
      if (Math.abs(T.x) > 0.001 || Math.abs(T.y) > 0.001) {
        T.el.style.transform = `perspective(1100px) rotateX(${T.x.toFixed(2)}deg) rotateY(${T.y.toFixed(2)}deg)`;
      }
    }

    for (let m = 0; m < magnets.length; m++) {
      const M = magnets[m];
      M.x += (M.tx - M.x) * 0.14;
      M.y += (M.ty - M.y) * 0.14;
      if (Math.abs(M.x) > 0.01 || Math.abs(M.y) > 0.01) {
        M.el.style.transform = `translate3d(${M.x.toFixed(2)}px, ${M.y.toFixed(2)}px, 0)`;
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  onScroll();
  rafId = requestAnimationFrame(tick);

  return () => {
    isDead = true;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointerMove);
    tilts.forEach((t) => {
      t.el.style.transform = "";
    });
    magnets.forEach((m) => {
      m.el.style.transform = "";
    });
  };
}

export function useScrollCraft(deps: any[] = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const destroy = initScrollCraft();
      return destroy;
    }, 50);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * AnimatedNumber
 * Kinetic count-up ticker for KPI tiles and counters
 */
export function AnimatedNumber({
  value,
  duration = 750,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const startVal = prevValue.current;
    const endVal = value;
    prevValue.current = value;
    if (startVal === endVal) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
