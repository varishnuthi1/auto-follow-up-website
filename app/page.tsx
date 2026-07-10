"use client";

import { useState } from "react";
import Cutscene from "./components/Cutscene";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import EmotionalHook from "./components/EmotionalHook";
import HowItWorks from "./components/HowItWorks";
import WhySection from "./components/WhySection";
import Features from "./components/Features";
import Booking from "./components/Booking";
import Footer from "./components/Footer";
import ChatBubble from "./components/ChatBubble";

export default function Home() {
  const [cutsceneComplete, setCutsceneComplete] = useState(false);

  return (
    <>
      <Cutscene onComplete={() => setCutsceneComplete(true)} />

      <div
        style={{
          opacity: cutsceneComplete ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero visible={cutsceneComplete} />
          <StatsBar />
          <EmotionalHook />
          <HowItWorks />
          <WhySection />
          <Features />
          <Booking />
        </main>
        <Footer />
        <ChatBubble />
      </div>
    </>
  );
}
