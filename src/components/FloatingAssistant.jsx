import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_MESSAGES = [
  "Stay focused!",
  "You are doing great!",
  "Keep going!",
  "Every minute counts.",
  "Small steps create huge progress.",
];

function FloatingAssistant({ t, useVoice = false }) {
  const messages = useMemo(() => {
    if (!t) return DEFAULT_MESSAGES;
    return [t("msgStayFocused"), t("msgDoingGreat"), t("msgKeepGoing")];
  }, [t]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % messages.length), 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    if (!useVoice || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(messages[index]);
    utter.rate = 1.03;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [index, messages, useVoice]);

  return (
    <div className="assistant-wrapper">
      <div className="assistant-bubble">{messages[index]}</div>
      <div className="assistant-avatar" aria-hidden="true">👋</div>
    </div>
  );
}

export default FloatingAssistant;