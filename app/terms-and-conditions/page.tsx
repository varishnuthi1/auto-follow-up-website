import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions — Auto Follow Up",
  description:
    "Terms and conditions for Auto Follow Up's automated missed call SMS notification service.",
};

const sections = [
  {
    heading: "Service Description",
    body: "Auto Follow Up provides automated missed call SMS notification services to small businesses. When you call a business that uses our service and your call goes unanswered, you may receive one automated text message informing you that the business missed your call and will return it shortly. This service is operated on behalf of the business you called, not on your behalf.",
  },
  {
    heading: "SMS Terms",
    body: "By calling a business that uses Auto Follow Up, you may receive a single automated SMS notification. Message and data rates may apply. Message frequency is approximately 1 message per missed call. To opt out of future messages, reply STOP to any message. To get help, reply HELP. For additional support contact varishnuthi1@gmail.com.",
  },
  {
    heading: "Opt-Out",
    body: "You can opt out of receiving SMS messages at any time by replying STOP. You will receive one final confirmation message confirming your opt-out and no further messages will be sent to your number. To opt back in, reply START.",
  },
  {
    heading: "Help",
    body: "Reply HELP to any message for assistance or contact us directly at varishnuthi1@gmail.com.",
  },
  {
    heading: "Data and Privacy",
    body: null,
    custom: true,
  },
  {
    heading: "Limitation of Liability",
    body: "Auto Follow Up is not liable for missed calls, undelivered SMS messages, SMS delivery failures, carrier filtering, or any damages resulting from the use or inability to use this service. SMS delivery is subject to carrier approval and availability.",
  },
  {
    heading: "Changes to These Terms",
    body: "We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.",
  },
  {
    heading: "Contact",
    body: "For any questions about these terms contact us at varishnuthi1@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <div
      style={{ background: "var(--bg-primary)", minHeight: "100vh" }}
      className="text-[var(--text-primary)]"
    >
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            <span className="gradient-text-green">Auto</span>
            <span className="text-[var(--text-primary)]"> Follow Up</span>
          </Link>
          <Link href="/" className="privacy-back-link text-sm text-[var(--text-muted)]">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Page header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--accent-green)] mb-4">
            Legal
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Terms and Conditions
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm text-[var(--text-muted)]">
            <span>Last Updated: July 2026</span>
            <span className="hidden sm:block text-white/10">·</span>
            <span>
              Business:{" "}
              <span className="text-[var(--text-secondary)]">Auto Follow Up</span>
            </span>
            <span className="hidden sm:block text-white/10">·</span>
            <a
              href="mailto:varishnuthi1@gmail.com"
              className="privacy-email-link text-[var(--accent-green)]"
            >
              varishnuthi1@gmail.com
            </a>
          </div>
          <div
            className="mt-8 h-[1px]"
            style={{
              background: "linear-gradient(90deg, var(--accent-green), transparent)",
            }}
          />
        </div>

        {/* Sections */}
        <div className="space-y-0">
          {sections.map((section, i) => (
            <div key={i}>
              <div className="py-8">
                <h2
                  className="text-lg font-bold text-[var(--text-primary)] mb-3"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  {section.heading}
                </h2>

                {section.custom ? (
                  <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                    We do not sell or share your phone number or personal information
                    with any third parties for marketing or promotional purposes. Your
                    phone number is used solely to send the single automated SMS
                    described above. For full details see our{" "}
                    <Link
                      href="/privacy"
                      className="privacy-email-link text-[var(--accent-green)]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                ) : (
                  <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                    {section.body}
                  </p>
                )}
              </div>
              {i < sections.length - 1 && (
                <div className="h-[1px] bg-white/5" />
              )}
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-[var(--bg-card)]">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Questions about these terms?{" "}
            <a
              href="mailto:varishnuthi1@gmail.com"
              className="privacy-email-link text-[var(--accent-green)]"
            >
              varishnuthi1@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
