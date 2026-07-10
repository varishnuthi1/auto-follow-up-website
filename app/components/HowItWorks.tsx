"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

const steps = [
  {
    number: "01",
    title: "Call Goes Unanswered",
    description:
      "A customer calls your business. You're busy, on another line, or away. The call goes to voicemail or rings out.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    color: "var(--text-primary)",
  },
  {
    number: "02",
    title: "Instant Text to Caller",
    description:
      'The caller immediately gets a text: "Sorry we missed your call! We\'ll call you back shortly." No delay, no effort from you.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "var(--accent-green)",
  },
  {
    number: "03",
    title: "You Get Notified",
    description:
      "You receive a text with the caller's number and the exact time they called. You're always in the loop.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    color: "var(--accent-blue)",
  },
  {
    number: "04",
    title: "Logged to Google Sheets",
    description:
      "Every missed call is recorded instantly in a Google Sheet — caller number, time, and status. A running history you can always check.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    color: "var(--accent-green-light)",
  },
  {
    number: "05",
    title: "Live PDF Updated",
    description:
      "Every time a call is logged, the current week's PDF report is regenerated and saved to Google Drive. Always up to date.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: "var(--accent-amber)",
  },
  {
    number: "06",
    title: "Weekly Email Report",
    description:
      "Every Friday at 8pm, the week's PDF is emailed to you and archived permanently in Google Drive. Zero manual work.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    color: "var(--accent-blue-light)",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, transform: "translateY(24px)" }}
      animate={
        isInView
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(24px)" }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [...ease],
      }}
    >
      <div
        className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-[var(--bg-card)] hover-lift hover-glow-green"
        style={{
          transition:
            "border-color 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${step.color}33`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
        }}
      >
        {/* Step number */}
        <span
          className="text-xs font-bold tracking-widest uppercase mb-4 block"
          style={{ color: step.color, opacity: 0.7 }}
        >
          Step {step.number}
        </span>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: `${step.color}15`,
            color: step.color,
          }}
        >
          {step.icon}
        </div>

        {/* Content */}
        <h3
          className="text-xl font-bold text-[var(--text-primary)] mb-3"
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          {step.title}
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          animate={
            headerInView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(20px)" }
          }
          transition={{ duration: 0.6, ease: [...ease] }}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            <span className="text-[var(--text-primary)]">How It </span>
            <span className="gradient-text-green">Works</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            From missed call to handled customer in under 5 seconds. Fully
            automatic. Here's the breakdown.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
