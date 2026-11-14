import { describe, it, expect } from 'vitest';
import { detectDelimiter, parseCSV, parseJSON, parseInput } from '@/lib/cleaning/parser';

describe('Delimiter detection', () => {
  it('detects comma delimiter', () => {
    const csv = 'station,pm25,pm10\nA,50,100\nB,60,120';
    expect(detectDelimiter(csv)).toBe(',');
  });

  it('detects tab delimiter for TSV', () => {
    const tsv = 'station\tpm25\tpm10\nA\t50\t100\nB\t60\t120';
    expect(detectDelimiter(tsv)).toBe('\t');
  });

  it('detects semicolon delimiter', () => {
    const ssv = 'station;pm25;pm10\nA;50;100\nB;60;120';
    expect(detectDelimiter(ssv)).toBe(';');
  });
});

describe('parseCSV', () => {
  it('parses basic CSV with header and rows', () => {
    const csv = 'station,pm25,pm10\nAnand Vihar,150,250\nITO,120,200';
    const rows = parseCSV(csv, ',');
    expect(rows).toHaveLength(2);
    expect(rows[0]['station']).toBe('Anand Vihar');
    expect(rows[0]['pm25']).toBe('150');
    expect(rows[1]['station']).toBe('ITO');
  });

  it('handles quoted values with commas inside', () => {
    const csv = 'station,"pm2.5 (ug/m3)",note\n"Delhi, Anand Vihar",180,"high, alert"';
    const rows = parseCSV(csv, ',');
    expect(rows).toHaveLength(1);
    expect(rows[0]['station']).toBe('Delhi, Anand Vihar');
    expect(rows[0]['note']).toBe('high, alert');
  });
});

describe('parseJSON', () => {
  it('parses array of objects', () => {
    const json = JSON.stringify([
      { station: 'RK Puram', pm25: 85, no2: 45 },
      { station: 'Dwarka', pm25: 110, no2: 55 },
    ]);
    const rows = parseJSON(json);
    expect(rows).toHaveLength(2);
    expect(rows[0]['station']).toBe('RK Puram');
    expect(rows[0]['pm25']).toBe('85');
  });
});

describe('parseInput auto-detection', () => {
  it('auto-detects JSON', () => {
    const json = '[{"station": "A", "pm25": 100}]';
    const result = parseInput(json);
    expect(result.format).toBe('json');
    expect(result.rows).toHaveLength(1);
  });

  it('auto-detects CSV', () => {
    const csv = 'station,pm25\nA,100';
    const result = parseInput(csv);
    expect(result.format).toBe('csv');
    expect(result.rows).toHaveLength(1);
  });
});
