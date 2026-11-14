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

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isSupported) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={handleSpeak}
        title="Read advisory aloud using text-to-speech"
        className="min-h-[36px] flex items-center gap-1.5"
      >
        {isSpeaking ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[var(--color-brick)] animate-ping" />
            <span>Stop Audio</span>
          </>
        ) : (
          <span>Read Aloud</span>
        )}
      </Button>

      {/* Animated Civic Audio Waveform */}
      {isSpeaking && (
        <div
          className="flex items-center gap-0.5 h-4 px-1.5 py-0.5 rounded bg-[var(--color-ink)]/10"
          aria-label="Audio broadcasting in progress"
        >
          <span className="w-1 h-3 bg-[var(--color-ink)] animate-pulse rounded-full" />
          <span className="w-1 h-4 bg-[var(--color-brick)] animate-pulse delay-75 rounded-full" />
          <span className="w-1 h-2 bg-[var(--color-ink)] animate-pulse delay-150 rounded-full" />
          <span className="w-1 h-3.5 bg-[var(--color-brick)] animate-pulse delay-100 rounded-full" />
        </div>
      )}
    </div>
  );
}
