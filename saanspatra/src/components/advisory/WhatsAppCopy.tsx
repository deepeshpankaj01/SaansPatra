'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface WhatsAppCopyProps {
  textToCopy: string;
}

export function WhatsAppCopy({ textToCopy }: WhatsAppCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={handleCopy}
      title="Copy clean plain-text advisory formatted for WhatsApp sharing"
    >
      {copied ? 'Copied to Clipboard!' : 'Copy for WhatsApp'}
    </Button>
  );
}
