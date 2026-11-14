'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SkipLink } from './SkipLink';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HazeStrip } from './HazeStrip';

interface AppShellProps {
  dataDesk: React.ReactNode;
  brief: React.ReactNode;
  evidence: React.ReactNode;
  hazeValues?: number[];
  datasetLabel?: string;
  rowCount?: number;
  overallReliability?: number;
  isFallback?: boolean;
}

export function AppShell({
  dataDesk,
  brief,
  evidence,
  hazeValues,
  datasetLabel,
  rowCount,
  overallReliability,
  isFallback = false,
}: AppShellProps) {
  const [mobileTab, setMobileTab] = useState<'desk' | 'brief' | 'evidence'>('brief');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] font-sans antialiased selection:bg-[var(--color-marigold)] selection:text-[var(--color-ink)]">
      <SkipLink />

      {/* Municipal Gazette Masthead Header */}
      <header className="border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Emblem & Masthead */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--color-ink)]/20 shadow-xs flex-shrink-0 bg-white">
              <Image
                src="/saanspatra-emblem.svg"
                alt="SaansPatra Official Emblem"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2.5">
                <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[var(--color-ink)]">
                  SaansPatra
                </h1>
                <span className="font-hindi text-xs font-semibold text-[var(--color-ink)]/70 hidden sm:inline">
                  सांसपत्र
                </span>
                <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-ink)]/70 hidden md:inline">
                  &bull; Civic Air Quality Briefing Studio
                </span>
              </div>
              <p className="text-[11px] font-mono text-[var(--color-ink)]/60 hidden sm:block">
                CPCB National Air Quality Standards &bull; Grounded Deterministic Intelligence
              </p>
            </div>
          </div>

          {/* Right Controls: Telemetry Pill & Theme */}
          <div className="flex items-center gap-3">
            {datasetLabel && (
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--color-ink)]/20 bg-[var(--color-ink)]/[0.03] text-[11px] font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-aqi-good)] animate-pulse" />
                <span className="font-bold text-[var(--color-ink)] truncate max-w-[180px]">
                  {datasetLabel.split('(')[0].trim()}
                </span>
                {rowCount !== undefined && (
                  <span className="text-[var(--color-ink)]/60">({rowCount} rows)</span>
                )}
                {overallReliability !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-ink)]/10 text-[var(--color-ink)] font-bold text-[10px]">
                    {overallReliability}% Health
                  </span>
                )}
              </div>
            )}
            <ThemeSwitcher />
          </div>
        </div>

        {/* 4-Stage Civic Workflow Stepper */}
        <div className="border-t border-[var(--color-ink)]/10 bg-[var(--color-ink)]/[0.02] px-4 py-1.5 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[var(--color-ink)]/70">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
                <span className="w-4 h-4 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Data Desk (Ingest & Audit)</span>
              </span>
              <span className="text-[var(--color-ink)]/30">&rarr;</span>
              <span className="flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
                <span className="w-4 h-4 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Deterministic Analytics & CPCB AQI</span>
              </span>
              <span className="text-[var(--color-ink)]/30">&rarr;</span>
              <span className="flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
                <span className="w-4 h-4 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Grounded Briefing & Citizen Advisory</span>
              </span>
              <span className="text-[var(--color-ink)]/30">&rarr;</span>
              <span className="flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
                <span className="w-4 h-4 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-[10px]">
                  4
                </span>
                <span>Period Comparison & GrAP Audit</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span
                className={`font-bold ${
                  isFallback ? 'text-[var(--color-marigold)]' : 'text-[var(--color-aqi-good)]'
                }`}
              >
                ● {isFallback ? 'Deterministic Engine (Offline Safe)' : 'Live Gemini 2.5 Flash'}
              </span>
              <span className="text-[var(--color-ink)]/40">|</span>
              <span className="text-[var(--color-aqi-good)] font-bold">SHA-256 Traced</span>
            </div>
          </div>
        </div>

        {/* Signature Haze Strip Divider */}
        <HazeStrip values={hazeValues} height="h-2.5" />

        {/* Mobile Tab Navigation */}
        <div
          className="lg:hidden border-t border-[var(--color-ink)]/15 flex divide-x divide-[var(--color-ink)]/15 bg-[var(--color-paper)]"
          role="tablist"
          aria-label="Sections"
        >
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
          <section
            className="lg:col-span-4 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg shadow-sm overflow-hidden"
            aria-label="Data Desk"
          >
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold flex justify-between items-center">
              <span>Pane 1: Data Desk</span>
              <span className="text-[10px] opacity-75 font-normal">Deterministic Engine</span>
            </div>
            <div className="p-4">{dataDesk}</div>
          </section>

          {/* Center Pane: Brief & Advisory (5 cols) */}
          <section
            className="lg:col-span-5 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg shadow-sm overflow-hidden"
            aria-label="Briefing Studio"
          >
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold flex justify-between items-center">
              <span>Pane 2: Brief & Advisory</span>
              <span className="text-[10px] opacity-75 font-normal">Gemini & Grounding</span>
            </div>
            <div className="p-4">{brief}</div>
          </section>

          {/* Right Pane: Evidence Trail (3 cols) */}
          <aside
            className="lg:col-span-3 bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg shadow-sm overflow-hidden sticky top-24"
            aria-label="Evidence Trail"
          >
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold flex justify-between items-center">
              <span>Pane 3: Evidence Trail</span>
              <span className="text-[10px] opacity-75 font-normal">Deterministic Logs</span>
            </div>
            <div className="p-4">{evidence}</div>
          </aside>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          {mobileTab === 'desk' && (
            <div
              id="mobile-panel-desk"
              role="tabpanel"
              className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg p-4"
            >
              {dataDesk}
            </div>
          )}
          {mobileTab === 'brief' && (
            <div
              id="mobile-panel-brief"
              role="tabpanel"
              className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg p-4"
            >
              {brief}
            </div>
          )}
          {mobileTab === 'evidence' && (
            <div
              id="mobile-panel-evidence"
              role="tabpanel"
              className="bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-lg p-4"
            >
              {evidence}
            </div>
          )}
        </div>
      </main>

      {/* Gazette Footer */}
      <footer className="border-t border-[var(--color-ink)]/20 py-4 px-6 bg-[var(--color-paper)] text-xs font-mono text-[var(--color-ink)]/70 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p>
            SaansPatra (सांसपत्र) &bull; Civic Air Quality Briefing Studio &bull; Grounded in CPCB Standards
          </p>
          <p className="text-[11px] text-[var(--color-ink)]/50">
            PromptWars Hackathon Edition &bull; Deterministic Grounding &bull; Server-Side Gemini SDK
          </p>
        </div>
      </footer>
    </div>
  );
}
