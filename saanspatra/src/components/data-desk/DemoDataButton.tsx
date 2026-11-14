'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import {
  DEMO_DATA_MIXED_UNITS,
  DEMO_DATA_STUCK_SENSOR,
  DEMO_DATA_DATE_CHAOS,
} from '@/data';

interface DemoDataButtonProps {
  onLoadData: (data: string, label: string) => void;
  disabled?: boolean;
}

export function DemoDataButton({ onLoadData, disabled }: DemoDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (data: string, label: string) => {
    onLoadData(data, label);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Load Demo Dataset...
      </Button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] rounded shadow-md z-30 divide-y divide-[var(--color-ink)]/15 font-mono text-xs"
          role="menu"
        >
          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/10 transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_MIXED_UNITS,
                'Delhi NCR Multi-Station (Mixed Units, -999 Sentinel, Missing Values)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)]">
              1. Delhi NCR Multi-Station
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70">
              Mixed units (ug/m3, mg/m3, ppb), -999 sentinels, missing records.
            </div>
          </button>

          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/10 transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_STUCK_SENSOR,
                'Mumbai Coastal Stations (Stuck Sensor, Duplicates, Underscore Headers)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)]">
              2. Mumbai Coastal Stations
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70">
              Stuck sensor at Powai, duplicate readings at BKC.
            </div>
          </button>

          <button
            type="button"
            className="w-full text-left p-3 hover:bg-[var(--color-ink)]/10 transition-colors"
            role="menuitem"
            onClick={() =>
              handleSelect(
                DEMO_DATA_DATE_CHAOS,
                'Kolkata Met Area (Date Chaos, Negative Values, TSV Format)',
              )
            }
          >
            <div className="font-bold text-[var(--color-ink)]">
              3. Kolkata Met Area (TSV)
            </div>
            <div className="text-[11px] text-[var(--color-ink)]/70">
              Mixed dates (ISO, DD/MM, MM-DD, Epoch), negative outliers, tab-separated.
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
