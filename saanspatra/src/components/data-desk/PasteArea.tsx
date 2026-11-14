'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface PasteAreaProps {
  onProcess: (text: string) => void;
  disabled?: boolean;
}

export function PasteArea({ onProcess, disabled }: PasteAreaProps) {
  const [content, setContent] = useState('');

  const handleProcess = () => {
    if (!content.trim()) return;
    onProcess(content);
  };

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="paste-textarea"
        className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]"
      >
        Or paste raw table data
      </label>

      <textarea
        id="paste-textarea"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
        placeholder={`Paste comma-separated, tab-separated, or JSON air quality readings...\n\nExample:\nStation,Sampling_Date,PM2.5,PM10,NO2\nAnand Vihar,15/01/2025 08:00,240,420,65`}
        className="w-full p-2.5 text-xs font-mono bg-[var(--color-paper)] border border-[var(--color-ink)]/30 rounded focus:border-[var(--color-ink)] focus:outline-hidden disabled:opacity-50"
      />

      <div className="flex justify-between items-center">
        <span className="text-[11px] font-mono text-[var(--color-ink)]/60">
          {content.length > 0 ? `${content.length} characters` : 'Delimiters & units auto-detected'}
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || !content.trim()}
          onClick={handleProcess}
        >
          Parse & Clean
        </Button>
      </div>
    </div>
  );
}
