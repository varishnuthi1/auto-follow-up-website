"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, transform: "translateY(12px) scale(0.92)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(12px) scale(0.92)" }}
            transition={{ duration: 0.25, ease }}
            className="absolute bottom-[72px] right-0 w-[300px] rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 shadow-2xl"
            style={{
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.08)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-green)]/15 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Let&apos;s talk
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Free 15-min consultation
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
              Want to see how Auto Follow Up works for your business? Book a
              free session — no commitment.
            </p>

            <a
              href="https://calendar.app.google/2oH4m4n3eHhe6RMu7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press btn-glow flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-[var(--accent-green)] text-[var(--bg-primary)]"
            >
              <svg
                width="14"
                height="14"
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
              Book on Google Calendar
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="btn-press relative w-14 h-14 rounded-full bg-[var(--accent-green)] text-[var(--bg-primary)] flex items-center justify-center shadow-lg"
        style={{
          boxShadow:
            "0 4px 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2, ease }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Ping ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[var(--accent-green)]"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
