"use client";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <p
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              <span className="gradient-text-green">Auto</span>{" "}
              <span className="text-[var(--text-primary)]">Follow Up</span>
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Never miss a customer again. Every missed call, handled.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 tracking-wide uppercase">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Why Auto Follow Up", href: "#why" },
                { label: "Features", href: "#features" },
                { label: "Book a Session", href: "#book" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] transition-colors"
                    style={{
                      transitionDuration: "150ms",
                      transitionTimingFunction:
                        "cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 tracking-wide uppercase">
              Get Started
            </h4>
            <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
              Ready to capture every missed call? Book a free session today.
            </p>
            <a
              href="https://calendar.app.google/2oH4m4n3eHhe6RMu7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--accent-green)] text-[var(--bg-primary)]"
            >
              Book a Session
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Auto Follow Up. All rights
            reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)] italic">
            Every missed call, handled.
          </p>
        </div>
      </div>
    </footer>
  );
}
