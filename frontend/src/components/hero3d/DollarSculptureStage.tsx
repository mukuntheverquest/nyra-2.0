"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DOLLAR_BLOCKS, BLOCK_STEP, SculptureBlockSpec } from "./dollarBlocks";
import { ArrowDown, ArrowUpRight, Shield } from "lucide-react";

interface DollarSculptureStageProps {
  onJumpToApp: () => void;
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const DollarSculptureStage: React.FC<DollarSculptureStageProps> = ({
  onJumpToApp,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SVG callout element refs
  const calloutGroupRef = useRef<SVGSVGElement>(null);
  const anchorDotRefs = useRef<{ [id: string]: SVGCircleElement | null }>({});
  const outerRingRefs = useRef<{ [id: string]: SVGCircleElement | null }>({});
  const polylineRefs = useRef<{ [id: string]: SVGPolylineElement | null }>({});
  const labelGroupRefs = useRef<{ [id: string]: SVGGElement | null }>({});

  // Storytelling beat DOM refs (for 60fps zero-react-render opacity/transform updates)
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  // Animation & scroll state refs
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    // Detect reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#F8FAFC", 11, 24);

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    // 2. Studio 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight("#FFFFFF", "#CBD5E1", 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#FFFFFF", 2.1);
    keyLight.position.set(-6, 8, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#3B82F6", 2.4);
    rimLight.position.set(7, 3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight("#E0ECFF", 0.9);
    fillLight.position.set(5, -6, 6);
    scene.add(fillLight);

    // Glowing center PointLight (Nyra Blue spill onto inner ceramic faces)
    const centerPointLight = new THREE.PointLight("#3B82F6", 4.5, 6.0);
    centerPointLight.position.set(0, 0, 0.2);
    scene.add(centerPointLight);

    // 3. Ground Architectural Grid & Soft Contact Shadow
    const grid = new THREE.GridHelper(24, 28, "#CBD5E1", "#E2E8F0");
    grid.position.y = -3.45;
    if (grid.material instanceof THREE.Material) {
      grid.material.transparent = true;
      grid.material.opacity = 0.28;
    }
    grid.rotation.x = 0.05;
    scene.add(grid);

    // Shadow Disc
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(15, 23, 42, 0.16)");
      grad.addColorStop(0.5, "rgba(15, 23, 42, 0.05)");
      grad.addColorStop(1, "rgba(15, 23, 42, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.44;
    scene.add(shadowMesh);

    // 4. Floating Micro-Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: "#93C5FD",
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Build Modular $ Sculpture Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Reusable Geometries
    const sGeom = new RoundedBoxGeometry(0.55, 0.55, 0.54, 4, 0.065);
    const stemGeom = new RoundedBoxGeometry(0.52, 0.54, 0.46, 4, 0.06);
    const detachedGeom = new RoundedBoxGeometry(0.46, 0.46, 0.46, 4, 0.06);

    // Frosted Ceramic Materials
    const sMaterial = new THREE.MeshPhysicalMaterial({
      color: "#E8EEF5",
      roughness: 0.32,
      metalness: 0.06,
      clearcoat: 0.45,
      clearcoatRoughness: 0.28,
    });

    const stemMaterial = new THREE.MeshPhysicalMaterial({
      color: "#DCE5F2",
      roughness: 0.36,
      metalness: 0.08,
      clearcoat: 0.35,
    });

    const detachedMaterial = new THREE.MeshPhysicalMaterial({
      color: "#E8EEF5",
      roughness: 0.32,
      metalness: 0.06,
      clearcoat: 0.45,
      clearcoatRoughness: 0.28,
    });

    // Hairline wireframe edges for 4 detached blocks
    const detachedEdgesGeom = new THREE.EdgesGeometry(detachedGeom);
    const detachedLineMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.35,
    });

    // Glowing Inner Core boxes inside key sculpture joints
    const coreMat = new THREE.MeshStandardMaterial({
      color: "#2563EB",
      emissive: "#3B82F6",
      emissiveIntensity: 2.4,
      roughness: 0.2,
    });
    const coreBoxGeom = new THREE.BoxGeometry(0.42, 0.42, 0.32);
    const corePositions = [
      [0, 0, -0.02],
      [0, 1.25, -0.02],
      [0, -1.25, -0.02],
      [-0.6, 0.6, -0.02],
      [0.6, -0.6, -0.02],
    ];
    corePositions.forEach(([cx, cy, cz]) => {
      const coreMesh = new THREE.Mesh(coreBoxGeom, coreMat);
      coreMesh.position.set(cx, cy, cz);
      sculptureGroup.add(coreMesh);
    });

    // Instantiate the 25 blocks
    interface BlockRuntime {
      spec: SculptureBlockSpec;
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      explodeVec: THREE.Vector3;
    }

    const blockRuntimes: BlockRuntime[] = [];

    DOLLAR_BLOCKS.forEach((spec) => {
      let geom: THREE.BufferGeometry = sGeom;
      let mat: THREE.Material = sMaterial;

      if (spec.role === "stem") {
        geom = stemGeom;
        mat = stemMaterial;
      } else if (spec.role === "detached") {
        geom = detachedGeom;
        mat = detachedMaterial;
      }

      const mesh = new THREE.Mesh(geom, mat);
      const basePos = new THREE.Vector3(
        spec.gx * BLOCK_STEP,
        spec.gy * BLOCK_STEP,
        spec.gz
      );
      mesh.position.copy(basePos);

      // Add wireframe lines if detached block
      if (spec.role === "detached") {
        const wire = new THREE.LineSegments(detachedEdgesGeom, detachedLineMat);
        mesh.add(wire);
      }

      sculptureGroup.add(mesh);

      blockRuntimes.push({
        spec,
        mesh,
        basePos,
        explodeVec: new THREE.Vector3(...spec.explodeOffset),
      });
    });

    // 6. Passive Scroll and Mouse Listeners
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw =
        scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      targetScrollRef.current = raw;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseRef.current = { x: nx, y: ny };
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    // 7. 60FPS Render & Choreography Loop (ZERO setState)
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const detachedBlocks = blockRuntimes.filter((b) => b.spec.callout);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth damping
      currentScrollRef.current +=
        (targetScrollRef.current - currentScrollRef.current) * 0.08;
      currentMouseRef.current.x +=
        (targetMouseRef.current.x - currentMouseRef.current.x) * 0.06;
      currentMouseRef.current.y +=
        (targetMouseRef.current.y - currentMouseRef.current.y) * 0.06;

      const p = currentScrollRef.current;
      const mx = currentMouseRef.current.x;
      const my = currentMouseRef.current.y;
      const elapsedTime = clock.getElapsedTime();

      // Gentle sinusoidal hover (disabled if prefersReducedMotion)
      const hover = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.5) * 0.08;
      particles.rotation.y = elapsedTime * 0.02;

      // 4-Beat Scroll Transformations:
      // Position X, Position Y, Rotation Y, Explosion Factor
      let posX = 0;
      let posY = 0.1 + hover;
      let rotY = mx * 0.22;
      let scale = 1.0;
      let stageAlpha = 1.0;

      // Explode factors per layer (1: Bill, 2: Scam, 3: Impact)
      let explodeL1 = 0;
      let explodeL2 = 0;
      let explodeL3 = 0;

      if (p <= 0.18) {
        // Beat 0: Assembled center, pure calm hero
        posX = 0;
        posY = 0.1 + hover;
        rotY = mx * 0.22;
        explodeL1 = 0;
        explodeL2 = 0;
        explodeL3 = 0;
      } else if (p <= 0.44) {
        // Beat 1: Shift Left, Layer 1 opens, Beat 1 text on Right
        const t = (p - 0.18) / (0.44 - 0.18);
        const s = smoothstep(0, 1, t);
        posX = THREE.MathUtils.lerp(0, -2.15, s);
        posY = THREE.MathUtils.lerp(0.1 + hover, 0.0 + hover, s);
        rotY = THREE.MathUtils.lerp(0, 0.38, s) + mx * 0.18;
        explodeL1 = THREE.MathUtils.lerp(0, 0.6, s);
        explodeL2 = THREE.MathUtils.lerp(0, 0.2, s);
        explodeL3 = 0;
      } else if (p <= 0.70) {
        // Beat 2: Shift Right, Peak Explosion (all 3 layers open), Beat 2 text on Left
        const t = (p - 0.44) / (0.70 - 0.44);
        const s = smoothstep(0, 1, t);
        posX = THREE.MathUtils.lerp(-2.15, 2.15, s);
        posY = 0.0 + hover;
        rotY = THREE.MathUtils.lerp(0.38, -0.42, s) + mx * 0.18;
        explodeL1 = THREE.MathUtils.lerp(0.6, 1.0, s);
        explodeL2 = THREE.MathUtils.lerp(0.2, 1.0, s);
        explodeL3 = THREE.MathUtils.lerp(0, 0.85, s);
      } else if (p <= 0.90) {
        // Beat 3: Reassemble center, Beat 3 text Centered below
        const t = (p - 0.70) / (0.90 - 0.70);
        const s = smoothstep(0, 1, t);
        posX = THREE.MathUtils.lerp(2.15, 0, s);
        posY = THREE.MathUtils.lerp(0.0 + hover, 0.55 + hover, s);
        rotY = THREE.MathUtils.lerp(-0.42, 0, s) + mx * 0.18;
        explodeL1 = THREE.MathUtils.lerp(1.0, 0, s);
        explodeL2 = THREE.MathUtils.lerp(1.0, 0, s);
        explodeL3 = THREE.MathUtils.lerp(0.85, 0, s);
      } else {
        // Handoff to #live-workspace
        const t = (p - 0.90) / (1.0 - 0.90);
        const s = smoothstep(0, 1, t);
        posX = 0;
        posY = THREE.MathUtils.lerp(0.55 + hover, 0.85, s);
        rotY = mx * 0.18;
        scale = THREE.MathUtils.lerp(1.0, 0.82, s);
        stageAlpha = THREE.MathUtils.lerp(1.0, 0.0, s);
        explodeL1 = 0;
        explodeL2 = 0;
        explodeL3 = 0;
      }

      sculptureGroup.position.set(posX, posY, 0);
      sculptureGroup.rotation.y = rotY;
      sculptureGroup.rotation.x = my * -0.12;
      sculptureGroup.scale.setScalar(scale);

      // Apply dynamic block explosion positions
      blockRuntimes.forEach(({ spec, mesh, basePos, explodeVec }) => {
        let factor = 0;
        if (spec.layer === 1) factor = explodeL1;
        else if (spec.layer === 2) factor = explodeL2;
        else factor = explodeL3;

        mesh.position.copy(basePos).addScaledVector(explodeVec, factor);
      });

      // Update 3D-to-2D Floating Wireframe Callouts directly via DOM
      const calloutAlpha = width >= 768 ? smoothstep(0.20, 0.08, p) : 0;
      if (calloutGroupRef.current) {
        calloutGroupRef.current.style.opacity = `${calloutAlpha}`;
      }

      if (calloutAlpha > 0.01) {
        detachedBlocks.forEach(({ spec, mesh }) => {
          if (!spec.callout) return;
          mesh.getWorldPosition(tempVec);
          tempVec.project(camera);

          const sx = (tempVec.x * 0.5 + 0.5) * width;
          const sy = (-tempVec.y * 0.5 + 0.5) * height;
          const { labelDx, labelDy } = spec.callout;
          const ex = sx + labelDx * 0.55;
          const ey = sy + labelDy;
          const tx = sx + labelDx;
          const ty = sy + labelDy;

          const dot = anchorDotRefs.current[spec.id];
          const ring = outerRingRefs.current[spec.id];
          const poly = polylineRefs.current[spec.id];
          const label = labelGroupRefs.current[spec.id];

          if (dot) {
            dot.setAttribute("cx", sx.toFixed(1));
            dot.setAttribute("cy", sy.toFixed(1));
          }
          if (ring) {
            ring.setAttribute("cx", sx.toFixed(1));
            ring.setAttribute("cy", sy.toFixed(1));
          }
          if (poly) {
            poly.setAttribute(
              "points",
              `${sx.toFixed(1)},${sy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`
            );
          }
          if (label) {
            label.setAttribute("transform", `translate(${tx.toFixed(1)}, ${ty.toFixed(1)})`);
          }
        });
      }

      // Update Editorial Story Beats Opacity & Transforms
      // Beat 1: Active during 0.18 -> 0.44
      const beat1Alpha =
        smoothstep(0.18, 0.25, p) * (1 - smoothstep(0.40, 0.46, p));
      if (beat1Ref.current) {
        beat1Ref.current.style.opacity = `${beat1Alpha}`;
        beat1Ref.current.style.transform = `translateY(${(1 - beat1Alpha) * 16}px)`;
        beat1Ref.current.style.pointerEvents = beat1Alpha > 0.2 ? "auto" : "none";
      }

      // Beat 2: Active during 0.44 -> 0.70
      const beat2Alpha =
        smoothstep(0.44, 0.52, p) * (1 - smoothstep(0.66, 0.72, p));
      if (beat2Ref.current) {
        beat2Ref.current.style.opacity = `${beat2Alpha}`;
        beat2Ref.current.style.transform = `translateY(${(1 - beat2Alpha) * 16}px)`;
        beat2Ref.current.style.pointerEvents = beat2Alpha > 0.2 ? "auto" : "none";
      }

      // Beat 3: Active during 0.70 -> 0.90
      const beat3Alpha =
        smoothstep(0.70, 0.76, p) * (1 - smoothstep(0.88, 0.92, p));
      if (beat3Ref.current) {
        beat3Ref.current.style.opacity = `${beat3Alpha}`;
        beat3Ref.current.style.transform = `translate(-50%, ${(1 - beat3Alpha) * 16}px)`;
        beat3Ref.current.style.pointerEvents = beat3Alpha > 0.2 ? "auto" : "none";
      }

      // 4-Corner HUD: Fades out during handoff to workspace
      const hudAlpha = 1 - smoothstep(0.88, 0.96, p);
      if (hudRef.current) {
        hudRef.current.style.opacity = `${hudAlpha}`;
      }

      // Bottom-Left Progress Track
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
      }

      // Canvas Alpha Fade during handoff
      canvas.style.opacity = `${stageAlpha}`;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose Geometries and Materials
      sGeom.dispose();
      stemGeom.dispose();
      detachedGeom.dispose();
      sMaterial.dispose();
      stemMaterial.dispose();
      detachedMaterial.dispose();
      detachedEdgesGeom.dispose();
      detachedLineMat.dispose();
      coreMat.dispose();
      coreBoxGeom.dispose();
      grid.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  const detachedSpecs = DOLLAR_BLOCKS.filter((b) => b.callout);

  return (
    <section ref={sectionRef} className="relative h-[400vh] w-full bg-white">
      {/* Sticky 100vh Viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-white"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #F8FAFC 58%, #EEF2F7 100%)",
        }}
      >
        {/* Subtle Architectural Grid on Canvas Plane */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

        {/* 3D WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full transition-opacity duration-300" />

        {/* Floating 3D-to-2D SVG Wireframe Callouts */}
        <svg
          ref={calloutGroupRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-300"
        >
          {detachedSpecs.map((spec) => {
            const isLeft = (spec.callout?.labelDx || 0) < 0;
            return (
              <g key={spec.id} className="select-none font-mono">
                {/* 3D Anchor Dot */}
                <circle
                  ref={(el) => {
                    anchorDotRefs.current[spec.id] = el;
                  }}
                  r="3.5"
                  fill="#2563EB"
                />
                {/* Outer Ring */}
                <circle
                  ref={(el) => {
                    outerRingRefs.current[spec.id] = el;
                  }}
                  r="7"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="1"
                />
                {/* Leader Polyline */}
                <polyline
                  ref={(el) => {
                    polylineRefs.current[spec.id] = el;
                  }}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                {/* Monospace Wireframe Label Group */}
                <g
                  ref={(el) => {
                    labelGroupRefs.current[spec.id] = el;
                  }}
                >
                  <rect
                    x={isLeft ? -150 : 0}
                    y={-14}
                    width={150}
                    height={30}
                    fill="rgba(255, 255, 255, 0.88)"
                    rx={6}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                  <text
                    x={isLeft ? -8 : 8}
                    y={-1}
                    textAnchor={isLeft ? "end" : "start"}
                    className="font-mono text-[11px] font-bold fill-[#0F172A] tracking-wider"
                  >
                    [{spec.callout?.code}] {spec.callout?.title}
                  </text>
                  <text
                    x={isLeft ? -8 : 8}
                    y={11}
                    textAnchor={isLeft ? "end" : "start"}
                    className="font-mono text-[9px] fill-[#64748B] tracking-wide"
                  >
                    {spec.callout?.sub}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Igloo-Style 4-Corner HUD */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 select-none transition-opacity duration-300"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between">
            {/* Top-Left: Brand Lockup */}
            <div className="pointer-events-auto flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2177D1] flex items-center justify-center text-white shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-base font-extrabold tracking-tight text-[#0F172A]">
                    NYRA 2.0
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    A2UI v0.9
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#64748B] block leading-none mt-0.5">
                  // Financial Futures Education · Canada
                </span>
              </div>
            </div>

            {/* Top-Right: Mission Narrative */}
            <div className="hidden sm:block text-right max-w-[270px] space-y-1">
              <span className="text-[11px] font-mono text-[#2563EB] font-bold block">
                ////// Mission
              </span>
              <p className="text-[11.5px] font-mono text-[#334155] leading-relaxed">
                Empowering Canadian youth to never miss a bill and never fall for a scam. Zero bank logins. 20% of profits fund free workshops.
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between">
            {/* Bottom-Left: Scroll Progress Track */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#475569]">
                <ArrowDown className="w-3.5 h-3.5 text-[#2563EB] animate-bounce" />
                <span>Scroll down to discover</span>
              </div>
              <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  ref={progressFillRef}
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-75"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            {/* Bottom-Right: Quick Jump Pill */}
            <button
              onClick={onJumpToApp}
              className="pointer-events-auto px-4 py-2 rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm text-xs font-mono font-medium text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB] transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Jump to Live App</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Beat 1: Right-Side Editorial Panel (0.18 -> 0.44) */}
        <div
          ref={beat1Ref}
          style={{ opacity: 0 }}
          className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 max-w-md z-30 space-y-4 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-[#2563EB] font-semibold">
            <span>BILL & TRIAL GUARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] font-sans">
            NEVER MISS A BILL.
          </h2>
          <p className="text-sm text-slate-600 font-sans leading-relaxed">
            Auto-rolling monthly due dates, credit card statement vs. due cycles, PAD balance warnings, and 48-hour free-trial kill-switches via simple conversational SMS.
          </p>
          <div className="pt-2 flex items-center gap-3 font-mono text-xs text-emerald-700">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 font-bold">
              0 LATE FEES
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">1-TAP SMS MARK PAID</span>
          </div>
        </div>

        {/* Beat 2: Left-Side Editorial Panel (0.44 -> 0.70) */}
        <div
          ref={beat2Ref}
          style={{ opacity: 0 }}
          className="absolute left-6 sm:left-16 top-1/2 -translate-y-1/2 max-w-md z-30 space-y-4 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-mono text-red-700 font-semibold">
            <span>CANADIAN SCAM SHIELD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] font-sans">
            NEVER FALL FOR A SCAM.
          </h2>
          <p className="text-sm text-slate-600 font-sans leading-relaxed">
            Forward sketchy Interac e-Transfers, fake OSAP/CRA texts, or rental deposit lures. Deterministic MITRE F3 rules and Claude Haiku 5.5 flag red flags in seconds.
          </p>
          <div className="pt-2 flex items-center gap-3 font-mono text-xs text-blue-700">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 font-bold">
              0 BANK LOGINS
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">PIPEDA SCRUBBED</span>
          </div>
        </div>

        {/* Beat 3: Bottom-Center Editorial Panel (0.70 -> 0.90) */}
        <div
          ref={beat3Ref}
          style={{ opacity: 0 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-12 max-w-lg z-30 text-center space-y-4 bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.08)] w-[90%] sm:w-auto"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] font-sans">
              &lt; $0.02/MO AI COST. 20% FUNDS YOUTH.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-md mx-auto leading-relaxed">
              Powered by Claude Haiku 5.5 prompt caching and open-standard <strong>A2UI v0.9</strong> declarative mobile widgets. 20% of net profits fund free Financial Futures Education workshops across Canada.
            </p>
          </div>
          <button
            onClick={onJumpToApp}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white font-mono text-xs font-semibold transition cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Enter Live A2UI App ↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};
