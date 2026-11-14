import { describe, it, expect } from 'vitest';
import { filterActionsForPersona } from '@/lib/persona/engine';
import { BriefingAction } from '@/lib/gemini/schemas';

describe('Persona Engine', () => {
  const sampleActions: BriefingAction[] = [
    {
      priority: 'P1',
      action: 'Deploy mechanical sweepers for road dust suppression',
      owner: 'Municipal Sanitation',
      effort: 'medium',
      timeframe: 'Immediate',
      rationale: 'Fugitive road dust reduction',
      evidenceRefs: ['E1'],
    },
    {
      priority: 'P1',
      action: 'Prohibit diesel generator set operations during morning hours',
      owner: 'Estate Management',
      effort: 'low',
      timeframe: 'Immediate',
      rationale: 'Reduce local toxic NO2 spikes',
      evidenceRefs: ['E1'],
    },
    {
      priority: 'P1',
      action: 'Cancel all outdoor sports matches and morning assembly',
      owner: 'School Administration',
      effort: 'low',
      timeframe: 'Immediate',
      rationale: 'Child respiratory safety',
      evidenceRefs: ['E1'],
    },
  ];

  it('filters actions for Ward Officer by municipal domains', () => {
    const actions = filterActionsForPersona(sampleActions, 'ward_officer');
    expect(actions.length).toBe(3);
    // Municipal action should be ranked first
    expect(actions[0].action).toContain('mechanical sweepers');
  });

  it('filters actions for School Administration by student activity domains', () => {
    const actions = filterActionsForPersona(sampleActions, 'school');
    expect(actions.length).toBe(3);
    expect(actions[0].action).toContain('outdoor sports');
  });

  it('returns empty actions for Citizen persona as citizens receive advisory only', () => {
    const actions = filterActionsForPersona(sampleActions, 'citizen');
    expect(actions).toHaveLength(0);
  });
});
