import { PersonaId, PERSONAS } from './types';
import { BriefingAction } from '../gemini/schemas';

/**
 * Filters and re-ranks actions based on the active persona.
 * Citizen persona receives only health advisory (empty enforcement actions).
 */
export function filterActionsForPersona(
  actions: BriefingAction[],
  personaId: PersonaId,
): BriefingAction[] {
  if (personaId === 'citizen') {
    return [];
  }

  const persona = PERSONAS[personaId];
  if (!persona) return actions;

  // Filter or prioritize actions matching persona's action domains
  const matched: BriefingAction[] = [];
  const other: BriefingAction[] = [];

  for (const act of actions) {
    const textLower = `${act.action} ${act.owner} ${act.rationale}`.toLowerCase();
    const isDomainMatch = persona.actionDomains.some((domain) =>
      textLower.includes(domain.toLowerCase()),
    );

    if (isDomainMatch) {
      matched.push(act);
    } else {
      other.push(act);
    }
  }

  // Put domain-matched actions first, then others
  return [...matched, ...other];
}
