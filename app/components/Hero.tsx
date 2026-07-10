"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];
const easeInOut = [0.77, 0, 0.175, 1] as [number, number, number, number];
const springBadge = { type: "spring" as const, duration: 0.7, bounce: 0.25 };

/* ─── Letter-by-letter headline reveal ─── */
function LetterReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className} style={{ display: "inline" }} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          style={char === " " ? { width: "0.25em" } : undefined}
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.4, delay: delay + i * stagger, ease }}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Dense Canvas fiber optic network ─── */
function FiberNetwork({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  interface FiberLine {
    sx: number; sy: number;
    c1x: number; c1y: number;
    c2x: number; c2y: number;
    ex: number; ey: number;
    op: number; bp: number; bs: number;
    hue: number; w: number;
  }
  interface Pulse { li: number; t: number; sp: number; sz: number; hue: number; tr: number; }
  interface Ripple { x: number; y: number; r: number; op: number; }
  interface Node { x: number; y: number; pp: number; sz: number; }

  const stateRef = useRef<{
    lines: FiberLine[]; pulses: Pulse[]; ripples: Ripple[]; nodes: Node[];
    time: number; cx: number; cy: number; rm: boolean; ls: number;
  } | null>(null);

  const createState = useCallback((w: number, h: number) => {
    const cx = w / 2, cy = h / 2;
    const lines: FiberLine[] = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.sin(i * 7.3) * 0.25;
      const d = Math.max(w, h) * 0.75;
      const m1 = d * (0.55 + Math.sin(i * 3.7) * 0.12);
      const m2 = d * (0.22 + Math.sin(i * 5.3) * 0.08);
      lines.push({
        sx: cx + Math.cos(a) * d, sy: cy + Math.sin(a) * d,
        c1x: cx + Math.cos(a) * m1 + Math.cos(a + Math.PI / 2) * Math.sin(i * 11.1) * 100,
        c1y: cy + Math.sin(a) * m1 + Math.sin(a + Math.PI / 2) * Math.sin(i * 11.1) * 100,
        c2x: cx + Math.cos(a) * m2 + Math.cos(a - Math.PI / 2) * Math.cos(i * 9.7) * 70,
        c2y: cy + Math.sin(a) * m2 + Math.sin(a - Math.PI / 2) * Math.cos(i * 9.7) * 70,
        ex: cx + Math.sin(i * 2.3) * 15, ey: cy + Math.cos(i * 1.7) * 15,
        op: 0.06 + Math.sin(i * 4.1) * 0.03, bp: i * 0.25,
        bs: 0.25 + Math.sin(i * 6.1) * 0.12, hue: i % 6 === 0 ? 1 : i % 9 === 0 ? 2 : 0,
        w: 0.6 + Math.sin(i * 3.3) * 0.3,
      });
    }
    const subN: { x: number; y: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.4;
      const r = Math.min(w, h) * (0.2 + Math.sin(i * 5.7) * 0.08);
      subN.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    for (let i = 0; i < subN.length; i++) {
      const n = subN[i];
      lines.push({
        sx: n.x, sy: n.y,
        c1x: (n.x + cx) / 2 + Math.sin(i * 7) * 30, c1y: (n.y + cy) / 2 + Math.cos(i * 9) * 30,
        c2x: (n.x + cx * 3) / 4, c2y: (n.y + cy * 3) / 4,
        ex: cx + Math.sin(i * 3.1) * 8, ey: cy + Math.cos(i * 2.7) * 8,
        op: 0.1, bp: i * 1.2, bs: 0.35, hue: 0, w: 0.8,
      });
      const nx = subN[(i + 1) % subN.length];
      lines.push({
        sx: n.x, sy: n.y,
        c1x: (n.x + nx.x) / 2 + Math.sin(i * 13) * 40, c1y: (n.y + nx.y) / 2 + Math.cos(i * 11) * 40,
        c2x: (n.x + nx.x) / 2 - Math.cos(i * 7) * 25, c2y: (n.y + nx.y) / 2 + Math.sin(i * 5) * 25,
        ex: nx.x, ey: nx.y, op: 0.05, bp: i * 0.8 + 2, bs: 0.2, hue: i % 3 === 0 ? 1 : 0, w: 0.5,
      });
    }
    const nodes: Node[] = [
      { x: cx, y: cy, pp: 0, sz: 4 },
      ...subN.map((n, i) => ({ x: n.x, y: n.y, pp: i * 0.8, sz: 2.5 })),
    ];
    return { lines, pulses: [] as Pulse[], ripples: [] as Ripple[], nodes, time: 0, cx, cy, rm: false, ls: 0 };
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = createState(canvas.offsetWidth, canvas.offsetHeight);
      s.rm = rm;
      stateRef.current = s;
    };
    resize();
    window.addEventListener("resize", resize);
    const pt = (l: FiberLine, t: number) => {
      const u = 1 - t;
      return {
        x: u * u * u * l.sx + 3 * u * u * t * l.c1x + 3 * u * t * t * l.c2x + t * t * t * l.ex,
        y: u * u * u * l.sy + 3 * u * u * t * l.c1y + 3 * u * t * t * l.c2y + t * t * t * l.ey,
      };
    };
    const col = (h: number, a: number) => h === 1 ? `rgba(59,130,246,${a})` : h === 2 ? `rgba(200,210,230,${a})` : `rgba(16,185,129,${a})`;
    const glo = (h: number, a: number) => h === 1 ? `rgba(59,130,246,${a})` : h === 2 ? `rgba(255,255,255,${a})` : `rgba(16,185,129,${a})`;
    const frame = () => {
      const s = stateRef.current;
      if (!s) { animRef.current = requestAnimationFrame(frame); return; }
      const dt = 1 / 60;
      s.time += s.rm ? dt * 0.15 : dt;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const l of s.lines) {
        const b = Math.sin(s.time * l.bs + l.bp) * 0.5 + 0.5;
        const a = l.op * (0.5 + b * 0.5);
        ctx.beginPath(); ctx.moveTo(l.sx, l.sy);
        ctx.bezierCurveTo(l.c1x, l.c1y, l.c2x, l.c2y, l.ex, l.ey);
        ctx.strokeStyle = col(l.hue, a); ctx.lineWidth = l.w; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(l.sx, l.sy);
        ctx.bezierCurveTo(l.c1x, l.c1y, l.c2x, l.c2y, l.ex, l.ey);
        ctx.strokeStyle = glo(l.hue, a * 0.25); ctx.lineWidth = l.w + 2.5; ctx.stroke();
      }
      for (const n of s.nodes) {
        const p = Math.sin(s.time * 1.5 + n.pp) * 0.5 + 0.5;
        const sz = n.sz * (0.8 + p * 0.4);
        ctx.beginPath(); ctx.arc(n.x, n.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${0.15 + p * 0.15})`; ctx.fill();
        const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz * 4);
        ng.addColorStop(0, `rgba(16,185,129,${0.06 + p * 0.06})`);
        ng.addColorStop(1, "rgba(16,185,129,0)");
        ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(n.x, n.y, sz * 4, 0, Math.PI * 2); ctx.fill();
      }
      if (!s.rm && s.time - s.ls > 0.15) {
        s.ls = s.time;
        const batch = 1 + Math.floor(Math.abs(Math.sin(s.time * 2.1)) * 2.5);
        for (let b = 0; b < batch; b++) {
          const idx = Math.floor(Math.abs(Math.sin(s.time * (7.3 + b * 3.1) + b * 1.7)) * s.lines.length) % s.lines.length;
          s.pulses.push({
            li: idx, t: 0,
            sp: 0.2 + Math.abs(Math.sin(s.time * 3.7 + b)) * 0.3,
            sz: 1.5 + Math.abs(Math.sin(s.time * 5.1 + b * 2)) * 2,
            hue: s.lines[idx].hue,
            tr: 0.1 + Math.abs(Math.sin(s.time * 2.3 + b)) * 0.1,
          });
        }
      }
      const alive: Pulse[] = [];
      for (const p of s.pulses) {
        p.t += p.sp * dt;
        if (p.t > 1) { const l = s.lines[p.li]; s.ripples.push({ x: l.ex, y: l.ey, r: 2, op: 0.3 }); continue; }
        alive.push(p);
        const l = s.lines[p.li];
        for (let ti = 6; ti > 0; ti--) {
          const tt = p.t - (ti / 6) * p.tr;
          if (tt < 0) continue;
          const pp = pt(l, tt);
          ctx.beginPath(); ctx.arc(pp.x, pp.y, p.sz * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = glo(p.hue, (1 - ti / 6) * 0.25); ctx.fill();
        }
        const pos = pt(l, p.t);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = glo(p.hue, 0.85); ctx.fill();
        const dg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.sz * 3.5);
        dg.addColorStop(0, glo(p.hue, 0.25)); dg.addColorStop(1, glo(p.hue, 0));
        ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(pos.x, pos.y, p.sz * 3.5, 0, Math.PI * 2); ctx.fill();
      }
      s.pulses = alive;
      const aliveR: Ripple[] = [];
      for (const r of s.ripples) {
        r.r += 50 * dt; r.op -= 0.6 * dt;
        if (r.op <= 0) continue;
        aliveR.push(r);
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16,185,129,${r.op})`; ctx.lineWidth = 1; ctx.stroke();
      }
      s.ripples = aliveR;
      const cg = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, 140);
      const cb = Math.sin(s.time * 0.4) * 0.025 + 0.05;
      cg.addColorStop(0, `rgba(16,185,129,${cb})`); cg.addColorStop(0.5, `rgba(16,185,129,${cb * 0.3})`);
      cg.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(s.cx, s.cy, 140, 0, Math.PI * 2); ctx.fill();
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [active, createState]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.8 }} />;
}

/* ─── Three.js 3D Smartphone ─── */
function Phone3D({ visible }: { visible: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    phone: THREE.Group;
    screenMesh: THREE.Mesh;
    glowMesh: THREE.Mesh;
    mouseX: number;
    mouseY: number;
    time: number;
    disposed: boolean;
  } | null>(null);
  const animRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Phone group
    const phone = new THREE.Group();

    // Phone body — rounded box approximation
    const bodyW = 1.05, bodyH = 2.2, bodyD = 0.12;
    const bodyGeo = new THREE.BoxGeometry(bodyW, bodyH, bodyD, 4, 8, 2);

    // Round the edges
    const pos = bodyGeo.attributes.position;
    const radius = 0.12;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const hw = bodyW / 2 - radius;
      const hh = bodyH / 2 - radius;
      if (Math.abs(x) > hw && Math.abs(y) > hh) {
        const sx = Math.sign(x);
        const sy = Math.sign(y);
        const dx = Math.abs(x) - hw;
        const dy = Math.abs(y) - hh;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const scale = radius / Math.max(dist, radius);
          pos.setX(i, sx * (hw + dx * scale));
          pos.setY(i, sy * (hh + dy * scale));
        }
      }
    }
    bodyGeo.computeVertexNormals();

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a12,
      metalness: 0.7,
      roughness: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.5,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    phone.add(bodyMesh);

    // Screen
    const screenW = bodyW * 0.88, screenH = bodyH * 0.9;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.minFilter = THREE.LinearFilter;
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      transparent: true,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = bodyD / 2 + 0.001;
    phone.add(screenMesh);

    // Bezel frame
    const bezelGeo = new THREE.PlaneGeometry(bodyW * 0.92, bodyH * 0.94);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = bodyD / 2 + 0.0005;
    phone.add(bezelMesh);

    // Camera notch
    const notchGeo = new THREE.PlaneGeometry(0.28, 0.08);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(0, screenH / 2 - 0.06, bodyD / 2 + 0.002);
    phone.add(notchMesh);

    // Side button
    const btnGeo = new THREE.BoxGeometry(0.02, 0.15, 0.04);
    const btnMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a2e, metalness: 0.8, roughness: 0.3 });
    const sideBtn = new THREE.Mesh(btnGeo, btnMat);
    sideBtn.position.set(bodyW / 2 + 0.01, 0.3, 0);
    phone.add(sideBtn);

    // Glowing green edge outline around the phone body
    const edgesGeo = new THREE.EdgesGeometry(bodyGeo, 15);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    phone.add(edgeLines);

    // Thin glowing outline frame slightly larger than body
    const outlineGeo = new THREE.BoxGeometry(bodyW + 0.04, bodyH + 0.04, bodyD + 0.02, 4, 8, 2);
    const outlinePos = outlineGeo.attributes.position;
    for (let i = 0; i < outlinePos.count; i++) {
      const x = outlinePos.getX(i);
      const y = outlinePos.getY(i);
      const hw = (bodyW + 0.04) / 2 - radius;
      const hh = (bodyH + 0.04) / 2 - radius;
      if (Math.abs(x) > hw && Math.abs(y) > hh) {
        const sx = Math.sign(x);
        const sy = Math.sign(y);
        const dx = Math.abs(x) - hw;
        const dy = Math.abs(y) - hh;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const scale = radius / Math.max(dist, radius);
          outlinePos.setX(i, sx * (hw + dx * scale));
          outlinePos.setY(i, sy * (hh + dy * scale));
        }
      }
    }
    outlineGeo.computeVertexNormals();
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    phone.add(outlineMesh);

    // Green glow behind phone
    const glowGeo = new THREE.PlaneGeometry(3, 4);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x10b981) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
          float alpha = smoothstep(0.5, 0.0, dist) * (0.08 + pulse * 0.04);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.z = -0.2;
    phone.add(glowMesh);

    // Shadow/reflection plane below phone
    const shadowGeo = new THREE.PlaneGeometry(2, 0.8);
    const shadowMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {},
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - vec2(0.5, 0.5);
          float dist = length(center * vec2(1.0, 2.0));
          float alpha = smoothstep(0.5, 0.0, dist) * 0.12;
          gl_FragColor = vec4(0.06, 0.73, 0.50, alpha);
        }
      `,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.y = -1.4;
    shadowPlane.position.z = -0.1;
    shadowPlane.rotation.x = -0.3;
    phone.add(shadowPlane);

    phone.rotation.y = 0.15;
    scene.add(phone);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 3, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 0.3);
    fillLight.position.set(-2, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.2);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    const state = {
      scene, camera, renderer, phone, screenMesh, glowMesh,
      mouseX: 0, mouseY: 0, time: 0, disposed: false,
    };
    stateRef.current = state;

    // Resize
    const resize = () => {
      if (state.disposed) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      state.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      state.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Screen content renderer
    const drawScreen = (ctx2d: CanvasRenderingContext2D, time: number) => {
      const cw = 512, ch = 1024;
      ctx2d.clearRect(0, 0, cw, ch);

      // Dark background
      ctx2d.fillStyle = "#050510";
      ctx2d.fillRect(0, 0, cw, ch);

      // Status bar
      ctx2d.fillStyle = "rgba(255,255,255,0.3)";
      ctx2d.font = "20px sans-serif";
      ctx2d.textAlign = "center";
      ctx2d.fillText("9:41", cw / 2, 50);

      const loopTime = time % 8;

      if (loopTime < 4) {
        // Missed call notification phase
        const fadeIn = Math.min(loopTime / 0.5, 1);

        // Missed call icon area
        ctx2d.globalAlpha = fadeIn;
        ctx2d.fillStyle = "rgba(255,255,255,0.08)";
        ctx2d.beginPath();
        ctx2d.arc(cw / 2, 340, 50, 0, Math.PI * 2);
        ctx2d.fill();

        // Phone icon
        ctx2d.fillStyle = "rgba(255,255,255,0.7)";
        ctx2d.font = "36px sans-serif";
        ctx2d.fillText("📱", cw / 2, 352);

        // Missed call text
        ctx2d.fillStyle = "#ffffff";
        ctx2d.font = "bold 28px sans-serif";
        ctx2d.fillText("Missed Call", cw / 2, 430);

        ctx2d.fillStyle = "rgba(255,255,255,0.5)";
        ctx2d.font = "22px sans-serif";
        ctx2d.fillText("(555) 012-3456", cw / 2, 470);

        ctx2d.fillStyle = "rgba(255,255,255,0.3)";
        ctx2d.font = "18px sans-serif";
        ctx2d.fillText("Today, 2:34 PM", cw / 2, 510);

        // Pulsing ring
        const ringPulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx2d.strokeStyle = `rgba(255,255,255,${0.1 * ringPulse})`;
        ctx2d.lineWidth = 1;
        ctx2d.beginPath();
        ctx2d.arc(cw / 2, 340, 60 + Math.sin(time * 2) * 10, 0, Math.PI * 2);
        ctx2d.stroke();

        ctx2d.globalAlpha = 1;
      } else {
        // Auto text reply phase
        const phase2 = loopTime - 4;
        const fadeIn = Math.min(phase2 / 0.3, 1);
        ctx2d.globalAlpha = fadeIn;

        // Header
        ctx2d.fillStyle = "rgba(255,255,255,0.5)";
        ctx2d.font = "20px sans-serif";
        ctx2d.fillText("(555) 012-3456", cw / 2, 120);
        ctx2d.fillStyle = "rgba(255,255,255,0.08)";
        ctx2d.fillRect(20, 140, cw - 40, 1);

        // Message bubble
        const msgProgress = Math.min((phase2 - 0.3) / 0.5, 1);
        if (msgProgress > 0) {
          const bubbleW = 380, bubbleH = 100;
          const bubbleX = cw - bubbleW - 30;
          const bubbleY = 600;

          // Green gradient bubble
          const grad = ctx2d.createLinearGradient(bubbleX, bubbleY, bubbleX + bubbleW, bubbleY + bubbleH);
          grad.addColorStop(0, "#10b981");
          grad.addColorStop(1, "#059669");
          ctx2d.fillStyle = grad;

          ctx2d.beginPath();
          const r = 20;
          ctx2d.moveTo(bubbleX + r, bubbleY);
          ctx2d.lineTo(bubbleX + bubbleW - r, bubbleY);
          ctx2d.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
          ctx2d.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - 5);
          ctx2d.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - 5, bubbleY + bubbleH);
          ctx2d.lineTo(bubbleX + r, bubbleY + bubbleH);
          ctx2d.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
          ctx2d.lineTo(bubbleX, bubbleY + r);
          ctx2d.quadraticCurveTo(bubbleX, bubbleY, bubbleX + r, bubbleY);
          ctx2d.fill();

          // Typewriter text
          const fullText = "Sorry we missed your call! We'll call you back shortly.";
          const charCount = Math.min(Math.floor((phase2 - 0.8) * 20), fullText.length);
          if (charCount > 0) {
            ctx2d.fillStyle = "#ffffff";
            ctx2d.font = "20px sans-serif";
            ctx2d.textAlign = "left";
            const displayText = fullText.substring(0, charCount);
            const words = displayText.split(" ");
            let line = "";
            let lineY = bubbleY + 32;
            for (const word of words) {
              const test = line + word + " ";
              if (ctx2d.measureText(test).width > bubbleW - 30) {
                ctx2d.fillText(line.trim(), bubbleX + 16, lineY);
                line = word + " ";
                lineY += 26;
              } else {
                line = test;
              }
            }
            ctx2d.fillText(line.trim(), bubbleX + 16, lineY);
            ctx2d.textAlign = "center";
          }

          // Delivered
          if (phase2 > 3.2) {
            ctx2d.fillStyle = "rgba(255,255,255,0.35)";
            ctx2d.font = "16px sans-serif";
            ctx2d.textAlign = "right";
            ctx2d.fillText("Delivered ✓", bubbleX + bubbleW, bubbleY + bubbleH + 25);
            ctx2d.textAlign = "center";
          }
        }

        ctx2d.globalAlpha = 1;
      }
    };

    // Animation loop
    const frame = () => {
      if (state.disposed) return;
      const dt = 1 / 60;
      state.time += dt;

      // Float animation
      const floatY = reducedMotion ? 0 : Math.sin(state.time * 0.8) * 0.06;
      phone.position.y = floatY;

      // Auto rotation
      const autoRot = reducedMotion ? 0.15 : Math.sin(state.time * 0.3) * 0.18 + 0.05;

      // Mouse tilt — lerp toward target
      const targetRotY = autoRot + state.mouseX * 0.15;
      const targetRotX = -state.mouseY * 0.08;
      phone.rotation.y += (targetRotY - phone.rotation.y) * 0.04;
      phone.rotation.x += (targetRotX - phone.rotation.x) * 0.04;

      // Update screen texture
      const sctx = screenCanvas.getContext("2d");
      if (sctx) {
        drawScreen(sctx, state.time);
        screenTex.needsUpdate = true;
      }

      // Update glow
      (glowMat.uniforms.uTime as { value: number }).value = state.time;

      // Pulse the edge outline opacity
      edgesMat.opacity = 0.4 + Math.sin(state.time * 1.5) * 0.2;
      outlineMat.opacity = 0.08 + Math.sin(state.time * 1.2) * 0.04;

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);
    setReady(true);

    return () => {
      state.disposed = true;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      bodyGeo.dispose(); bodyMat.dispose();
      screenGeo.dispose(); screenMat.dispose(); screenTex.dispose();
      bezelGeo.dispose(); bezelMat.dispose();
      notchGeo.dispose(); notchMat.dispose();
      btnGeo.dispose(); btnMat.dispose();
      edgesGeo.dispose(); edgesMat.dispose();
      outlineGeo.dispose(); outlineMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      shadowGeo.dispose(); shadowMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [visible]);

  return (
    <motion.div
      ref={mountRef}
      className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
      initial={{ opacity: 0, transform: "translateY(30px)" }}
      animate={ready ? { opacity: 1, transform: "translateY(0px)" } : {}}
      transition={{ duration: 1, delay: 0.5, ease }}
    />
  );
}

/* ─── CTA button with glow pulse ─── */
function GlowButton({
  href,
  children,
  primary = false,
  delay = 0,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  delay?: number;
  external?: boolean;
}) {
  const extProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  if (primary) {
    return (
      <motion.a
        href={href}
        {...extProps}
        className="btn-press btn-glow hover-lift relative px-8 py-4 rounded-full text-lg font-bold bg-[var(--accent-green)] text-[var(--bg-primary)] overflow-hidden"
        initial={{ opacity: 0, transform: "translateY(14px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 0.6, delay, ease }}
      >
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        />
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }
  return (
    <motion.a
      href={href}
      className="btn-press px-8 py-4 rounded-full text-lg font-medium text-[var(--text-secondary)] border border-white/10"
      style={{ transition: "border-color 200ms cubic-bezier(0.23,1,0.32,1), color 200ms cubic-bezier(0.23,1,0.32,1)" }}
      initial={{ opacity: 0, transform: "translateY(14px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.6, delay, ease }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
    >
      {children}
    </motion.a>
  );
}

/* ─── Orbital light trail rings ─── */
function OrbitalRings() {
  const rings = [
    {
      rx: 160, ry: 50, rotate: 0, dur: "6s", dir: "orbit-cw-1",
      circumference: 1200, dash: 60, color: "rgba(16,185,129,0.7)", ghost: "rgba(16,185,129,0.08)",
      offset2: 600,
    },
    {
      rx: 200, ry: 65, rotate: -18, dur: "8s", dir: "orbit-cw-2",
      circumference: 1600, dash: 70, color: "rgba(59,130,246,0.6)", ghost: "rgba(59,130,246,0.06)",
      offset2: 800,
    },
    {
      rx: 240, ry: 80, rotate: 15, dur: "10s", dir: "orbit-ccw",
      circumference: 1800, dash: 65, color: "rgba(200,230,210,0.5)", ghost: "rgba(16,185,129,0.05)",
      offset2: 900,
    },
    {
      rx: 275, ry: 95, rotate: -32, dur: "13s", dir: "orbit-cw-3",
      circumference: 2100, dash: 75, color: "rgba(167,139,250,0.5)", ghost: "rgba(167,139,250,0.05)",
      offset2: 1050,
    },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {rings.map((r, i) => (
        <g key={i} transform={`rotate(${r.rotate} 300 300)`}>
          {/* Ghost track — barely visible static outline */}
          <ellipse
            cx="300" cy="300" rx={r.rx} ry={r.ry}
            fill="none" stroke={r.ghost} strokeWidth="1"
          />
          {/* Trail 1 */}
          <ellipse
            cx="300" cy="300" rx={r.rx} ry={r.ry}
            fill="none" stroke={r.color} strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${r.dash} ${r.circumference - r.dash}`}
            style={{ animation: `${r.dir} ${r.dur} linear infinite` }}
          />
          {/* Trail 2 — offset */}
          <ellipse
            cx="300" cy="300" rx={r.rx} ry={r.ry}
            fill="none" stroke={r.color} strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray={`${r.dash * 0.7} ${r.circumference - r.dash * 0.7}`}
            strokeDashoffset={r.offset2}
            style={{ animation: `${r.dir} ${r.dur} linear infinite`, opacity: 0.6 }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ─── Main Hero ─── */
export default function Hero({ visible }: { visible: boolean }) {
  const [canvasReady, setCanvasReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const phoneOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const phoneY = useTransform(scrollY, [0, 600], [0, -80]);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setCanvasReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;

  const line1 = "Your Business";
  const line2 = "Never Sleeps";
  const line3 = "on a Call.";
  const l1d = line1.length * 0.03 + 0.4;
  const l2s = 0.12 + l1d * 0.55;
  const l2d = line2.length * 0.03 + 0.4;
  const l3s = l2s + l2d * 0.55;
  const headEnd = l3s + line3.length * 0.03 + 0.4;
  const subDelay = headEnd * 0.65;
  const ctaDelay = subDelay + 0.35;

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      <FiberNetwork active={canvasReady} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, transform: "translateY(16px) scale(0.92)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              transition={{ ...springBadge, delay: 0.05 }}
              className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full border border-[var(--accent-green)]/20 bg-[var(--accent-green)]/5"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-[var(--accent-green)]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-sm text-[var(--accent-green-light)] font-medium">
                Every missed call, handled.
              </span>
            </motion.div>

            {/* Headline — three lines for proper wrapping */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-bricolage)", lineHeight: 1.08 }}
            >
              <LetterReveal text={line1} className="text-[var(--text-primary)]" delay={0.12} stagger={0.025} />
              <br />
              <LetterReveal text={line2} className="text-[var(--text-primary)]" delay={l2s} stagger={0.025} />
              <br />
              <LetterReveal text={line3} className="gradient-text-green" delay={l3s} stagger={0.025} />
            </h1>

            {/* Subheadline */}
            <motion.p
              className="mt-5 md:mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, transform: "translateY(14px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.7, delay: subDelay, ease }}
            >
              Missed calls cost you customers. Auto Follow Up texts them back
              instantly, notifies you, and logs everything.
            </motion.p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <GlowButton href="https://calendar.app.google/2oH4m4n3eHhe6RMu7" primary delay={ctaDelay} external>
                Book a Free Session
              </GlowButton>
              <GlowButton href="#how-it-works" delay={ctaDelay + 0.1}>
                See How It Works
              </GlowButton>
            </div>
          </div>

          {/* Right: 3D Phone with orbital rings */}
          <motion.div
            className="flex-1 w-full max-w-md lg:max-w-lg relative"
            style={{ opacity: phoneOpacity, y: phoneY }}
          >
            <OrbitalRings />
            <Phone3D visible={canvasReady} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ctaDelay + 0.8, duration: 0.6, ease }}
      >
        <motion.div
          animate={{ transform: "translateY(8px)" }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8, ease: easeInOut }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
