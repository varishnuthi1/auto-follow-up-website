"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

export default function Booking() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="book" className="relative py-24 md:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        ref={ref}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        initial={{ opacity: 0, transform: "translateY(24px)" }}
        animate={
          inView
            ? { opacity: 1, transform: "translateY(0px)" }
            : { opacity: 0, transform: "translateY(24px)" }
        }
        transition={{ duration: 0.6, ease: [...ease] }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[var(--accent-amber)]/20 bg-[var(--accent-amber)]/5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-amber)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-sm text-[var(--accent-amber-light)] font-medium">
            Free consultation
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          Ready to stop
          <br />
          <span className="gradient-text-green">losing customers?</span>
        </h2>

        <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          Book a free session and we&apos;ll set up Auto Follow Up for your
          business. You&apos;ll never worry about missed calls again.
        </p>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(12px)" }
          }
          transition={{ duration: 0.5, delay: 0.2, ease: [...ease] }}
        >
          <a
            href="https://calendar.app.google/2oH4m4n3eHhe6RMu7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press btn-glow hover-lift inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-bold bg-[var(--accent-green)] text-[var(--bg-primary)]"
            style={{
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.25)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Book Your Free Session
          </a>

          <p className="mt-4 text-sm text-[var(--text-muted)]">
            No commitment. No credit card. Just a conversation.
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [...ease] }}
        >
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No commitment required
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Works with any phone
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
