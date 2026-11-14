'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface ReadAloudProps {
  text: string;
  language?: string;
}

export function ReadAloud({ text, language = 'en' }: ReadAloudProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (supported) {
      // Use requestAnimationFrame or setTimeout to decouple from immediate render cycle
      const timer = setTimeout(() => setIsSupported(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSpeak = () => {
    if (!isSupported || !text) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Reset any ongoing utterances

    const utterance = new SpeechSynthesisUtterance(text);
    // Map language code to BCP 47
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={handleSpeak}
      title="Read advisory aloud using text-to-speech"
    >
      {isSpeaking ? 'Stop Audio' : 'Read Aloud'}
    </Button>
  );
}
