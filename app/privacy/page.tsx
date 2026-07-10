import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Auto Follow Up",
  description: "How Auto Follow Up collects, uses, and protects your data.",
};

const sections = [
  {
    title: "Who We Are",
    content:
      "Auto Follow Up is a service that helps small businesses automatically respond to missed calls via SMS. When a call goes unanswered, the caller receives a single text message on behalf of the business.",
  },
  {
    title: "What We Collect",
    content:
      "We collect the phone numbers of callers who reach businesses using Auto Follow Up. This happens automatically when a call is missed. We also collect the date and time of each missed call for logging purposes.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Phone numbers are used solely to send a single SMS notification on behalf of the business you called. We do not use your number for marketing, advertising, or any other purpose. Call logs are shared only with the business owner whose number you called.",
  },
  {
    title: "Data Sharing",
    content:
      "We do not sell, rent, or share your personal data with any third parties. Your phone number is never transferred to advertisers, data brokers, or any external services beyond what is necessary to deliver the single SMS reply.",
  },
  {
    title: "Data Retention",
    content:
      "Call logs and phone numbers are retained for up to 90 days to allow business owners to review their missed call history. After this period, data is permanently deleted from our systems.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to request deletion of your data at any time. To do so, email us at varishnuthi1@gmail.com with the phone number you'd like removed and we will delete it within 5 business days.",
  },
  {
    title: "Security",
    content:
      "We take reasonable technical measures to protect the data we hold. Call logs are stored securely and access is limited to the business owner and our internal systems.",
  },
  {
    title: "Contact",
    content:
      "If you have any questions about this privacy policy or how your data is handled, contact us at varishnuthi1@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div
      style={{ background: "var(--bg-primary)", minHeight: "100vh" }}
      className="text-[var(--text-primary)]"
    >
      {/* Minimal nav */}
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
          <Link
            href="/"
            className="privacy-back-link text-sm text-[var(--text-muted)]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--accent-green)] mb-4">
            Legal
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Last updated: July 10, 2026
          </p>
          <div
            className="mt-6 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-green), transparent)",
            }}
          />
        </div>

        {/* Intro */}
        <p className="text-[var(--text-secondary)] leading-relaxed mb-12">
          This policy explains how Auto Follow Up handles the data it processes
          on behalf of small businesses and their callers. We keep things
          simple: we collect only what we need, use it only as described, and
          never sell it.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2
                className="text-xl font-bold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                {section.title}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {section.content}
              </p>
              {i < sections.length - 1 && (
                <div className="mt-10 h-[1px] bg-white/5" />
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 p-6 rounded-2xl border border-white/5 bg-[var(--bg-card)]">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Questions or data removal requests?{" "}
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
