import { BriefingResponse } from '../gemini/schemas';
import { AnalyticsResult, Evidence } from '../analytics/types';

export interface FindingValidation {
  findingId: string;
  isVerified: boolean;
  missingRefs: string[];
  unmatchedNumbers: number[];
  reason?: string;
}

export interface ValidationReport {
  totalClaims: number;
  verifiedClaims: number;
  isFullyGround: boolean;
  badgeText: string;
  findingResults: Record<string, FindingValidation>;
}

/**
 * Validates Gemini's generated briefing findings against deterministic evidence and computed stats.
 * Verifies:
 * 1. Every cited evidenceRef exists in the evidence array
 * 2. Every numerical value in the claim string corresponds to an actual computed metric
 */
export function validateBriefing(
  briefing: BriefingResponse,
  evidence: Evidence[],
  stats: AnalyticsResult,
): ValidationReport {
  const evidenceMap = new Map<string, Evidence>();
  for (const e of evidence) {
    evidenceMap.set(e.id, e);
  }

  // Gather all legitimate numbers in computed stats into a lookup set
  const legitimateNumbers = new Set<number>();

  // Add overall AQI
  legitimateNumbers.add(Math.round(stats.overallAQI.value));
  legitimateNumbers.add(stats.overallAQI.value);

  // Add stations AQIs and pollutant values
  for (const st of stats.stations) {
    legitimateNumbers.add(st.aqi.overall);
    legitimateNumbers.add(st.readingCount);
    legitimateNumbers.add(st.flaggedCount);
    for (const p of Object.values(st.pollutantStats)) {
      legitimateNumbers.add(p.mean);
      legitimateNumbers.add(Math.round(p.mean));
      legitimateNumbers.add(p.max);
      legitimateNumbers.add(p.min);
      legitimateNumbers.add(p.count);
    }
  }

  // Add hotspot scores and AQIs
  for (const h of stats.hotspots) {
    legitimateNumbers.add(h.score);
    legitimateNumbers.add(h.aqi);
  }

  // Add evidence values
  for (const e of evidence) {
    if (typeof e.value === 'number') {
      legitimateNumbers.add(e.value);
      legitimateNumbers.add(Math.round(e.value));
    }
  }

  const findingResults: Record<string, FindingValidation> = {};
  let verifiedCount = 0;

  for (const finding of briefing.findings) {
    const missingRefs: string[] = [];
    const unmatchedNumbers: number[] = [];

    // 1. Check evidenceRefs
    if (!finding.evidenceRefs || finding.evidenceRefs.length === 0) {
      missingRefs.push('NO_REFS_PROVIDED');
    } else {
      for (const ref of finding.evidenceRefs) {
        if (!evidenceMap.has(ref)) {
          missingRefs.push(ref);
        }
      }
    }

    // 2. Extract numbers from claim text (e.g. "stands at 320 (AQI)")
    // Match integers or floats, ignoring pure dates/years like 2024/2025
    const numberMatches = finding.claim.match(/\b\d+(\.\d+)?\b/g) || [];
    for (const match of numberMatches) {
      const num = parseFloat(match);
      // Skip year numbers (2020-2030) and common small ordinals (1, 2, 3)
      if (num >= 2020 && num <= 2030) continue;
      if (num <= 3 && finding.claim.includes(`P${num}`)) continue;

      // Check if number matches any legitimate stat or cited evidence
      const matchesLegitimate =
        legitimateNumbers.has(num) ||
        legitimateNumbers.has(Math.round(num)) ||
        finding.evidenceRefs.some((ref) => {
          const ev = evidenceMap.get(ref);
          return ev && (ev.description.includes(match) || ev.value === num);
        });

      if (!matchesLegitimate) {
        unmatchedNumbers.push(num);
      }
    }

    const isVerified = missingRefs.length === 0 && unmatchedNumbers.length === 0;
    if (isVerified) verifiedCount++;

    let reason: string | undefined;
    if (!isVerified) {
      const reasons: string[] = [];
      if (missingRefs.length > 0) {
        reasons.push(`Unresolved evidence refs: ${missingRefs.join(', ')}`);
      }
      if (unmatchedNumbers.length > 0) {
        reasons.push(`Unverified numbers in claim: ${unmatchedNumbers.join(', ')}`);
      }
      reason = reasons.join('; ');
    }

    findingResults[finding.id] = {
      findingId: finding.id,
      isVerified,
      missingRefs,
      unmatchedNumbers,
      reason,
    };
  }

  const totalClaims = briefing.findings.length;
  const isFullyGround = totalClaims > 0 && verifiedCount === totalClaims;

  return {
    totalClaims,
    verifiedClaims: verifiedCount,
    isFullyGround,
    badgeText: `Verified ${verifiedCount} of ${totalClaims} claims`,
    findingResults,
  };
}
