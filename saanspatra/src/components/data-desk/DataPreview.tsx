import React from 'react';
import { CleanedRow } from '@/lib/cleaning/types';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils/formatting';

interface DataPreviewProps {
  rows: CleanedRow[];
  totalRows: number;
}

export function DataPreview({ rows, totalRows }: DataPreviewProps) {
  if (rows.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="font-bold text-[var(--color-ink)]">
          Cleaned Data Preview (Showing {rows.length} of {totalRows} rows)
        </span>
      </div>

      <div className="overflow-x-auto border border-[var(--color-ink)]/20 rounded max-h-80 overflow-y-auto">
        <table className="w-full text-left text-[11px] font-mono border-collapse">
          <thead className="bg-[var(--color-ink)] text-[var(--color-paper)] sticky top-0 uppercase tracking-wider z-10">
            <tr>
              <th scope="col" className="px-2 py-1.5 font-bold">ID</th>
              <th scope="col" className="px-2 py-1.5 font-bold">Station</th>
              <th scope="col" className="px-2 py-1.5 font-bold">Timestamp</th>
              <th scope="col" className="px-2 py-1.5 font-bold">PM2.5</th>
              <th scope="col" className="px-2 py-1.5 font-bold">PM10</th>
              <th scope="col" className="px-2 py-1.5 font-bold">NO2</th>
              <th scope="col" className="px-2 py-1.5 font-bold">Quality Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {rows.map((row) => {
              const hasFlags = row.flags.length > 0;
              return (
                <tr
                  key={row.id}
                  className={
                    hasFlags
                      ? 'bg-[var(--color-brick)]/[0.04]'
                      : 'hover:bg-[var(--color-ink)]/[0.02]'
                  }
                >
                  <td className="px-2 py-1.5 font-bold text-[var(--color-ink)]/70">{row.id}</td>
                  <td className="px-2 py-1.5 font-medium">{row.stationId}</td>
                  <td className="px-2 py-1.5 text-[var(--color-ink)]/80">{formatDate(row.timestamp)}</td>
                  <td className="px-2 py-1.5">
                    {row.pollutants['pm25'] !== null && row.pollutants['pm25'] !== undefined
                      ? `${row.pollutants['pm25']} µg/m³`
                      : '--'}
                  </td>
                  <td className="px-2 py-1.5">
                    {row.pollutants['pm10'] !== null && row.pollutants['pm10'] !== undefined
                      ? `${row.pollutants['pm10']} µg/m³`
                      : '--'}
                  </td>
                  <td className="px-2 py-1.5">
                    {row.pollutants['no2'] !== null && row.pollutants['no2'] !== undefined
                      ? `${row.pollutants['no2']} µg/m³`
                      : '--'}
                  </td>
                  <td className="px-2 py-1.5">
                    {row.flags.length === 0 ? (
                      <span className="text-[var(--color-ink)]/40">Clean</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {row.flags.map((f, fIdx) => (
                          <Badge
                            key={fIdx}
                            variant={
                              f.reason === 'SENTINEL' || f.reason === 'OUT_OF_RANGE' || f.reason === 'SPIKE'
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
