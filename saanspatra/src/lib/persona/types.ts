export type PersonaId = 'ward_officer' | 'rwa' | 'school' | 'citizen';

export interface Persona {
  id: PersonaId;
  name: string;
  roleTitle: string;
  description: string;
  actionDomains: string[];
  receivesBriefingNote: boolean;
  receivesAdvisory: boolean;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  ward_officer: {
    id: 'ward_officer',
    name: 'Ward Officer',
    roleTitle: 'Municipal Administration & Public Health',
    description:
      'Responsible for municipal enforcement: road dust suppression, illegal waste burning control, traffic corridor diversions, and construction dust inspections.',
    actionDomains: [
      'sanitation',
      'enforcement',
      'road dust',
      'waste burning',
      'traffic',
      'construction',
      'municipal',
    ],
    receivesBriefingNote: true,
    receivesAdvisory: true,
  },
  rwa: {
    id: 'rwa',
    name: 'Housing Society / RWA',
    roleTitle: 'Resident Welfare Association & Estate Management',
    description:
      'Focused on residential compound safeguards: diesel generator (DG) set regulations, ban on sweepings/leaf burning, common-area air management, and community advisories.',
    actionDomains: [
      'dg sets',
      'garbage burning',
      'residential',
      'common-area',
      'society',
      'rwa',
      'security',
    ],
    receivesBriefingNote: true,
    receivesAdvisory: true,
  },
  school: {
    id: 'school',
    name: 'School Administration',
    roleTitle: 'School Leadership & Student Welfare',
    description:
      'Prioritizes child health: outdoor activity/sports cancellation, morning assembly relocation, classroom ventilation, commute mask guidance, and revised hours.',
    actionDomains: [
      'outdoor activity',
      'sports',
      'assembly',
      'classroom',
      'mask',
      'children',
      'timing',
      'school',
    ],
    receivesBriefingNote: true,
    receivesAdvisory: true,
  },
  citizen: {
    id: 'citizen',
    name: 'Citizen & Resident',
    roleTitle: 'General Public & Family Health',
    description:
      'Receives actionable public health advisory only: morning routine adjustments, precautions for children, seniors, and respiratory/cardiac patients.',
    actionDomains: ['personal health', 'indoor air', 'exercise', 'masks', 'household'],
    receivesBriefingNote: false,
    receivesAdvisory: true,
  },
};
