"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const stats = [
  { value: 5, suffix: "s", label: "Response Time", prefix: "" },
  { value: 24, suffix: "/7", label: "Automatic Coverage", prefix: "" },
  { value: 0, suffix: "", label: "Missed Opportunities", prefix: "Zero" },
  { value: 100, suffix: "%", label: "of Callers Texted Back", prefix: "" },
];

function CountUp({
  target,
  suffix,
  prefix,
  active,
  duration = 2,
}: {
  target: number;
  suffix: string;
  prefix: string;
  active: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (prefix) {
      setCount(target);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (current !== start) {
        start = current;
        setCount(current);
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, prefix]);

  if (prefix) return <>{prefix}</>;
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.03) 50%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)" }} />

      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, transform: "translateY(16px)" }}
              animate={
                inView
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: "translateY(16px)" }
              }
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <p
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text-green"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  active={inView}
                />
              </p>
              <p className="mt-2 text-sm md:text-base text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
