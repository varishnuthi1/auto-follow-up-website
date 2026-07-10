"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];
const easeExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function WordRevealOnScroll({
  text,
  className = "",
  delay = 0,
  stagger = 0.08,
  inView,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView: boolean;
}) {
  return (
    <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em" }}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, transform: "translateY(18px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(18px)" }
          }
          transition={{ duration: 0.55, delay: delay + i * stagger, ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function EmotionalHook() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background drama — faint red-to-green gradient shift */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.02) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 70%, rgba(16,185,129,0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Decorative side lines */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-[200px] hidden lg:block"
        style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.06), rgba(16,185,129,0.15), transparent)" }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: easeExpo }}
      />
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[200px] hidden lg:block"
        style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.06), rgba(16,185,129,0.15), transparent)" }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: easeExpo }}
      />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* The emotional statement — large typography */}
        <div className="space-y-5">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.15]"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            <WordRevealOnScroll
              text="Every time your phone rings and you can't answer —"
              className="text-[var(--text-primary)]"
              inView={inView}
              delay={0}
              stagger={0.06}
            />
          </h2>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-[var(--text-secondary)] leading-relaxed font-medium"
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateY(0px)" }
                : { opacity: 0, transform: "translateY(16px)" }
            }
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            that&apos;s not just a missed call.
          </motion.p>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-medium"
            style={{ color: "var(--text-primary)" }}
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateY(0px)" }
                : { opacity: 0, transform: "translateY(16px)" }
            }
            transition={{ duration: 0.7, delay: 1.3, ease }}
          >
            That&apos;s a customer who needed you, couldn&apos;t reach you, and
            is already calling your competitor.
          </motion.p>
        </div>

        {/* Divider line */}
        <motion.div
          className="mx-auto mt-12 mb-12 h-[1px] max-w-[120px]"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent-green), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: easeExpo }}
        />

        {/* The resolution */}
        <motion.p
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-tight"
          style={{ fontFamily: "var(--font-bricolage)" }}
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(16px)" }
          }
          transition={{ duration: 0.7, delay: 2.1, ease }}
        >
          Auto Follow Up makes sure that{" "}
          <span className="gradient-text-green">never costs you a customer.</span>
        </motion.p>
      </div>
    </section>
  );
}
