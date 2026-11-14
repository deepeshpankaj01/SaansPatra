'use client';

import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFileLoaded: (content: string, filename: string) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileLoaded, disabled }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    // Max 1 MB check
    if (file.size > 1_048_576) {
      setError('File exceeds 1 MB limit. Please upload a smaller dataset.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text || text.trim() === '') {
        setError('Uploaded file is empty.');
        return;
      }
      onFileLoaded(text, file.name);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[var(--color-marigold)] bg-[var(--color-marigold)]/10 scale-[1.01]'
            : 'border-[var(--color-ink)]/25 hover:border-[var(--color-ink)]/60 bg-[var(--color-paper)] hover:bg-[var(--color-ink)]/[0.01]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV, TSV, or JSON air quality file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.tsv,.json,.txt"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-1.5">
          <svg
            className="w-8 h-8 text-[var(--color-ink)]/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <div className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
            Drop CSV / TSV / JSON here
          </div>
          <div className="text-[11px] font-mono text-[var(--color-ink)]/60">
            or click to browse local files (max 1 MB, up to 5,000 rows)
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[var(--color-ink)]/10 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[var(--color-ink)]/60">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-aqi-good)]" />
          <span>In-Memory Client Isolation &bull; Formula-Escape Sanitized</span>
        </div>
      </div>

      {error && (
        <div
          className="p-2.5 text-xs font-mono text-[var(--color-brick)] bg-[var(--color-brick)]/10 border border-[var(--color-brick)]/30 rounded"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
