'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SkipLink } from './SkipLink';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HazeStrip } from './HazeStrip';

export type WorkspaceView = 'overview' | 'desk' | 'brief' | 'advisory' | 'compare';

interface AppShellProps {
  dataDesk: React.ReactNode;
  brief: React.ReactNode;
  evidence: React.ReactNode;
  hazeValues?: number[];
  datasetLabel?: string;
  rowCount?: number;
  overallReliability?: number;
  isFallback?: boolean;
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  isEvidenceDrawerOpen: boolean;
  onToggleEvidenceDrawer: () => void;
  evidenceCount?: number;
  onResetData?: () => void;
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
  activeView,
  onViewChange,
  isEvidenceDrawerOpen,
  onToggleEvidenceDrawer,
  evidenceCount = 0,
  onResetData,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems: { id: WorkspaceView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Executive Canvas',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'desk',
      label: 'Data Desk & Audit',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: rowCount ? `${rowCount} rows` : undefined,
    },
    {
      id: 'brief',
      label: 'Policy Brief & Hotspots',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: 'CPCB',
    },
    {
      id: 'advisory',
      label: 'Citizen Broadcast',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      badge: '6 Lang',
    },
    {
      id: 'compare',
      label: 'Cycle Compare Lab',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      badge: 'GrAP',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] font-sans antialiased selection:bg-[var(--color-marigold)] selection:text-[var(--color-ink)]">
      <SkipLink />

      {/* Top Application Bar */}
      <header className="border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Emblem & Masthead */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/10 text-[var(--color-ink)] transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--color-ink)]/20 shadow-xs flex-shrink-0 bg-white">
              <Image
                src="/saanspatra-emblem.svg"
                alt="SaansPatra Official Emblem"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[var(--color-ink)]">
                  SaansPatra
                </h1>
                <span className="font-hindi text-xs font-semibold text-[var(--color-ink)]/70 hidden sm:inline">
                  सांसपत्र
                </span>
                <span className="text-[11px] uppercase tracking-wider font-mono text-[var(--color-ink)]/70 hidden lg:inline">
                  &bull; Civic Air Quality Briefing Studio
                </span>
              </div>
              <p className="text-[10px] font-mono text-[var(--color-ink)]/60 hidden sm:block">
                CPCB National Air Quality Standards &bull; Grounded Deterministic Intelligence
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Dataset Pill */}
            {datasetLabel && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-ink)]/20 bg-[var(--color-ink)]/[0.03] text-xs font-mono max-w-[260px] sm:max-w-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-aqi-good)] animate-ping flex-shrink-0" />
                <span className="font-bold text-[var(--color-ink)] truncate">
                  {datasetLabel.split('(')[0].trim()}
                </span>
                {overallReliability !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[var(--color-ink)]/10 text-[var(--color-ink)] font-bold text-[10px] flex-shrink-0">
                    {overallReliability}%
                  </span>
                )}
                {onResetData && (
                  <button
                    type="button"
                    onClick={onResetData}
                    className="ml-1 text-[10px] font-bold text-[var(--color-brick)] hover:underline flex-shrink-0 cursor-pointer"
                    title="Switch or reset dataset"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}

            {/* Evidence Drawer Toggle */}
            <button
              type="button"
              onClick={onToggleEvidenceDrawer}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEvidenceDrawerOpen
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]/50'
              }`}
              title="Toggle Evidence Ledger Slide-Over Drawer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline">Evidence</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[var(--color-marigold)] text-[var(--color-ink)]">
                {evidenceCount}
              </span>
            </button>

            <ThemeSwitcher />
          </div>
        </div>

        {/* Workflow Status Bar */}
        <div className="border-t border-[var(--color-ink)]/10 bg-[var(--color-ink)]/[0.02] px-4 py-1 hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-[var(--color-ink)]/70">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Workflow: 1. Ingest & Audit &rarr; 2. CPCB AQI &rarr; 3. Grounded Brief &rarr; 4. GrAP Compare</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isFallback ? 'text-[var(--color-marigold)]' : 'text-[var(--color-aqi-good)]'}`}>
                ● {isFallback ? 'Deterministic Engine (Offline Safe)' : 'Live Gemini 2.5 Flash'}
              </span>
              <span className="text-[var(--color-ink)]/40">|</span>
              <span className="text-[var(--color-aqi-good)] font-bold">SHA-256 Grounded</span>
            </div>
          </div>
        </div>

        {/* Ambient Haze Strip */}
        <HazeStrip values={hazeValues} height="h-2" />
      </header>

      {/* Main Workspace with Sidebar + Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Desktop Left Navigation Sidebar */}
        <aside
          className={`hidden md:block transition-all duration-200 border-r border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-3 flex-shrink-0 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
          aria-label="Workspace Navigation"
        >
          <div className="sticky top-24 space-y-4">
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/50">
                  Workspace Views
                </div>
              )}
              {navItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold shadow-xs'
                        : 'text-[var(--color-ink)]/80 hover:bg-[var(--color-ink)]/[0.05] hover:text-[var(--color-ink)]'
                    }`}
                    title={item.label}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-[var(--color-paper)] text-[var(--color-ink)]'
                            : 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]/70'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Box in Sidebar */}
            {!isSidebarCollapsed && datasetLabel && (
              <div className="p-3.5 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-2 text-xs font-mono">
                <div className="text-[10px] uppercase font-bold text-[var(--color-ink)]/50">
                  Active Ingestion
                </div>
                <div className="font-bold text-[var(--color-ink)] truncate text-[11px]">
                  {datasetLabel.split('(')[0].trim()}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--color-ink)]/70 pt-1 border-t border-[var(--color-ink)]/10">
                  <span>Audit Health:</span>
                  <span className="font-bold text-[var(--color-aqi-good)]">{overallReliability || 100}%</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Workspace Stage */}
        <main id="main-content" className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-8" tabIndex={-1}>
          {/* VIEW: OVERVIEW / EXECUTIVE CANVAS (Unified Multi-Stage Studio) */}
          {activeView === 'overview' && (
            <div className="space-y-8">
              {/* STAGE 1: DATA DESK & INGESTION */}
              <section
                id="stage-data-desk"
                className="space-y-4"
                aria-label="Pane 1: Data Desk"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center font-mono text-xs font-bold">
                      1
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[var(--color-ink)]">
                      Pane 1: Data Desk
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-ink)]/60">
                    Deterministic Ingestion & Audit Engine
                  </span>
                </div>
                {dataDesk}
              </section>

              {/* STAGE 2: POLICY BRIEF & HOTSPOTS */}
              <section
                id="stage-policy-brief"
                className="space-y-4 pt-4 border-t-2 border-[var(--color-ink)]/10"
                aria-label="Pane 2: Brief & Advisory"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center font-mono text-xs font-bold">
                      2
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[var(--color-ink)]">
                      Pane 2: Brief & Advisory
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-ink)]/60">
                    Gemini AI & Grounding Validator
                  </span>
                </div>
                {brief}
              </section>

              {/* STAGE 3: TRACEABLE EVIDENCE LEDGER */}
              <section
                id="stage-evidence-trail"
                className="space-y-4 pt-4 border-t-2 border-[var(--color-ink)]/10"
                aria-label="Pane 3: Traceable Evidence Logs"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center font-mono text-xs font-bold">
                      3
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[var(--color-ink)]">
                      Pane 3: Evidence Trail
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-ink)]/60">
                    Deterministic Mathematical Ledger
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
                  {evidence}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: DATA DESK (Focused Stage 1) */}
          {activeView === 'desk' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-ink)]/15 pb-3">
                <h2 className="font-serif font-bold text-2xl text-[var(--color-ink)]">
                  Pane 1: Data Desk
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-1">
                  Ingestion, Delimiter Sniffing, Anomaly Forensics & Cleaned Telemetry Preview
                </p>
              </div>
              {dataDesk}
            </div>
          )}

          {/* VIEW: POLICY BRIEF (Focused Stage 2) */}
          {activeView === 'brief' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-ink)]/15 pb-3">
                <h2 className="font-serif font-bold text-2xl text-[var(--color-ink)]">
                  Pane 2: Brief & Advisory
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-1">
                  Grounded Intelligence Dossier, Radar Scope & Persona Action Directives
                </p>
              </div>
              {brief}
            </div>
          )}

          {/* VIEW: CITIZEN BROADCAST (Focused Stage 3) */}
          {activeView === 'advisory' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-ink)]/15 pb-3">
                <h2 className="font-serif font-bold text-2xl text-[var(--color-ink)]">
                  Citizen Public Health Broadcast Studio
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-1">
                  Multilingual Voice Broadcaster, WhatsApp Syndication & Vulnerable Group Guidance
                </p>
              </div>
              {brief}
            </div>
          )}

          {/* VIEW: CYCLE COMPARE LAB (Focused Stage 4) */}
          {activeView === 'compare' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-ink)]/15 pb-3">
                <h2 className="font-serif font-bold text-2xl text-[var(--color-ink)]">
                  Cycle Compare Lab & GrAP Delta Audit
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-1">
                  Track Environmental Shifts Across Monitoring Cycles in IndexedDB
                </p>
              </div>
              {brief}
            </div>
          )}
        </main>
      </div>

      {/* Slide-Over Evidence Inspector Drawer */}
      {isEvidenceDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Evidence Ledger Drawer">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onToggleEvidenceDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[var(--color-paper)] border-l-2 border-[var(--color-ink)] shadow-2xl p-6 flex flex-col space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[var(--color-ink)]">
                    Evidence Ledger Drawer
                  </h3>
                  <p className="text-[11px] font-mono text-[var(--color-ink)]/60">
                    Mathematical proof logs & row provenance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleEvidenceDrawer}
                  className="p-2 rounded-lg border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/10 text-[var(--color-ink)] cursor-pointer"
                  title="Close Drawer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                {evidence}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar (< 768px) */}
      <nav
        className="md:hidden sticky bottom-0 z-40 bg-[var(--color-paper)] border-t-2 border-[var(--color-ink)] px-2 py-1 shadow-lg flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg font-mono text-[10px] min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'text-[var(--color-ink)] font-bold'
                  : 'text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}>
                {item.icon}
              </div>
              <span className="mt-0.5 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

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
