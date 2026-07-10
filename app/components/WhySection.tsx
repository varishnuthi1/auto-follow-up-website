"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const ease = [0.23, 1, 0.32, 1] as const;

const stats = [
  { value: "80%", label: "of callers won't leave a voicemail" },
  { value: "67%", label: "hang up when they can't reach a person" },
  { value: "5s", label: "average response time with Auto Follow Up" },
];

export default function WhySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: copy */}
          <div>
            <ScrollReveal>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Every missed call is a{" "}
                <span className="gradient-text-green">missed customer.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed">
                When someone calls your business and nobody picks up, they
                don&apos;t wait. They call the next place. No voicemail, no
                second chance. That customer is gone.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
                Auto Follow Up makes sure that never happens. The moment a call
                goes unanswered, the caller gets a text, you get notified, and
                everything is logged. The customer feels heard. You stay in
                control.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <a
                href="#book"
                className="btn-press btn-glow inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-semibold bg-[var(--accent-green)] text-[var(--bg-primary)]"
                style={{
                  boxShadow: "0 0 24px rgba(16, 185, 129, 0.15)",
                }}
              >
                Stop losing customers
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </ScrollReveal>
          </div>

          {/* Right: stats */}
          <motion.div
            ref={ref}
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: [...ease] }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                className="relative p-8 rounded-2xl border border-white/5 bg-[var(--bg-card)]"
                initial={{
                  opacity: 0,
                  transform: "translateX(30px)",
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        transform: "translateX(0px)",
                      }
                    : {
                        opacity: 0,
                        transform: "translateX(30px)",
                      }
                }
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [...ease],
                }}
              >
                <p
                  className="text-5xl md:text-6xl font-extrabold gradient-text-green"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[var(--text-secondary)] text-lg">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
