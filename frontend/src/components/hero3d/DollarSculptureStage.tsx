"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DOLLAR_BLOCKS, BLOCK_STEP, SculptureBlockSpec } from "./dollarBlocks";
import { ArrowDown, Shield } from "lucide-react";

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

  // SVG connector lines & dot refs
  const calloutGroupRef = useRef<SVGSVGElement>(null);
  const anchorDotRefs = useRef<{ [id: string]: SVGCircleElement | null }>({});
  const outerRingRefs = useRef<{ [id: string]: SVGCircleElement | null }>({});
  const polylineRefs = useRef<{ [id: string]: SVGPolylineElement | null }>({});

  // Floating HTML Pop-up Card DOM refs (60fps DOM transforms)
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Storytelling beat DOM refs
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
    scene.fog = new THREE.FogExp2("#EEF4FB", 0.036);

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
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

    // 2. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight("#FFFFFF", "#CBD5E1", 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#FFFFFF", 2.2);
    keyLight.position.set(-6, 8, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#3B82F6", 2.6);
    rimLight.position.set(7, 3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight("#E0ECFF", 0.95);
    fillLight.position.set(5, -6, 6);
    scene.add(fillLight);

    // Glowing center PointLight (Nyra Blue spill onto inner ceramic block bevels)
    const centerPointLight = new THREE.PointLight("#3B82F6", 6.0, 8.0);
    centerPointLight.position.set(0, 0, 0.2);
    scene.add(centerPointLight);

    // 3. Procedural 3D Snowy Alpine Mountains Background
    // Layer 1: Foreground Snowy Ridge
    const geo1 = new THREE.PlaneGeometry(34, 16, 64, 32);
    geo1.rotateX(-Math.PI / 2);
    const pos1 = geo1.attributes.position;
    for (let i = 0; i < pos1.count; i++) {
      const px = pos1.getX(i);
      const pz = pos1.getZ(i);
      const distFromCenter = Math.abs(px);
      const ridgeY =
        Math.sin(px * 0.25) * 0.4 +
        (distFromCenter > 5 ? (distFromCenter - 5) * 0.35 : 0) -
        pz * 0.12;
      pos1.setY(i, ridgeY);
    }
    geo1.computeVertexNormals();
    const mountainLayer1 = new THREE.Mesh(
      geo1,
      new THREE.MeshStandardMaterial({
        color: "#F8FAFC",
        roughness: 0.88,
        metalness: 0.02,
        flatShading: true,
      })
    );
    mountainLayer1.position.set(0, -3.35, -1.5);
    scene.add(mountainLayer1);

    // Layer 2: Midground Alpine Peaks
    const geo2 = new THREE.PlaneGeometry(56, 18, 80, 28);
    geo2.rotateX(-Math.PI / 2);
    const pos2 = geo2.attributes.position;
    const ridge = (x: number, z: number) => {
      const sideValley = Math.min(1, Math.abs(x) / 7.5);
      const n1 = Math.abs(Math.sin(x * 0.22 + 0.7) * Math.cos(z * 0.18)) * 5.8;
      const n2 = Math.abs(Math.sin(x * 0.51 - z * 0.33)) * 2.4;
      const n3 = Math.sin(x * 1.15 + z * 0.9) * 0.55;
      return (n1 + n2 + n3) * (0.35 + 0.85 * sideValley);
    };
    for (let i = 0; i < pos2.count; i++) {
      const px = pos2.getX(i);
      const pz = pos2.getZ(i);
      pos2.setY(i, ridge(px, pz));
    }
    geo2.computeVertexNormals();
    const mountainLayer2 = new THREE.Mesh(
      geo2,
      new THREE.MeshStandardMaterial({
        color: "#E6EEF8",
        roughness: 0.82,
        metalness: 0.02,
        flatShading: true,
      })
    );
    mountainLayer2.position.set(0, -3.6, -9.5);
    scene.add(mountainLayer2);

    // Layer 3: Distant Misty Summit Range
    const geo3 = new THREE.PlaneGeometry(78, 14, 72, 20);
    geo3.rotateX(-Math.PI / 2);
    const pos3 = geo3.attributes.position;
    for (let i = 0; i < pos3.count; i++) {
      const px = pos3.getX(i);
      const pz = pos3.getZ(i);
      const n =
        Math.abs(Math.sin(px * 0.14) * Math.cos(pz * 0.2)) * 8.5 +
        Math.abs(Math.sin(px * 0.35)) * 3.0;
      pos3.setY(i, n);
    }
    geo3.computeVertexNormals();
    const mountainLayer3 = new THREE.Mesh(
      geo3,
      new THREE.MeshStandardMaterial({
        color: "#DCE7F5",
        roughness: 0.92,
        metalness: 0.02,
        flatShading: true,
      })
    );
    mountainLayer3.position.set(0, -3.2, -18.5);
    scene.add(mountainLayer3);

    // Soft drifting snowflakes (90 flakes)
    const snowCount = 90;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount * 3; i += 3) {
      snowPositions[i] = (Math.random() - 0.5) * 16;
      snowPositions[i + 1] = Math.random() * 10 - 2;
      snowPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      size: 0.065,
      color: "#93C5FD",
      transparent: true,
      opacity: 0.65,
    });
    const snowflakes = new THREE.Points(snowGeo, snowMat);
    scene.add(snowflakes);

    // Subtle radial shadow disc under sculpture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(37, 99, 235, 0.18)");
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
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.32;
    scene.add(shadowMesh);

    // 4. Build Modular $ Sculpture Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Reusable Geometries
    const sGeom = new RoundedBoxGeometry(0.55, 0.55, 0.54, 4, 0.065);
    const stemGeom = new RoundedBoxGeometry(0.52, 0.54, 0.46, 4, 0.06);
    const detachedGeom = new RoundedBoxGeometry(0.46, 0.46, 0.46, 4, 0.06);

    // Materials per Phase 2.1:
    // A. Stem & center bar: Rich satin Nyra Blue PBR
    const nyraBlueBlockMat = new THREE.MeshPhysicalMaterial({
      color: "#2563EB",
      emissive: "#1D4ED8",
      emissiveIntensity: 0.22,
      roughness: 0.24,
      metalness: 0.12,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
    });

    // B. Outer s_curve blocks: Crisp frosted alpine-white
    const sCurveWhiteMat = new THREE.MeshPhysicalMaterial({
      color: "#F1F5F9",
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.22,
    });

    // Glowing Nyra Blue bevel edges on white s_curve blocks
    const sCurveEdgesGeom = new THREE.EdgesGeometry(sGeom);
    const sCurveLineMat = new THREE.LineBasicMaterial({
      color: "#3B82F6",
      transparent: true,
      opacity: 0.42,
    });

    // C. 4 Detached floating blocks: Bright crystalline Nyra Blue
    const detachedBlueMat = new THREE.MeshPhysicalMaterial({
      color: "#3B82F6",
      emissive: "#2563EB",
      emissiveIntensity: 0.35,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.85,
    });
    const detachedEdgesGeom = new THREE.EdgesGeometry(detachedGeom);
    const detachedLineMat = new THREE.LineBasicMaterial({
      color: "#1D4ED8",
      transparent: true,
      opacity: 0.55,
    });

    // D. Recessed glowing core boxes
    const coreMat = new THREE.MeshStandardMaterial({
      color: "#2563EB",
      emissive: "#2563EB",
      emissiveIntensity: 2.8,
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

    // Instantiate 25 blocks
    interface BlockRuntime {
      spec: SculptureBlockSpec;
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      explodeVec: THREE.Vector3;
    }

    const blockRuntimes: BlockRuntime[] = [];

    DOLLAR_BLOCKS.forEach((spec) => {
      let geom: THREE.BufferGeometry = sGeom;
      let mat: THREE.Material = sCurveWhiteMat;
      const isCenterBar = spec.id === "s_m1" || spec.id === "s_m2" || spec.id === "s_m3";

      if (spec.role === "stem" || isCenterBar) {
        geom = spec.role === "stem" ? stemGeom : sGeom;
        mat = nyraBlueBlockMat;
      } else if (spec.role === "detached") {
        geom = detachedGeom;
        mat = detachedBlueMat;
      }

      const mesh = new THREE.Mesh(geom, mat);
      const basePos = new THREE.Vector3(
        spec.gx * BLOCK_STEP,
        spec.gy * BLOCK_STEP,
        spec.gz
      );
      mesh.position.copy(basePos);

      // Add wireframe edge lines
      if (spec.role === "detached") {
        const wire = new THREE.LineSegments(detachedEdgesGeom, detachedLineMat);
        mesh.add(wire);
      } else if (spec.role === "s_curve" && !isCenterBar) {
        const wire = new THREE.LineSegments(sCurveEdgesGeom, sCurveLineMat);
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

    // 5. Scroll & Mouse Tracking
    const onScroll = () => {
      const scrollY = window.scrollY;
      const stageTop = section.offsetTop;
      const stageHeight = section.offsetHeight - window.innerHeight;
      if (stageHeight <= 0) return;

      const p = Math.max(0, Math.min(1, (scrollY - stageTop) / stageHeight));
      targetScrollRef.current = p;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    onScroll();

    // Resize Handler
    const onResize = () => {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    window.addEventListener("resize", onResize);

    // 6. Zero-setState 60FPS RAF Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const worldPos = new THREE.Vector3();
    const screenPos = new THREE.Vector3();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp
      currentScrollRef.current +=
        (targetScrollRef.current - currentScrollRef.current) * 0.1;
      const p = currentScrollRef.current;

      // Smooth mouse lerp
      currentMouseRef.current.x +=
        (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
      currentMouseRef.current.y +=
        (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;
      const mx = currentMouseRef.current.x;
      const my = currentMouseRef.current.y;

      // Mountain Parallax
      mountainLayer3.position.x = mx * 0.15;
      mountainLayer2.position.x = mx * 0.4;
      mountainLayer1.position.x = mx * 0.75;

      // Drifting snowflakes
      const snowArr = snowGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < snowArr.length; i += 3) {
        snowArr[i] -= 0.012;
        if (snowArr[i] < -3.5) snowArr[i] = 7.5;
      }
      snowGeo.attributes.position.needsUpdate = true;

      // Camera Choreography across the 400vh scroll track
      let targetCamX = 0;
      let targetCamY = 0;
      let targetCamZ = 11;
      let rotY = 0;
      let rotX = 0;
      let groupY = 0;

      if (p <= 0.2) {
        // Assembled hero: subtle breathing float + mouse parallax
        const t = p / 0.2;
        targetCamZ = 11 - t * 0.5;
        rotY = mx * 0.18;
        rotX = my * 0.12;
        groupY = Math.sin(elapsedTime * 1.2) * 0.06;
      } else if (p <= 0.45) {
        // Beat 1: Bill & Trial Guard focus
        const t = (p - 0.2) / 0.25;
        const ease = smoothstep(0, 1, t);
        targetCamX = -1.1 * ease;
        targetCamY = 0.4 * ease;
        targetCamZ = 10.5 - ease * 1.5;
        rotY = 0.28 * ease + mx * 0.12;
        rotX = -0.08 * ease + my * 0.08;
      } else if (p <= 0.7) {
        // Beat 2: Canadian Scam Shield focus
        const t = (p - 0.45) / 0.25;
        const ease = smoothstep(0, 1, t);
        targetCamX = -1.1 + 2.3 * ease;
        targetCamY = 0.4 - 0.2 * ease;
        targetCamZ = 9.0 + ease * 0.8;
        rotY = 0.28 - 0.65 * ease + mx * 0.12;
        rotX = -0.08 + 0.14 * ease + my * 0.08;
      } else if (p <= 0.9) {
        // Beat 3: Unit Economics & Re-assembly
        const t = (p - 0.7) / 0.2;
        const ease = smoothstep(0, 1, t);
        targetCamX = 1.2 * (1 - ease);
        targetCamY = 0.2 * (1 - ease) + 0.3 * ease;
        targetCamZ = 9.8 + ease * 0.8;
        rotY = (-0.37 * (1 - ease)) + mx * 0.1;
        rotX = 0.06 * (1 - ease) + my * 0.06;
      } else {
        // Beat 4: Workspace Hand-off
        const t = (p - 0.9) / 0.1;
        const ease = smoothstep(0, 1, t);
        groupY = -3.5 * ease;
        targetCamZ = 10.6 + ease * 1.8;
      }

      if (!prefersReducedMotion) {
        camera.position.x = targetCamX;
        camera.position.y = targetCamY;
        camera.position.z = targetCamZ;
        sculptureGroup.rotation.y = rotY;
        sculptureGroup.rotation.x = rotX;
        sculptureGroup.position.y = groupY;
      }

      // Block Explosion / Detonation Logic
      let explodeMult = 0;
      if (p > 0.15 && p <= 0.45) {
        explodeMult = smoothstep(0.15, 0.35, p) * 1.15;
      } else if (p > 0.45 && p <= 0.75) {
        explodeMult = 1.15 - smoothstep(0.45, 0.75, p) * 0.6;
      } else if (p > 0.75 && p <= 0.92) {
        explodeMult = 0.55 * (1 - smoothstep(0.75, 0.92, p));
      } else {
        explodeMult = 0;
      }

      blockRuntimes.forEach(({ spec, mesh, basePos, explodeVec }) => {
        let blockMult = explodeMult;
        if (p >= 0.2 && p <= 0.45 && spec.id === "float_bill") {
          blockMult = explodeMult * 1.35;
        } else if (p > 0.45 && p <= 0.7 && spec.id === "float_scam") {
          blockMult = explodeMult * 1.45;
        }

        mesh.position.set(
          basePos.x + explodeVec.x * blockMult,
          basePos.y + explodeVec.y * blockMult,
          basePos.z + explodeVec.z * blockMult
        );
      });

      // Update Floating HTML Callout Cards & SVG Leader Lines
      const halfW = width / 2;
      const halfH = height / 2;
      const showCallouts = p < 0.2; // Callouts pop in during assembled hero and fade out as scroll starts

      blockRuntimes.forEach(({ spec, mesh }) => {
        if (!spec.callout) return;

        mesh.getWorldPosition(worldPos);
        screenPos.copy(worldPos).project(camera);

        const sx = screenPos.x * halfW + halfW;
        const sy = -screenPos.y * halfH + halfH;
        const isBehind = screenPos.z > 1.0;

        const anchorDot = anchorDotRefs.current[spec.id];
        const outerRing = outerRingRefs.current[spec.id];
        const polyline = polylineRefs.current[spec.id];
        const cardEl = cardRefs.current[spec.id];

        const targetX = sx + spec.callout.labelDx;
        const targetY = sy + spec.callout.labelDy;

        if (showCallouts && !isBehind) {
          if (anchorDot) {
            anchorDot.setAttribute("cx", sx.toFixed(1));
            anchorDot.setAttribute("cy", sy.toFixed(1));
            anchorDot.style.opacity = "1";
          }
          if (outerRing) {
            outerRing.setAttribute("cx", sx.toFixed(1));
            outerRing.setAttribute("cy", sy.toFixed(1));
            const pulse = 6 + Math.sin(elapsedTime * 3) * 1.5;
            outerRing.setAttribute("r", pulse.toFixed(1));
            outerRing.style.opacity = "0.75";
          }
          if (polyline) {
            const elbowX = sx + spec.callout.labelDx * 0.4;
            const elbowY = sy;
            const pts = `${sx.toFixed(1)},${sy.toFixed(1)} ${elbowX.toFixed(1)},${elbowY.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}`;
            polyline.setAttribute("points", pts);
            polyline.style.opacity = "0.7";
          }
          if (cardEl) {
            const isLeft = spec.callout.labelDx < 0;
            const cardW = 260;
            const posX = isLeft ? targetX - cardW : targetX;
            const posY = targetY - 32;
            cardEl.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0)`;
            cardEl.style.opacity = "1";
            cardEl.style.pointerEvents = "auto";
          }
        } else {
          if (anchorDot) anchorDot.style.opacity = "0";
          if (outerRing) outerRing.style.opacity = "0";
          if (polyline) polyline.style.opacity = "0";
          if (cardEl) {
            cardEl.style.opacity = "0";
            cardEl.style.pointerEvents = "none";
          }
        }
      });

      // Storytelling Beats Visibility via direct DOM style mutation
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      }

      if (hudRef.current) {
        hudRef.current.style.opacity = p > 0.92 ? "0" : "1";
      }

      if (beat1Ref.current) {
        if (p >= 0.18 && p <= 0.44) {
          const beatP = (p - 0.18) / 0.26;
          const alpha =
            beatP < 0.25 ? beatP / 0.25 : beatP > 0.75 ? (1 - beatP) / 0.25 : 1;
          beat1Ref.current.style.opacity = alpha.toFixed(3);
          beat1Ref.current.style.transform = `translateY(${(-50 + (1 - alpha) * 8).toFixed(1)}%)`;
        } else {
          beat1Ref.current.style.opacity = "0";
        }
      }

      if (beat2Ref.current) {
        if (p >= 0.44 && p <= 0.7) {
          const beatP = (p - 0.44) / 0.26;
          const alpha =
            beatP < 0.25 ? beatP / 0.25 : beatP > 0.75 ? (1 - beatP) / 0.25 : 1;
          beat2Ref.current.style.opacity = alpha.toFixed(3);
          beat2Ref.current.style.transform = `translateY(${(-50 + (1 - alpha) * 8).toFixed(1)}%)`;
        } else {
          beat2Ref.current.style.opacity = "0";
        }
      }

      if (beat3Ref.current) {
        if (p >= 0.7 && p <= 0.9) {
          const beatP = (p - 0.7) / 0.2;
          const alpha =
            beatP < 0.25 ? beatP / 0.25 : beatP > 0.75 ? (1 - beatP) / 0.25 : 1;
          beat3Ref.current.style.opacity = alpha.toFixed(3);
        } else {
          beat3Ref.current.style.opacity = "0";
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[400vh] bg-transparent"
    >
      {/* Sticky 100vh WebGL viewport with daylight alpine sky */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #E8F1FC 0%, #F4F8FD 42%, #FFFFFF 100%)",
        }}
      >
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* SVG Connector Lines Strictly for Polylines & Anchor Rings */}
        <svg
          ref={calloutGroupRef}
          className="pointer-events-none absolute inset-0 z-10 w-full h-full"
        >
          {DOLLAR_BLOCKS.map((spec) => {
            if (!spec.callout) return null;
            return (
              <g key={`svg_wire_${spec.id}`}>
                {/* Target Dot */}
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
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />
                {/* Leader Polyline */}
                <polyline
                  ref={(el) => {
                    polylineRefs.current[spec.id] = el;
                  }}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.75"
                  strokeOpacity="0.65"
                />
              </g>
            );
          })}
        </svg>

        {/* Bold Floating HTML Pop-Up Cards (01-04) Synced via translate3d DOM transforms */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {DOLLAR_BLOCKS.map((spec) => {
            if (!spec.callout) return null;
            return (
              <div
                key={`card_${spec.id}`}
                ref={(el) => {
                  cardRefs.current[spec.id] = el;
                }}
                style={{ opacity: 0 }}
                className="absolute top-0 left-0 w-[260px] bg-white/95 backdrop-blur-md border-2 border-blue-500/25 rounded-2xl px-4 py-3 shadow-[0_14px_34px_-8px_rgba(37,99,235,0.22)] pointer-events-auto transition-transform duration-300 hover:scale-105 hover:border-blue-500"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-md">
                    {spec.callout.code}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">
                    {spec.callout.title}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-snug">
                  {spec.callout.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Igloo-Style 4-Corner HUD (No A2UI badge, scaled up Nyra 2.0 wordmark) */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 select-none transition-opacity duration-300"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between">
            {/* Top-Left: Scaled-up Brand Lockup */}
            <div className="pointer-events-auto flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                  NYRA 2.0
                </span>
                <span className="text-xs md:text-sm font-mono font-medium text-slate-600 block mt-0.5">
                  Financial Futures Education · Canada
                </span>
              </div>
            </div>

            {/* Top-Right: Mission Narrative */}
            <div className="hidden sm:block text-right max-w-[280px] space-y-1">
              <span className="text-xs font-mono text-[#2563EB] font-bold block uppercase tracking-wider">
                Mission
              </span>
              <p className="text-xs font-mono text-slate-600 leading-relaxed">
                Empowering Canadian youth to never miss a bill and never fall for a scam. Zero bank logins. 20% of profits fund free workshops.
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between">
            {/* Bottom-Left: Scroll Progress Track */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                <ArrowDown className="w-4 h-4 text-[#2563EB] animate-bounce" />
                <span>Scroll down to explore</span>
              </div>
              <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
              className="pointer-events-auto px-5 py-2.5 rounded-full border border-slate-200 bg-white/95 backdrop-blur-sm text-xs font-mono font-semibold text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB] transition cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>Jump to Live App</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Beat 1: Right-Side Editorial Panel (0.18 -> 0.44) */}
        <div
          ref={beat1Ref}
          style={{ opacity: 0 }}
          className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 max-w-md z-30 space-y-4 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
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
          className="absolute left-6 sm:left-16 top-1/2 -translate-y-1/2 max-w-md z-30 space-y-4 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
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
              Powered by Claude Haiku 5.5 prompt caching and open-standard declarative mobile widgets. 20% of net profits fund free Financial Futures Education workshops across Canada.
            </p>
          </div>
          <button
            onClick={onJumpToApp}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono text-xs font-semibold transition cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Enter Live A2UI App ↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};
