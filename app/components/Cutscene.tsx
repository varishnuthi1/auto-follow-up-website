"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];
const easeExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeInOut = [0.77, 0, 0.175, 1] as [number, number, number, number];

const springGentle = { type: "spring" as const, duration: 0.9, bounce: 0.12 };
const springSnappy = { type: "spring" as const, duration: 0.6, bounce: 0.18 };
const springHeavy = { type: "spring" as const, duration: 1.1, bounce: 0.08 };

function srand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49979;
  return x - Math.floor(x);
}

/* ─── Word-by-word reveal ─── */
function WordReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.18,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em", ...style }}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.6, delay: delay + i * stagger, ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Split text reveal — dramatic letter split from center ─── */
function SplitReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const mid = Math.ceil(text.length / 2);
  return (
    <span className={className} style={{ display: "inline-block", position: "relative" }} aria-label={text}>
      {text.split("").map((char, i) => {
        const fromCenter = i - mid;
        const spreadX = fromCenter * 12;
        return (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            style={char === " " ? { width: "0.3em" } : undefined}
            initial={{
              opacity: 0,
              transform: `translateX(${spreadX}px) translateY(${fromCenter % 2 === 0 ? -8 : 8}px) scale(0.7)`,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              transform: "translateX(0px) translateY(0px) scale(1)",
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.7,
              delay: delay + Math.abs(fromCenter) * 0.025,
              ease: easeExpo,
            }}
            aria-hidden="true"
          >
            {char === " " ? " " : char}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ─── Glitch text — brief digital glitch then resolves ─── */
function GlitchReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=glitching, 2=resolved
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), delay * 1000);
    const t2 = setTimeout(() => setPhase(2), delay * 1000 + 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  if (phase === 0) return <span className={className} style={{ opacity: 0 }}>{text}</span>;

  return (
    <span className={className} style={{ display: "inline-block", position: "relative" }}>
      {phase === 1 && (
        <>
          <motion.span
            className="absolute inset-0"
            style={{ color: "rgba(16,185,129,0.7)", clipPath: "inset(0 0 50% 0)" }}
            animate={{ transform: ["translateX(0px)", "translateX(3px)", "translateX(-2px)", "translateX(0px)"] }}
            transition={{ duration: 0.15, repeat: 2, ease: "linear" }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0"
            style={{ color: "rgba(59,130,246,0.7)", clipPath: "inset(50% 0 0 0)" }}
            animate={{ transform: ["translateX(0px)", "translateX(-3px)", "translateX(2px)", "translateX(0px)"] }}
            transition={{ duration: 0.12, repeat: 2, ease: "linear" }}
          >
            {text}
          </motion.span>
        </>
      )}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 2 ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ─── Signal ripple rings ─── */
function SignalRipples({ active, x, y, color = "rgba(16,185,129," }: { active: boolean; x: string; y: string; color?: string }) {
  if (!active) return null;
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
      {[0, 0.5, 1, 1.5, 2].map((d) => (
        <motion.div
          key={d}
          className="absolute rounded-full border"
          style={{
            width: 1, height: 1,
            left: "50%", top: "50%",
            marginLeft: -0.5, marginTop: -0.5,
            borderColor: `${color}0.3)`,
          }}
          initial={{ width: 1, height: 1, opacity: 0 }}
          animate={{ width: [1, 200], height: [1, 200], opacity: [0, 0.5, 0], marginLeft: [-0.5, -100], marginTop: [-0.5, -100] }}
          transition={{ duration: 2, delay: d, ease: "linear", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── Light streaks ─── */
function LightStreaks({ active }: { active: boolean }) {
  const streaks = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      angle: srand(i * 17 + 3) * 360,
      length: 200 + srand(i * 23 + 7) * 300,
      delay: srand(i * 31 + 11) * 3,
      dur: 2 + srand(i * 37 + 13) * 2,
      x: srand(i * 41 + 17) * 100,
      y: srand(i * 43 + 19) * 100,
      color: i % 3 === 0 ? "rgba(16,185,129," : i % 3 === 1 ? "rgba(59,130,246," : "rgba(255,255,255,",
    })), []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.length, height: 1,
            background: `linear-gradient(90deg, transparent, ${s.color}0.15), transparent)`,
            transformOrigin: "left center",
            transform: `rotate(${s.angle}deg)`,
          }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0.3] }}
          transition={{ duration: s.dur, delay: s.delay, ease: "linear", repeat: Infinity, repeatDelay: s.dur }}
        />
      ))}
    </div>
  );
}

/* ─── Typewriter effect ─── */
function Typewriter({
  text,
  className = "",
  delay = 0,
  speed = 35,
  onComplete,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </span>
  );
}

/* ─── Floating particles layer ─── */
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: srand(i * 7 + 1) * 100,
        y: srand(i * 13 + 3) * 100,
        size: srand(i * 17 + 5) * 2.5 + 0.5,
        dur: srand(i * 23 + 7) * 10 + 12,
        delay: srand(i * 29 + 11) * 8,
        opacity: srand(i * 31 + 13) * 0.3 + 0.05,
        drift: (srand(i * 37 + 17) - 0.5) * 60,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background:
              p.id % 4 === 0 ? "rgba(16,185,129,0.6)"
              : p.id % 4 === 1 ? "rgba(59,130,246,0.5)"
              : p.id % 4 === 2 ? "rgba(245,158,11,0.4)"
              : "rgba(255,255,255,0.3)",
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity * 0.5, 0],
            transform: [
              "translate(0px, 0px)",
              `translate(${p.drift * 0.3}px, -30px)`,
              `translate(${p.drift * 0.7}px, -60px)`,
              `translate(${p.drift}px, -100px)`,
            ],
          }}
          transition={{
            duration: p.dur, delay: p.delay,
            ease: "linear", repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Ambient glow orbs ─── */
function AmbientGlow({ phase }: { phase: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 800, height: 800,
          left: "50%", top: "50%",
          marginLeft: -400, marginTop: -400,
          background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          transform: [
            "scale(1) translate(0px, 0px)",
            "scale(1.2) translate(30px, -20px)",
            "scale(0.95) translate(-20px, 15px)",
            "scale(1) translate(0px, 0px)",
          ],
        }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          left: "65%", top: "25%",
          marginLeft: -300, marginTop: -300,
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          transform: [
            "scale(1) translate(0px, 0px)",
            "scale(1.15) translate(-40px, 25px)",
            "scale(1) translate(0px, 0px)",
          ],
        }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity, delay: 3 }}
      />
      {/* Red pulse during missed call */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          left: "50%", top: "50%",
          marginLeft: -250, marginTop: -250,
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
          filter: "blur(30px)",
        }}
        animate={{ opacity: phase >= 3 && phase <= 4 ? 1 : 0 }}
        transition={{ duration: 1.2, ease }}
      />
      {/* Green surge during resolution */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900, height: 900,
          left: "50%", top: "50%",
          marginLeft: -450, marginTop: -450,
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{ opacity: phase >= 5 ? [0, 0.8, 0.4] : 0 }}
        transition={{ duration: 2, ease }}
      />
    </div>
  );
}

/* ─── Screen glow / reflection for phone ─── */
function PhoneScreenGlow({ phase }: { phase: number }) {
  return (
    <>
      {/* Screen reflection sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)",
        }}
        animate={{
          transform: ["translateX(-200%)", "translateX(200%)"],
        }}
        transition={{ duration: 4, delay: 1, ease: "linear", repeat: Infinity, repeatDelay: 6 }}
      />
      {/* Edge glow reacting to phase */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 rounded-[42px]"
        animate={{
          boxShadow: phase <= 2
            ? "inset 0 0 30px rgba(16,185,129,0.05)"
            : phase === 3
            ? "inset 0 0 40px rgba(255,255,255,0.04)"
            : "inset 0 0 30px rgba(16,185,129,0.08)",
        }}
        transition={{ duration: 1, ease }}
      />
    </>
  );
}

/* ─── 3D Smartphone ─── */
function Smartphone({
  phase,
  children,
  shaking,
}: {
  phase: number;
  children: React.ReactNode;
  shaking: boolean;
}) {
  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        initial={{ opacity: 0, transform: "scale(0.88) rotateX(8deg) translateY(40px)" }}
        animate={{
          opacity: phase >= 4 ? 0 : 1,
          transform:
            phase >= 4
              ? "scale(0.8) rotateX(0deg) translateY(-50px)"
              : "scale(1) rotateX(0deg) translateY(0px)",
        }}
        transition={phase >= 4 ? { duration: 1.2, ease: easeExpo } : springHeavy}
      >
        <motion.div
          animate={
            shaking
              ? {
                  transform: [
                    "rotate(0deg) translateX(0px)",
                    "rotate(-3deg) translateX(-4px)",
                    "rotate(3deg) translateX(4px)",
                    "rotate(-2deg) translateX(-3px)",
                    "rotate(2deg) translateX(3px)",
                    "rotate(-1deg) translateX(-1px)",
                    "rotate(0deg) translateX(0px)",
                  ],
                }
              : { transform: "rotate(0deg) translateX(0px)" }
          }
          transition={
            shaking
              ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.6, ease: easeInOut }
              : { duration: 0.4, ease }
          }
        >
          {/* Phone body */}
          <div
            className="relative rounded-[44px] overflow-hidden"
            style={{
              width: 240, height: 500,
              background: "linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 50%, #1a1a2e 100%)",
              boxShadow: `
                0 0 0 1.5px rgba(255,255,255,0.08),
                0 0 0 3px rgba(0,0,0,0.5),
                0 30px 80px rgba(0,0,0,0.6),
                0 0 60px rgba(16,185,129,0.08),
                inset 0 1px 0 rgba(255,255,255,0.06)
              `,
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-3">
              <motion.div
                className="rounded-full"
                style={{
                  width: 90, height: 28,
                  background: "#000",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
                }}
                animate={
                  phase >= 1 && phase <= 2
                    ? { width: [90, 110, 90], height: [28, 30, 28] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, ease: easeInOut }}
              />
            </div>

            {/* Screen */}
            <div
              className="absolute inset-[3px] rounded-[42px] overflow-hidden"
              style={{ background: "#050510" }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(16,185,129,0.03) 0%, transparent 40%)",
                }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.8, ease }}
              />

              <PhoneScreenGlow phase={phase} />

              <div className="relative z-10 h-full flex flex-col">
                {children}
              </div>
            </div>

            {/* Side buttons */}
            <div
              className="absolute right-[-2px] top-[120px] w-[3px] h-[50px] rounded-r-sm"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] rounded-l-sm"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute left-[-2px] top-[145px] w-[3px] h-[45px] rounded-l-sm"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Phone screen: Incoming Call ─── */
function IncomingCallScreen() {
  return (
    <div className="flex flex-col items-center justify-between h-full py-14 px-5">
      <div className="text-center">
        <motion.p
          className="text-[11px] text-[var(--text-muted)] tracking-wide uppercase mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
        >
          incoming call
        </motion.p>
        <motion.p
          className="text-[18px] font-semibold text-white tracking-tight"
          initial={{ opacity: 0, transform: "translateY(6px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ delay: 0.5, duration: 0.5, ease }}
        >
          (555) 012-3456
        </motion.p>
        <motion.p
          className="text-[11px] text-[var(--text-muted)] mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4, ease }}
        >
          Mobile
        </motion.p>
        {/* Pulsing call ring animation */}
        <motion.div
          className="w-20 h-20 rounded-full border border-green-400/20 mx-auto mt-6"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="flex items-center justify-between w-full px-4">
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ delay: 0.9, duration: 0.4, ease }}
        >
          <div className="w-[52px] h-[52px] rounded-full bg-red-500/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
          <span className="text-[9px] text-[var(--text-muted)]">Decline</span>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ delay: 1.0, duration: 0.4, ease }}
        >
          <motion.div
            className="w-[52px] h-[52px] rounded-full bg-green-500/90 flex items-center justify-center"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: easeInOut }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </motion.div>
          <span className="text-[9px] text-[var(--text-muted)]">Accept</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Phone screen: Missed Call ─── */
function MissedCallScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5">
      <motion.div
        className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-4"
        initial={{ opacity: 0, transform: "scale(0.9)" }}
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={springSnappy}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </motion.div>
      <motion.p
        className="text-[16px] font-bold text-red-400 tracking-tight"
        initial={{ opacity: 0, transform: "translateY(6px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ delay: 0.2, duration: 0.5, ease }}
      >
        Missed Call
      </motion.p>
      <motion.p
        className="text-[12px] text-[var(--text-muted)] mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease }}
      >
        (555) 012-3456
      </motion.p>
      <motion.p
        className="text-[10px] text-[var(--text-muted)] mt-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease }}
      >
        Today, 2:34 PM
      </motion.p>
    </div>
  );
}

/* ─── Phone screen: Auto text reply ─── */
function TextReplyScreen({ active }: { active: boolean }) {
  const [typingDone, setTypingDone] = useState(false);

  if (!active) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="pt-14 pb-3 px-4 border-b border-white/5">
        <motion.p
          className="text-[13px] font-semibold text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease }}
        >
          (555) 012-3456
        </motion.p>
      </div>

      <div className="flex-1 px-4 pt-4 flex flex-col justify-end pb-4">
        <motion.div
          className="self-end max-w-[85%]"
          initial={{ opacity: 0, transform: "translateY(15px) scale(0.95)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ ...springGentle, delay: 0.3 }}
        >
          <div
            className="rounded-2xl rounded-br-md px-3.5 py-2.5"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <Typewriter
              text="Sorry we missed your call! We'll call you back shortly."
              className="text-[12px] leading-[1.5] text-white font-medium"
              delay={800}
              speed={30}
              onComplete={() => setTypingDone(true)}
            />
          </div>
          <AnimatePresence>
            {typingDone && (
              <motion.p
                className="text-[9px] text-[var(--text-muted)] mt-1 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease }}
              >
                Delivered &bull; Auto Follow Up
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="px-3 pb-4">
        <div
          className="rounded-full h-[32px] border border-white/10 flex items-center px-3"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <span className="text-[10px] text-[var(--text-muted)]">iMessage</span>
        </div>
      </div>
    </div>
  );
}

/* ─── iPhone notification banner ─── */
function NotificationBanner({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute top-6 left-1/2 z-50 w-[340px] md:w-[380px]"
          style={{ marginLeft: -170 }}
          initial={{ opacity: 0, transform: "translateY(-60px) scale(0.92)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0, transform: "translateY(-40px) scale(0.95)" }}
          transition={springGentle}
        >
          <div
            className="rounded-2xl px-4 py-3.5 flex items-start gap-3.5"
            style={{
              background: "linear-gradient(135deg, rgba(20,20,50,0.95), rgba(15,15,35,0.98))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.08)",
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
              initial={{ transform: "scale(0.9)" }}
              animate={{ transform: "scale(1)" }}
              transition={springSnappy}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <motion.p
                  className="text-[12px] font-bold text-white"
                  initial={{ opacity: 0, transform: "translateX(-5px)" }}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  transition={{ delay: 0.15, duration: 0.4, ease }}
                >
                  Auto Follow Up
                </motion.p>
                <motion.span
                  className="text-[9px] text-[var(--text-muted)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4, ease }}
                >
                  now
                </motion.span>
              </div>
              <motion.p
                className="text-[12px] font-medium text-[var(--text-secondary)] mt-0.5"
                initial={{ opacity: 0, transform: "translateY(4px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
              >
                Missed call from (555) 012-3456
              </motion.p>
              <motion.p
                className="text-[10px] text-[var(--text-muted)] mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4, ease }}
              >
                Logged &bull; PDF updated &bull; Sheet recorded
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Cutscene ─── */
export default function Cutscene({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgSpringX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const bgSpringY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const fgSpringX = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const fgSpringY = useSpring(mouseY, { stiffness: 25, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) * 0.012);
      mouseY.set((e.clientY - cy) * 0.012);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  /*
   * Timeline:
   * 0: "Every Missed Call, Handled." — dramatic opening (0–2.8s)
   * 1: phone enters + incoming call screen (2.8s)
   * 2: ringing with shake + signal ripples (5s)
   * 3: missed call screen + red pulse (7.5s)
   * 4: phone fades, "But not this time." glitch reveal (10s)
   * 5: phone re-enters with text reply typing (12s)
   * 6: notification banner drops in (15.5s)
   * 7: everything fades, finale text (18s)
   * 8: hold finale (21s)
   * 9: exit (23s)
   */
  const advancePhases = useCallback(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2800),
      setTimeout(() => setPhase(2), 5000),
      setTimeout(() => setPhase(3), 7500),
      setTimeout(() => setPhase(4), 10000),
      setTimeout(() => setPhase(5), 12000),
      setTimeout(() => setPhase(6), 15500),
      setTimeout(() => setPhase(7), 18000),
      setTimeout(() => setPhase(8), 21000),
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setPhase(9);
          onComplete();
        }, 900);
      }, 23000),
    ];
    return timers;
  }, [onComplete]);

  useEffect(() => {
    setHydrated(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setPhase(9);
      onComplete();
      return;
    }
    const timers = advancePhases();
    return () => timers.forEach(clearTimeout);
  }, [advancePhases, onComplete]);

  const skip = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setPhase(9);
      onComplete();
    }, 600);
  }, [onComplete]);

  if (phase === 9) return null;

  if (!hydrated) {
    return <div className="fixed inset-0 z-[100]" style={{ background: "var(--bg-primary)" }} />;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.9, ease: easeExpo }}
    >
      {/* Deep background: ambient glow */}
      <AmbientGlow phase={phase} />

      {/* Particles layer with parallax */}
      <motion.div className="absolute inset-0" style={{ x: bgSpringX, y: bgSpringY }}>
        <Particles />
      </motion.div>

      {/* Light streaks */}
      <LightStreaks active={phase >= 1} />

      {/* Subtle grid */}
      <motion.div
        className="absolute inset-0 grid-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.25 : 0.1 }}
        transition={{ duration: 2.5, ease }}
      />

      {/* Signal ripples during ringing */}
      <SignalRipples active={phase >= 1 && phase <= 2} x="50%" y="50%" />
      <SignalRipples active={phase === 3} x="50%" y="50%" color="rgba(255,255,255," />

      {/* Foreground content with parallax */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{ x: fgSpringX, y: fgSpringY }}
      >
        {/* ─── PHASE 0: Opening title — "Every Missed Call, Handled." ─── */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              key="opening"
              className="flex flex-col items-center gap-6"
              exit={{ opacity: 0, transform: "translateY(-20px)" }}
              transition={{ duration: 0.7, ease }}
            >
              <SplitReveal
                text="Every Missed Call,"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight text-center"
                delay={0.3}
              />
              <GlitchReveal
                text="Handled."
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold gradient-text-green tracking-tight"
                delay={1.2}
              />
              <motion.div
                className="w-16 h-[2px] mt-2"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent-green), transparent)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8, ease: easeExpo }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PHASES 1-3: Phone with incoming / missed call ─── */}
        <AnimatePresence mode="wait">
          {phase >= 1 && phase <= 3 && (
            <motion.div key="phone-incoming" exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
              <Smartphone phase={phase} shaking={phase >= 1 && phase <= 2}>
                <AnimatePresence mode="wait">
                  {phase <= 2 && (
                    <motion.div key="incoming-screen" className="h-full" exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.5, ease }}>
                      <IncomingCallScreen />
                    </motion.div>
                  )}
                  {phase === 3 && (
                    <motion.div
                      key="missed-screen"
                      className="h-full"
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <MissedCallScreen />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Smartphone>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PHASE 4: "But not this time." bridge with glitch ─── */}
        <AnimatePresence>
          {phase === 4 && (
            <motion.div
              key="bridge"
              className="text-center"
              initial={{ opacity: 0, transform: "translateY(12px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-8px)" }}
              transition={{ duration: 0.8, ease }}
            >
              <GlitchReveal
                text="BUT NOT THIS TIME."
                className="text-lg md:text-xl uppercase tracking-[0.25em] text-[var(--accent-green)] font-semibold"
                delay={0.2}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PHASES 5-6: Phone with text reply + notification ─── */}
        <AnimatePresence>
          {(phase === 5 || phase === 6) && (
            <motion.div
              key="phone-reply"
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transform: "translateY(-30px)" }}
              transition={{ duration: 0.7, ease }}
            >
              <Smartphone phase={phase} shaking={false}>
                <TextReplyScreen active={true} />
              </Smartphone>
              {/* Green signal ripples as response is sent */}
              <SignalRipples active={phase === 5} x="50%" y="50%" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PHASE 7-8: Finale ─── */}
        <AnimatePresence>
          {(phase === 7 || phase === 8) && (
            <motion.div
              key="finale"
              className="flex flex-col items-center gap-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0, transform: "scale(0.9)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                transition={springHeavy}
              >
                <motion.div
                  className="absolute inset-[-20px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
                    filter: "blur(15px)",
                  }}
                  initial={{ opacity: 0, transform: "scale(0.9)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  transition={{ delay: 0.2, duration: 1.2, ease }}
                />
                <motion.div
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 0 50px rgba(16,185,129,0.25), 0 15px 40px rgba(0,0,0,0.3)",
                  }}
                  initial={{ transform: "scale(0.92)" }}
                  animate={{ transform: "scale(1)" }}
                  transition={springGentle}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <motion.polyline
                      points="20 6 9 17 4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, delay: 0.4, ease: easeExpo }}
                    />
                  </svg>
                </motion.div>
              </motion.div>

              <div className="text-center">
                <SplitReveal
                  text="Caught. Handled. Done."
                  className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight"
                  delay={0.5}
                />
                <motion.p
                  className="text-base md:text-lg text-[var(--text-secondary)] mt-5"
                  initial={{ opacity: 0, transform: "translateY(8px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ delay: 2.2, duration: 0.7, ease }}
                >
                  Every missed call, handled.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notification banner — floats above everything */}
      <NotificationBanner visible={phase === 6} />

      {/* Skip */}
      <AnimatePresence>
        {!exiting && phase < 7 && (
          <motion.button
            onClick={skip}
            className="absolute bottom-10 z-50 text-sm text-[var(--text-muted)] btn-press flex items-center gap-2"
            style={{ transition: "color 150ms cubic-bezier(0.23,1,0.32,1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.5, ease }}
          >
            Skip intro
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-40">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, var(--accent-green), var(--accent-blue))" }}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min((phase / 8) * 100, 100)}%` }}
          transition={{ duration: 1.5, ease }}
        />
      </div>
    </motion.div>
  );
}
