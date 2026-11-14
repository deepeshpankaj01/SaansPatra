'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import {
  DEMO_DATA_MIXED_UNITS,
  DEMO_DATA_STUCK_SENSOR,
  DEMO_DATA_DATE_CHAOS,
  CITIES,
  fetchLiveCityTelemetry,
} from '@/data';

interface DemoDataButtonProps {
  onLoadData: (data: string, label: string) => void;
  disabled?: boolean;
}

export function DemoDataButton({ onLoadData, disabled }: DemoDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  const handleSelect = (data: string, label: string) => {
    onLoadData(data, label);
    setIsOpen(false);
  };

  const handleFetchCity = async (cityId: string) => {
    setLoadingCity(cityId);
    try {
      const result = await fetchLiveCityTelemetry(cityId);
      const sourceTag = result.source === 'live' ? 'Live Telemetry' : 'Station Baseline';
      const label = `${result.cityName} (${result.stationName} - ${sourceTag})`;
      onLoadData(result.csv, label);
      setIsOpen(false);
    } catch {
      // Fallback already handled inside fetchLiveCityTelemetry
    } finally {
      setLoadingCity(null);
    }
  };

  return (
    <div className="relative inline-block w-full">
      <Button
        type="button"
        variant="primary"
        className="w-full justify-between"
        disabled={disabled || loadingCity !== null}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>
          {loadingCity ? `Fetching ${loadingCity}...` : 'Load Demo Dataset...'}
        </span>
        <span className="text-[10px] font-mono opacity-70">3 Benchmarks + 7 Cities</span>
      </Button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1.5 w-full bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded shadow-xl z-40 divide-y divide-[var(--color-ink)]/10 font-mono text-xs max-h-[480px] overflow-y-auto"
          role="menu"
        >
          {/* Section: Standard Messy Benchmarks */}
          <div className="p-2 bg-[var(--color-ink)]/[0.03] text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/60">
            Official Hackathon Benchmark Scenarios
          </div>

          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/[0.06] transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_MIXED_UNITS,
                'Delhi NCR Multi-Station (Mixed Units, -999 Sentinel, Missing Values)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)] flex items-center justify-between">
              <span>1. Delhi NCR Multi-Station</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-brick)]/10 text-[var(--color-brick)] font-bold">
                Winter Smog
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70 mt-0.5">
              Mixed units (ug/m3, mg/m3, ppb), -999 sentinels, missing records across 5 CAAQMS stations.
            </div>
          </button>

          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/[0.06] transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_STUCK_SENSOR,
                'Mumbai Coastal Stations (Stuck Sensor, Duplicates, Underscore Headers)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)] flex items-center justify-between">
              <span>2. Mumbai Coastal Stations</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-marigold)]/15 text-[var(--color-marigold)] font-bold">
                Sensor Flatline
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70 mt-0.5">
              Stuck sensor at Powai (7 readings at 85.3), duplicate readings at BKC, marine air dynamics.
            </div>
          </button>

          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/[0.06] transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_DATE_CHAOS,
                'Kolkata Met Area (Date Chaos, Negative Values, TSV Format)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)] flex items-center justify-between">
              <span>3. Kolkata Met Area (TSV)</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-ink)]/10 text-[var(--color-ink)] font-bold">
                Date Chaos
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70 mt-0.5">
              Mixed dates (ISO, DD/MM, MM-DD, Epoch ms), negative outliers, tab-separated values.
            </div>
          </button>

          {/* Section: Live Real-Time Multi-City Telemetry */}
          <div className="p-2 bg-[var(--color-ink)]/[0.03] text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/60 flex items-center justify-between">
            <span>Live City Telemetry (Open-Meteo & CPCB)</span>
            <span className="text-[9px] text-[var(--color-aqi-good)] font-mono font-bold">
              ● Zero-Auth Live
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[var(--color-ink)]/5">
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                className="w-full text-left px-3 py-2.5 hover:bg-[var(--color-ink)]/[0.06] transition-colors flex items-center justify-between group"
                role="menuitem"
                disabled={loadingCity !== null}
                onClick={() => handleFetchCity(city.id)}
              >
                <div>
                  <div className="font-bold text-[var(--color-ink)] group-hover:text-[var(--color-charcoal)] flex items-center gap-2">
                    <span>{city.name}</span>
                    <span className="text-[10px] font-normal text-[var(--color-ink)]/50">
                      {city.state}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--color-ink)]/60 mt-0.5">
                    {city.monitoringStation}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70">
                    {loadingCity === city.id ? 'Loading...' : 'Load'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
