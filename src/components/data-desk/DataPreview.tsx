'use client';

import React, { useState, useMemo } from 'react';
import { CleanedRow } from '@/lib/cleaning/types';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils/formatting';

interface DataPreviewProps {
  rows: CleanedRow[];
  totalRows: number;
}

const INITIAL_RENDER_LIMIT = 50;

export const DataPreview = React.memo(function DataPreview({ rows, totalRows }: DataPreviewProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [renderLimit, setRenderLimit] = useState<number>(INITIAL_RENDER_LIMIT);

  // Memoize flagged rows filtering
  const flaggedRows = useMemo(() => rows.filter((r) => r.flags.length > 0), [rows]);

  // Memoize displayed rows based on active filter and search query
  const displayedRows = useMemo(() => {
    const candidateRows = filterMode === 'flagged' ? flaggedRows : rows;
    if (!searchQuery.trim()) return candidateRows;
    const q = searchQuery.toLowerCase();
    return candidateRows.filter(
      (row) =>
        row.stationId.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.flags.some((f) => f.reason.toLowerCase().includes(q)),
    );
  }, [filterMode, flaggedRows, rows, searchQuery]);

  // Capped render slice for O(1) DOM render performance
  const visibleRows = useMemo(
    () => displayedRows.slice(0, renderLimit),
    [displayedRows, renderLimit],
  );

  if (rows.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[var(--color-ink)]">
            Cleaned Data Preview
          </span>
          <span className="text-[11px] font-mono text-[var(--color-ink)]/60">
            (Showing {displayedRows.length} of {totalRows} rows)
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md p-0.5 bg-[var(--color-ink)]/[0.06] border border-[var(--color-ink)]/15 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setFilterMode('all');
                setRenderLimit(INITIAL_RENDER_LIMIT);
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'all'
                  ? 'bg-[var(--color-paper)] font-bold shadow-xs text-[var(--color-ink)]'
                  : 'text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]'
              }`}
            >
              All Records ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterMode('flagged');
                setRenderLimit(INITIAL_RENDER_LIMIT);
              }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                filterMode === 'flagged'
                  ? 'bg-[var(--color-paper)] font-bold shadow-xs text-[var(--color-brick)]'
                  : 'text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]'
              }`}
            >
              <span>Flagged Only</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--color-brick)]/10 text-[var(--color-brick)] font-bold">
                {flaggedRows.length}
              </span>
            </button>
          </div>

          <input
            type="search"
            placeholder="Search station or flag..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setRenderLimit(INITIAL_RENDER_LIMIT);
            }}
            className="px-2.5 py-1 text-xs font-mono bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded-md focus:border-[var(--color-ink)] focus:outline-hidden w-44"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-[var(--color-ink)]/20 rounded-lg max-h-80 overflow-y-auto shadow-xs">
        <table className="w-full text-left text-[11px] font-mono border-collapse">
          <thead className="bg-[var(--color-ink)] text-[var(--color-paper)] sticky top-0 uppercase tracking-wider z-10">
            <tr>
              <th scope="col" className="px-2.5 py-2 font-bold">Row ID</th>
              <th scope="col" className="px-2.5 py-2 font-bold">Station</th>
              <th scope="col" className="px-2.5 py-2 font-bold">Timestamp</th>
              <th scope="col" className="px-2.5 py-2 font-bold">PM2.5</th>
              <th scope="col" className="px-2.5 py-2 font-bold">PM10</th>
              <th scope="col" className="px-2.5 py-2 font-bold">NO2</th>
              <th scope="col" className="px-2.5 py-2 font-bold">SO2 / CO</th>
              <th scope="col" className="px-2.5 py-2 font-bold">Audit Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10 bg-[var(--color-paper)]">
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-xs text-[var(--color-ink)]/50 font-mono">
                  No records match current filter criteria.
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => {
                const hasFlags = row.flags.length > 0;
                return (
                  <tr
                    key={row.id}
                    className={
                      hasFlags
                        ? 'bg-[var(--color-brick)]/[0.04] hover:bg-[var(--color-brick)]/[0.08]'
                        : 'hover:bg-[var(--color-ink)]/[0.02]'
                    }
                  >
                    <td className="px-2.5 py-1.5 font-bold text-[var(--color-ink)]/70">{row.id}</td>
                    <td className="px-2.5 py-1.5 font-medium">{row.stationId}</td>
                    <td className="px-2.5 py-1.5 text-[var(--color-ink)]/80">
                      {formatDate(row.timestamp)}
                    </td>
                    <td className="px-2.5 py-1.5 font-semibold">
                      {row.pollutants['pm25'] !== null && row.pollutants['pm25'] !== undefined
                        ? `${row.pollutants['pm25']} µg/m³`
                        : '--'}
                    </td>
                    <td className="px-2.5 py-1.5">
                      {row.pollutants['pm10'] !== null && row.pollutants['pm10'] !== undefined
                        ? `${row.pollutants['pm10']} µg/m³`
                        : '--'}
                    </td>
                    <td className="px-2.5 py-1.5">
                      {row.pollutants['no2'] !== null && row.pollutants['no2'] !== undefined
                        ? `${row.pollutants['no2']} µg/m³`
                        : '--'}
                    </td>
                    <td className="px-2.5 py-1.5 text-[var(--color-ink)]/70">
                      {row.pollutants['so2'] != null ? `${row.pollutants['so2']}` : '--'}
                      {' / '}
                      {row.pollutants['co'] != null ? `${row.pollutants['co']} mg` : '--'}
                    </td>
                    <td className="px-2.5 py-1.5">
                      {row.flags.length === 0 ? (
                        <span className="text-[var(--color-aqi-good)] text-[10px] font-bold">
                          ✓ Clean
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {row.flags.map((f, fIdx) => (
                            <Badge
                              key={fIdx}
                              variant={
                                f.reason === 'SENTINEL' ||
                                f.reason === 'OUT_OF_RANGE' ||
                                f.reason === 'SPIKE' ||
                                f.reason === 'STUCK_SENSOR'
                                  ? 'error'
                                  : 'warning'
                              }
                              className="text-[9px]"
                            >
                              {f.reason}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {displayedRows.length > visibleRows.length && (
          <div className="flex items-center justify-between p-2.5 bg-[var(--color-ink)]/[0.03] border-t border-[var(--color-ink)]/10 text-xs font-mono">
            <span className="text-[var(--color-ink)]/60">
              Showing first {visibleRows.length} of {displayedRows.length} records (O(1) DOM capped).
            </span>
            <button
              type="button"
              onClick={() => setRenderLimit((prev) => prev + 50)}
              className="px-3 py-1 text-xs font-mono font-bold text-[var(--color-ink)] bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded hover:bg-[var(--color-ink)]/10 transition-colors cursor-pointer"
            >
              Load Next 50 Rows
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
