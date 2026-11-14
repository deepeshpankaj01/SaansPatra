'use client';

import React from 'react';
import {
  DEMO_DATA_MIXED_UNITS,
  fetchLiveCityTelemetry,
} from '@/data';

interface HeroWelcomeProps {
  onLoadData: (data: string, label: string) => void;
  disabled?: boolean;
}

export function HeroWelcome({ onLoadData, disabled }: HeroWelcomeProps) {
  const [loadingCity, setLoadingCity] = React.useState<string | null>(null);

  const handleQuickLiveCity = async (cityId: string, cityName: string) => {
    setLoadingCity(cityId);
    try {
      const result = await fetchLiveCityTelemetry(cityId);
      const sourceTag = result.source === 'live' ? 'Live Telemetry' : 'Station Baseline';
      const label = `${cityName} (${result.stationName} - ${sourceTag})`;
      onLoadData(result.csv, label);
    } catch {
      // Fallback handled inside fetchLiveCityTelemetry
    } finally {
      setLoadingCity(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--color-ink)]/20 bg-[var(--color-paper)] p-6 md:p-8 shadow-sm transition-all hover:border-[var(--color-ink)]/30">
      {/* Subtle atmospheric ambient backdrop */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[var(--color-marigold)]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-[var(--color-aqi-good)]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Masthead Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/15 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--color-aqi-good)] animate-ping" />
            <span className="font-bold text-[var(--color-ink)] uppercase tracking-wider">
              Autonomous Civic Intelligence Platform
            </span>
          </div>
          <span className="text-[11px] font-mono text-[var(--color-ink)]/60">
            CPCB NAQI Standard &bull; Zero-Hallucination Grounding
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-2 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-[var(--color-ink)] leading-tight">
            Turn Chaotic Air Quality Tables into Grounded Municipal Action & Citizen Advisories
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[var(--color-ink)]/75 leading-relaxed">
            Ingest messy multi-station CAAQMS sensor tables, automatically audit 10 anomaly criteria with zero LLM hallucinations, rank regional pollution hotspots, and synthesize persona-tailored civic enforcement briefs and multilingual advisories.
          </p>
        </div>

        {/* 3-Step Guided Workflow Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-1.5 transition-all hover:bg-[var(--color-ink)]/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                Ingest & Audit
              </span>
            </div>
            <p className="text-[11px] font-sans text-[var(--color-ink)]/70 leading-normal">
              Delimiter sniffing, unit conversion (ppb to &mu;g/m&sup3;), and 10-reason deterministic anomaly flags.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-1.5 transition-all hover:bg-[var(--color-ink)]/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-xs font-mono font-bold">
                2
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                NAQI & Hotspots
              </span>
            </div>
            <p className="text-[11px] font-sans text-[var(--color-ink)]/70 leading-normal">
              Official Indian CPCB piecewise linear sub-indices, worst-pollutant principle, and radial radar map.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-1.5 transition-all hover:bg-[var(--color-ink)]/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] inline-flex items-center justify-center text-xs font-mono font-bold">
                3
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                Grounded Directives
              </span>
            </div>
            <p className="text-[11px] font-sans text-[var(--color-ink)]/70 leading-normal">
              Persona action matrix (Ward Officer, RWA, Schools) and 6-language audio citizen advisory.
            </p>
          </div>
        </div>

        {/* 1-Click Quick-Start Launchpad */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]/70 mr-1">
            Quick Start:
          </span>

          <button
            type="button"
            disabled={disabled || loadingCity !== null}
            onClick={() => handleQuickLiveCity('bhopal', 'Bhopal')}
            className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink)]/90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span>{loadingCity === 'bhopal' ? 'Fetching Bhopal...' : '⚡ Load Live Bhopal Telemetry'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">CAAQMS</span>
          </button>

          <button
            type="button"
            disabled={disabled || loadingCity !== null}
            onClick={() => handleQuickLiveCity('delhi', 'New Delhi')}
            className="px-4 py-2 text-xs font-mono font-bold rounded-lg border-2 border-[var(--color-ink)] text-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-ink)]/10 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loadingCity === 'delhi' ? 'Fetching Delhi...' : '⚡ Load Live Delhi Telemetry'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--color-ink)]/10">Anand Vihar</span>
          </button>

          <button
            type="button"
            disabled={disabled || loadingCity !== null}
            onClick={() =>
              onLoadData(
                DEMO_DATA_MIXED_UNITS,
                'Delhi NCR Multi-Station (Mixed Units, -999 Sentinel, Missing Values)',
              )
            }
            className="px-4 py-2 text-xs font-mono font-semibold rounded-lg border border-[var(--color-ink)]/25 text-[var(--color-ink)] hover:bg-[var(--color-marigold)]/20 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>📊 Try Delhi Smog Benchmark</span>
            <span className="text-[10px] opacity-60">5 Stations</span>
          </button>
        </div>
      </div>
    </div>
  );
}
