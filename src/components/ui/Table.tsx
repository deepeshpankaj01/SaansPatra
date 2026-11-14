import React from 'react';

interface TableProps {
  headers: string[];
  rows: (React.ReactNode | string | number)[][];
  caption?: string;
  className?: string;
}

export function Table({
  headers,
  rows,
  caption,
  className = '',
}: TableProps) {
  return (
    <div className={`overflow-x-auto border border-[var(--color-ink)]/20 rounded ${className}`}>
      <table className="w-full text-left text-xs font-mono border-collapse">
        {caption && (
          <caption className="px-3 py-2 text-left text-xs font-serif font-bold text-[var(--color-ink)]/80 bg-[var(--color-ink)]/5">
            {caption}
          </caption>
        )}
        <thead className="bg-[var(--color-ink)] text-[var(--color-paper)] uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-3 py-2 font-bold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-ink)]/10">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-3 py-4 text-center text-[var(--color-ink)]/60">
                No entries available.
              </td>
            </tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? 'bg-[var(--color-paper)]' : 'bg-[var(--color-ink)]/[0.02]'}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
