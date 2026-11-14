import React from 'react';

export type StampType = 'verified' | 'unverified' | 'provisional';

interface StampBadgeProps {
  type: StampType;
  className?: string;
  label?: string;
}

export function StampBadge({ type, className = '', label }: StampBadgeProps) {
  const configs = {
    verified: {
      text: label || 'VERIFIED',
      cssClass: 'stamp-badge stamp-verified font-bold',
      symbol: '[OK]',
    },
    unverified: {
      text: label || 'UNVERIFIED',
      cssClass: 'stamp-badge stamp-unverified font-black',
      symbol: '[!]',
    },
    provisional: {
      text: label || 'PROVISIONAL',
      cssClass: 'stamp-badge stamp-provisional font-medium',
      symbol: '[?]',
    },
  };

  const current = configs[type];

  return (
    <span
      className={`${current.cssClass} inline-block select-none transform -rotate-1 ${className}`}
      role="status"
      title={`Grounding Status: ${current.text}`}
    >
      <span className="opacity-75 mr-1 font-mono text-[10px]">{current.symbol}</span>
      {current.text}
    </span>
  );
}
