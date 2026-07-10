"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

const features = [
  {
    title: "Instant Text Reply",
    description:
      "Callers receive a professional text within seconds of a missed call. They know you care before they even think about calling someone else.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "var(--accent-green)",
  },
  {
    title: "Owner Notification",
    description:
      "You get a text with the caller's number and exact time. Decide when to call back on your terms, with full context.",
    icon: (
      <svg
        width="24"
        height="24"
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
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "var(--accent-blue)",
  },
  {
    title: "Google Sheet Logging",
    description:
      "Every missed call is logged automatically — caller number, time, and status. A clean, searchable record you can always reference.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "var(--accent-green-light)",
  },
  {
    title: "Live PDF Reports",
    description:
      "Each missed call triggers a PDF regeneration for the current week, saved to Google Drive. Your report is always current.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M9 15l3 3 3-3" />
      </svg>
    ),
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "var(--accent-amber)",
  },
  {
    title: "Weekly Email Digest",
    description:
      "Every Friday at 8pm, you receive the week's complete report by email. No checking, no remembering. It comes to you.",
    icon: (
      <svg
        width="24"
        height="24"
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
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "var(--accent-blue-light)",
  },
  {
    title: "Permanent Archive",
    description:
      "Every weekly PDF is permanently archived in Google Drive. Months from now, you can look back at any week's call data.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "#a78bfa",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, transform: "translateY(20px)" }}
      animate={
        isInView
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(20px)" }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [...ease],
      }}
    >
      <div
        className="group relative h-full p-6 rounded-2xl border border-white/5 bg-[var(--bg-card)] overflow-hidden"
        style={{
          transition:
            "border-color 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms cubic-bezier(0.23,1,0.32,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${feature.iconColor}33`;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 0 30px ${feature.iconColor}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Gradient bg */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity`}
          style={{
            transitionDuration: "300ms",
            transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        <div className="relative z-10">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
            style={{
              background: `${feature.iconColor}15`,
              color: feature.iconColor,
            }}
          >
            {feature.icon}
          </div>
          <h3
            className="text-lg font-bold text-[var(--text-primary)] mb-2"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            {feature.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
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
            <span className="text-[var(--text-primary)]">Features at a </span>
            <span className="gradient-text-green">Glance</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--text-secondary)] max-w-lg mx-auto">
            Everything runs in the background. You focus on your business.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
