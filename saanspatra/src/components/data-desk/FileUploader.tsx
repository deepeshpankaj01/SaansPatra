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
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-[var(--color-marigold)] bg-[var(--color-marigold)]/10'
            : 'border-[var(--color-ink)]/30 hover:border-[var(--color-ink)] bg-[var(--color-paper)]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV, TSV, or JSON file"
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

        <div className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
          Drop CSV / TSV / JSON here
        </div>
        <div className="text-[11px] font-mono text-[var(--color-ink)]/60 mt-1">
          or click to browse files (max 1 MB, up to 5,000 rows)
        </div>
      </div>

      {error && (
        <div className="p-2 text-xs font-mono text-[var(--color-brick)] bg-[var(--color-brick)]/10 border border-[var(--color-brick)]/30 rounded" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
