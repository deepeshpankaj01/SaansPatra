'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface WhatsAppCopyProps {
  textToCopy: string;
}

export function WhatsAppCopy({ textToCopy }: WhatsAppCopyProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatWhatsAppText = (raw: string) => {
    return `*SAANSPATRA CIVIC HEALTH ADVISORY*\n*Air Quality Intelligence Bulletin*\n\n${raw}\n\n_Issued by Municipal Air Quality Studio | Grounded in CPCB Standards_`;
  };

  const handleCopy = async () => {
    try {
      const formatted = formatWhatsAppText(textToCopy);
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleShare = async () => {
    const formatted = formatWhatsAppText(textToCopy);
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'SaansPatra Civic Health Advisory',
          text: formatted,
        });
      } catch {
        // Ignored or cancelled by user
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={handleCopy}
        title="Copy clean plain-text advisory formatted for WhatsApp sharing"
        className="min-h-[36px]"
      >
        {copied ? 'Copied to Clipboard!' : 'Copy for WhatsApp'}
      </Button>

      <button
        type="button"
        onClick={() => setShowPreview(!showPreview)}
        className="text-[11px] font-mono underline text-[var(--color-ink)]/70 hover:text-[var(--color-ink)] px-1.5 py-1"
        aria-label="Preview WhatsApp message bubble"
      >
        {showPreview ? 'Hide Preview' : 'Preview'}
      </button>

      {/* WhatsApp Chat Preview Bubble */}
      {showPreview && (
        <div className="absolute right-0 top-10 w-72 sm:w-80 p-3 bg-[#e5ddd5] dark:bg-[#121b22] text-[#111b21] dark:text-[#e9edef] rounded-lg shadow-xl border border-black/10 z-50 font-sans text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-black/10 pb-1 text-[10px] font-mono text-black/60 dark:text-white/60">
            <span>WhatsApp Dispatch Preview</span>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="font-bold text-xs"
            >
              &times;
            </button>
          </div>
          <div className="bg-[#d9fdd3] dark:bg-[#005c4b] p-3 rounded-lg shadow-xs leading-relaxed whitespace-pre-line text-[11px]">
            {formatWhatsAppText(textToCopy)}
            <div className="text-[9px] text-right text-black/50 dark:text-white/50 pt-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; ✓✓
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleShare}
              className="text-[11px] font-mono font-bold px-2.5 py-1 bg-[#25D366] text-white rounded hover:bg-[#20ba59]"
            >
              Share via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
