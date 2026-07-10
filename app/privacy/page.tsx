import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Auto Follow Up",
  description:
    "Privacy policy for Auto Follow Up's automated missed call SMS notification service.",
};

const sections = [
  {
    heading: "Who We Are",
    body: "Auto Follow Up provides automated missed call SMS notification services to small businesses in the United States. When a caller contacts a business using our service and the call goes unanswered, our system sends an automated text message on behalf of that business.",
  },
  {
    heading: "Information We Collect",
    body: "We collect the following information: phone numbers of callers who contact businesses using our service, timestamps of missed calls, and call status. We do not collect names, addresses, payment information, or any other personal data.",
  },
  {
    heading: "How We Use Your Information",
    body: "Phone numbers are used solely to send a single automated SMS notification informing you that your call was missed and that the business will return your call. We do not use your phone number for marketing, promotions, or any other purpose.",
  },
  {
    heading: "SMS and Text Messaging",
    body: "Auto Follow Up sends SMS notifications on behalf of small businesses to inform callers their call was missed. Message frequency is approximately 1 message per missed call event. Message and data rates may apply. Text STOP to opt out at any time. Text HELP for assistance.",
  },
  {
    heading: "Data Sharing",
    body: "We do not sell, share, rent, or trade your phone number or any personal information to third parties, affiliates, or lead generators for marketing or promotional purposes. Mobile opt-in data and consent will not be shared with any third parties or affiliates for marketing or promotional purposes. Information may only be shared with subcontractors who directly support our service operations, such as Twilio for SMS delivery and Google for data logging, and only to the extent necessary to deliver the service.",
  },
  {
    heading: "Data Retention",
    body: "Caller phone numbers and timestamps are stored in a secure Google Sheet accessible only to the business owner. Data is retained for as long as the business remains a client of Auto Follow Up. You may request deletion of your data at any time.",
  },
  {
    heading: "Your Rights and Opt-Out",
    body: "You may opt out of receiving SMS messages at any time by replying STOP to any message you receive. You will receive one confirmation message and no further messages will be sent. To request deletion of your data, contact us at varishnuthi1@gmail.com.",
  },
  {
    heading: "Contact Us",
    body: "For any questions, requests, or concerns about this privacy policy, contact us at varishnuthi1@gmail.com.",
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
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
              background:
                "linear-gradient(90deg, var(--accent-green), transparent)",
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
                <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                  {section.body}
                </p>
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
