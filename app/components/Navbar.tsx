"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { label: "Why Us", href: "#why", id: "why" },
  { label: "Features", href: "#features", id: "features" },
  { label: "Book", href: "#book", id: "book" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ids = navLinks.map((l) => l.id);

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, transform: "translateY(-10px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="transition-all"
        style={{
          transitionDuration: "300ms",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          background: scrolled ? "rgba(5, 5, 16, 0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            <span className="gradient-text-green">Auto</span>
            <span className="text-[var(--text-primary)]"> Follow Up</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm transition-colors py-1"
                style={{
                  transitionDuration: "150ms",
                  transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  color:
                    activeSection === link.id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    activeSection === link.id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)")
                }
              >
                {link.label}
                <span
                  className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-all"
                  style={{
                    transitionDuration: "250ms",
                    transitionTimingFunction:
                      "cubic-bezier(0.23, 1, 0.32, 1)",
                    background:
                      "linear-gradient(90deg, var(--accent-green), var(--accent-green-light))",
                    opacity: activeSection === link.id ? 1 : 0,
                    transform:
                      activeSection === link.id ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </a>
            ))}
            <a
              href="https://calendar.app.google/2oH4m4n3eHhe6RMu7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press btn-glow px-5 py-2 rounded-full text-sm font-semibold bg-[var(--accent-green)] text-[var(--bg-primary)]"
            >
              Book a Free Session
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute h-0.5 w-5 bg-[var(--text-primary)] transition-transform rounded-full ${
                mobileOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
              style={{
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
            <span
              className={`absolute h-0.5 w-5 bg-[var(--text-primary)] transition-opacity rounded-full ${
                mobileOpen ? "opacity-0" : ""
              }`}
              style={{ transitionDuration: "150ms" }}
            />
            <span
              className={`absolute h-0.5 w-5 bg-[var(--text-primary)] transition-transform rounded-full ${
                mobileOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
              style={{
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden"
            style={{
              background: "rgba(5, 5, 16, 0.92)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2"
                  style={{
                    color:
                      activeSection === link.id
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://calendar.app.google/2oH4m4n3eHhe6RMu7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press btn-glow mt-2 px-5 py-3 rounded-full text-center font-semibold bg-[var(--accent-green)] text-[var(--bg-primary)]"
                onClick={() => setMobileOpen(false)}
              >
                Book a Free Session
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
