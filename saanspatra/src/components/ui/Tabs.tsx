'use client';

import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex border-b border-[var(--color-ink)]/20 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider min-h-[44px] transition-colors border-b-2 -mb-px whitespace-nowrap ${
                isActive
                  ? 'border-[var(--color-ink)] font-bold text-[var(--color-ink)] bg-[var(--color-ink)]/5'
                  : 'border-transparent text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isActive}
            className="pt-4"
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  );
}
