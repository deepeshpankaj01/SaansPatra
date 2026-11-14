'use client';

import React, { useState } from 'react';
import { SkipLink } from './SkipLink';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HazeStrip } from './HazeStrip';

interface AppShellProps {
  dataDesk: React.ReactNode;
  brief: React.ReactNode;
  evidence: React.ReactNode;
  hazeValues?: number[];
}

export function AppShell({
  dataDesk,
  brief,
  evidence,
  hazeValues,
}: AppShellProps) {
  const [mobileTab, setMobileTab] = useState<'desk' | 'brief' | 'evidence'>('brief');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] font-sans antialiased selection:bg-[var(--color-marigold)] selection:text-[var(--color-ink)]">
      <SkipLink />

      {/* Municipal Gazette Masthead Header */}
      <header className="border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[var(--color-ink)]">
              SaansPatra
            </h1>
            <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-ink)]/70 hidden sm:inline">
              Civic Air Quality Briefing Studio
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Signature Haze Strip Divider */}
        <HazeStrip values={hazeValues} height="h-2" />

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden border-t border-[var(--color-ink)]/15 flex divide-x divide-[var(--color-ink)]/15 bg-[var(--color-paper)]" role="tablist" aria-label="Sections">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'desk'}
            aria-controls="mobile-panel-desk"
            onClick={() => setMobileTab('desk')}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider min-h-[44px] ${
              mobileTab === 'desk'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
                : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5'
            }`}
          >
            Data Desk
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'brief'}
            aria-controls="mobile-panel-brief"
            onClick={() => setMobileTab('brief')}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider min-h-[44px] ${
              mobileTab === 'brief'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
                : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5'
            }`}
          >
            Briefing & Advisory
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'evidence'}
            aria-controls="mobile-panel-evidence"
            onClick={() => setMobileTab('evidence')}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider min-h-[44px] ${
              mobileTab === 'evidence'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
                : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5'
            }`}
          >
            Evidence Trail
          </button>
        </div>
      </header>

      {/* Main 3-Pane Desk on Desktop / Tabbed on Mobile */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6" tabIndex={-1}>
        {/* Desktop 3-Pane Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Data Desk (4 cols) */}
          <section className="lg:col-span-4 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded shadow-sm overflow-hidden" aria-label="Data Desk">
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold">
              Pane 1: Data Desk
            </div>
            <div className="p-4">{dataDesk}</div>
          </section>

          {/* Center Pane: Brief & Advisory (5 cols) */}
          <section className="lg:col-span-5 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded shadow-sm overflow-hidden" aria-label="Briefing Studio">
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex justify-between items-center">
              <span>Pane 2: Brief & Advisory</span>
            </div>
            <div className="p-4">{brief}</div>
          </section>

          {/* Right Pane: Evidence Trail (3 cols) */}
          <aside className="lg:col-span-3 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded shadow-sm overflow-hidden sticky top-20" aria-label="Evidence Trail">
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold">
              Pane 3: Evidence Trail
            </div>
            <div className="p-4">{evidence}</div>
          </aside>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          {mobileTab === 'desk' && (
            <div id="mobile-panel-desk" role="tabpanel" className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded p-4">
              {dataDesk}
            </div>
          )}
          {mobileTab === 'brief' && (
            <div id="mobile-panel-brief" role="tabpanel" className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded p-4">
              {brief}
            </div>
          )}
          {mobileTab === 'evidence' && (
            <div id="mobile-panel-evidence" role="tabpanel" className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded p-4">
              {evidence}
            </div>
          )}
        </div>
      </main>

      {/* Gazette Footer */}
      <footer className="border-t border-[var(--color-ink)]/20 py-4 px-6 bg-[var(--color-paper)] text-xs font-mono text-[var(--color-ink)]/70 text-center">
        <p>SaansPatra | Civic Air Quality Briefing Studio | Grounded in CPCB Standards | Official Gemini AI SDK</p>
      </footer>
    </div>
  );
}
