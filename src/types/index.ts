// === Types partagés pour AtelierPilot ===

/** Modules de navigation principaux */
export type ModuleId = 'bolt_circle' | 'cutting_speed' | 'threading' | 'tools' | 'rect_grid';

/** Sous-vues du module cercle de perçage */
export type BoltCircleView = 'form' | 'table' | 'guide' | 'plan';

/** Sous-onglets vitesses de coupe */
export type CuttingSpeedTab = 'rpm' | 'vc' | 'feed' | 'materials';

/** Sous-onglets taraudage */
export type ThreadingTab = 'calculator' | 'iso_table' | 'lathe_passes';

/** Sous-onglets outils */
export type ToolsTab = 'converter' | 'cone' | 'triangle' | 'weight' | 'divider';

/** Sous-vues du module grille rectangulaire */
export type RectGridView = 'form' | 'table' | 'guide' | 'plan';

/** Sens de rotation */
export type Direction = 'cw' | 'ccw';

/** Type d'outil */
export type ToolType = 'HSS' | 'Carbure';

/** Forme pour le calcul de poids */
export type WeightShape = 'cylinder' | 'tube' | 'plate';

/** Type de pas de filetage */
export type ThreadPitch = 'standard' | 'fine';

/** Un trou calculé (cercle ou grille) */
export interface Hole {
  index: number;
  angle?: number;       // Uniquement pour cercle de perçage
  xAbs: number;         // Position X absolue
  yAbs: number;         // Position Y absolue
  deltaX: number;       // Déplacement X relatif depuis le trou précédent
  deltaY: number;       // Déplacement Y relatif depuis le trou précédent
  depth: number;        // Profondeur Z
}

/** Paramètres du cercle de perçage */
export interface BoltCircleParams {
  outerDiameter: number;
  pcd: number;
  holeCount: number;
  holeDiameter: number;
  holeDepth: number;
  startAngle: number;
  direction: Direction;
}

/** Paramètres de la grille rectangulaire */
export interface RectGridParams {
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
  startX: number;
  startY: number;
  holeDiameter: number;
  holeDepth: number;
}

/** Un matériau avec ses données de coupe */
export interface Material {
  nom: string;
  vcHSS: [number, number];
  vcCarbure: [number, number];
  densite: number;
}

/** Un filetage ISO */
export interface IsoThread {
  nom: string;
  d: number;
  pasStd: number;
  pasFin: number;
}

/** Projet sauvegardé */
export interface Project {
  id: string;
  name: string;
  type: 'bolt_circle' | 'rect_grid';
  params: BoltCircleParams | RectGridParams;
  holes: Hole[];
  createdAt: string;
  updatedAt: string;
}

/** Résultat plateau diviseur */
export interface DivisionResult {
  plateHoles: number;
  holesCount: number;
  fullTurns: number;
}
