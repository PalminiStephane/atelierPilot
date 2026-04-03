import type { Material, IsoThread } from '../types';

// === Matériaux avec vitesses de coupe recommandées ===
export const MATERIAUX: Material[] = [
  { nom: 'Acier doux',      vcHSS: [25, 35],   vcCarbure: [80, 120],  densite: 7.85 },
  { nom: 'Acier inox',      vcHSS: [15, 25],   vcCarbure: [60, 90],   densite: 7.90 },
  { nom: 'Aluminium',       vcHSS: [100, 300],  vcCarbure: [200, 600], densite: 2.70 },
  { nom: 'Laiton',          vcHSS: [40, 70],   vcCarbure: [120, 200], densite: 8.50 },
  { nom: 'Fonte',           vcHSS: [20, 30],   vcCarbure: [60, 100],  densite: 7.20 },
  { nom: 'Cuivre',          vcHSS: [30, 50],   vcCarbure: [80, 150],  densite: 8.96 },
  { nom: 'Plastique / POM', vcHSS: [50, 150],  vcCarbure: [150, 300], densite: 1.42 },
  { nom: 'Bronze',          vcHSS: [25, 40],   vcCarbure: [80, 130],  densite: 8.80 },
];

// === Filetages ISO M2 à M30 ===
export const FILETAGES_ISO: IsoThread[] = [
  { nom: 'M2',   d: 2,   pasStd: 0.4,  pasFin: 0.25 },
  { nom: 'M2.5', d: 2.5, pasStd: 0.45, pasFin: 0.35 },
  { nom: 'M3',   d: 3,   pasStd: 0.5,  pasFin: 0.35 },
  { nom: 'M4',   d: 4,   pasStd: 0.7,  pasFin: 0.5 },
  { nom: 'M5',   d: 5,   pasStd: 0.8,  pasFin: 0.5 },
  { nom: 'M6',   d: 6,   pasStd: 1.0,  pasFin: 0.75 },
  { nom: 'M8',   d: 8,   pasStd: 1.25, pasFin: 1.0 },
  { nom: 'M10',  d: 10,  pasStd: 1.5,  pasFin: 1.25 },
  { nom: 'M12',  d: 12,  pasStd: 1.75, pasFin: 1.25 },
  { nom: 'M14',  d: 14,  pasStd: 2.0,  pasFin: 1.5 },
  { nom: 'M16',  d: 16,  pasStd: 2.0,  pasFin: 1.5 },
  { nom: 'M18',  d: 18,  pasStd: 2.5,  pasFin: 1.5 },
  { nom: 'M20',  d: 20,  pasStd: 2.5,  pasFin: 1.5 },
  { nom: 'M22',  d: 22,  pasStd: 2.5,  pasFin: 2.0 },
  { nom: 'M24',  d: 24,  pasStd: 3.0,  pasFin: 2.0 },
  { nom: 'M27',  d: 27,  pasStd: 3.0,  pasFin: 2.0 },
  { nom: 'M30',  d: 30,  pasStd: 3.5,  pasFin: 2.0 },
];

// === Plateaux diviseur standard (rapport 40:1) ===
export const PLATEAUX_DIVISEUR = [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49];

// === Fractions impériales courantes ===
export const FRACTIONS_IMPERIALES = [
  { fraction: '1/16"',  mm: 1.588 },
  { fraction: '1/8"',   mm: 3.175 },
  { fraction: '3/16"',  mm: 4.763 },
  { fraction: '1/4"',   mm: 6.350 },
  { fraction: '5/16"',  mm: 7.938 },
  { fraction: '3/8"',   mm: 9.525 },
  { fraction: '7/16"',  mm: 11.113 },
  { fraction: '1/2"',   mm: 12.700 },
  { fraction: '9/16"',  mm: 14.288 },
  { fraction: '5/8"',   mm: 15.875 },
  { fraction: '11/16"', mm: 17.463 },
  { fraction: '3/4"',   mm: 19.050 },
  { fraction: '13/16"', mm: 20.638 },
  { fraction: '7/8"',   mm: 22.225 },
  { fraction: '15/16"', mm: 23.813 },
  { fraction: '1"',     mm: 25.400 },
  { fraction: '1-1/8"', mm: 28.575 },
  { fraction: '1-1/4"', mm: 31.750 },
];
