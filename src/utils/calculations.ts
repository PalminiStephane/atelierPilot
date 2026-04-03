import type { Hole, BoltCircleParams, RectGridParams, WeightShape, DivisionResult } from '../types';
import { PLATEAUX_DIVISEUR } from './constants';

// === Arrondi à 0.01mm ===
const round2 = (n: number): number => Math.round(n * 100) / 100;

// =============================================
// CERCLE DE PERÇAGE
// =============================================

/** Calcule les positions des trous sur un cercle de perçage */
export function calcBoltCircle(params: BoltCircleParams): Hole[] {
  const { pcd, holeCount, holeDepth, startAngle, direction } = params;
  const radius = pcd / 2;
  const angleStep = 360 / holeCount;
  const holes: Hole[] = [];

  for (let i = 0; i < holeCount; i++) {
    // Calcul de l'angle en degrés puis conversion en radians
    const angleDeg = direction === 'cw'
      ? startAngle + i * angleStep
      : startAngle - i * angleStep;
    const angleRad = (angleDeg * Math.PI) / 180;

    const xAbs = round2(radius * Math.cos(angleRad));
    const yAbs = round2(radius * Math.sin(angleRad));

    // Déplacements relatifs : depuis le centre pour le premier trou, sinon depuis le trou précédent
    const deltaX = i === 0 ? xAbs : round2(xAbs - holes[i - 1].xAbs);
    const deltaY = i === 0 ? yAbs : round2(yAbs - holes[i - 1].yAbs);

    holes.push({
      index: i,
      angle: round2(((angleDeg % 360) + 360) % 360), // Normaliser entre 0-360
      xAbs,
      yAbs,
      deltaX,
      deltaY,
      depth: round2(-Math.abs(holeDepth)),
    });
  }

  return holes;
}

// =============================================
// GRILLE RECTANGULAIRE (parcours serpentin)
// =============================================

/** Calcule les positions des trous sur une grille rectangulaire en serpentin */
export function calcRectGrid(params: RectGridParams): Hole[] {
  const { rows, cols, spacingX, spacingY, startX, startY, holeDepth } = params;
  const holes: Hole[] = [];
  let index = 0;

  for (let row = 0; row < rows; row++) {
    for (let colIdx = 0; colIdx < cols; colIdx++) {
      // Serpentin : rangées paires gauche→droite, impaires droite→gauche
      const col = row % 2 === 0 ? colIdx : (cols - 1 - colIdx);

      const xAbs = round2(startX + col * spacingX);
      const yAbs = round2(startY + row * spacingY);

      const deltaX = index === 0 ? xAbs : round2(xAbs - holes[index - 1].xAbs);
      const deltaY = index === 0 ? yAbs : round2(yAbs - holes[index - 1].yAbs);

      holes.push({
        index,
        xAbs,
        yAbs,
        deltaX,
        deltaY,
        depth: round2(-Math.abs(holeDepth)),
      });
      index++;
    }
  }

  return holes;
}

// =============================================
// VITESSES DE COUPE
// =============================================

/** Calcule la vitesse de rotation (tr/min) à partir de Vc et diamètre */
export function calcRPM(vc: number, diameter: number): number {
  if (diameter <= 0) return 0;
  return round2((vc * 1000) / (Math.PI * diameter));
}

/** Calcule la vitesse de coupe (m/min) à partir de RPM et diamètre */
export function calcVc(rpm: number, diameter: number): number {
  return round2((Math.PI * diameter * rpm) / 1000);
}

/** Calcule l'avance (mm/min) */
export function calcFeedRate(fz: number, teeth: number, rpm: number): number {
  return round2(fz * teeth * rpm);
}

// =============================================
// TARAUDAGE & FILETAGE
// =============================================

/** Calcule le diamètre d'avant-trou */
export function calcPilotHole(nominalDiameter: number, pitch: number): number {
  return round2(nominalDiameter - pitch);
}

/** Calcule la profondeur minimale de taraudage */
export function calcMinTapDepth(nominalDiameter: number): number {
  return round2(1.5 * nominalDiameter);
}

/** Calcule la profondeur du filet */
export function calcThreadDepth(pitch: number): number {
  return round2(0.6134 * pitch);
}

/** Calcule les passes dégressives pour filetage au tour */
export function calcLathePasses(pitch: number): { pass: number; depth: number; cumul: number }[] {
  const totalDepth = 0.6134 * pitch;
  const passes: { pass: number; depth: number; cumul: number }[] = [];
  let remaining = totalDepth;
  let currentDepth = totalDepth / 3; // Première passe = ~1/3 de la profondeur totale
  let cumul = 0;
  let passNum = 1;

  while (remaining > 0.001) {
    // Limiter la passe à ce qui reste
    const depth = Math.min(round2(Math.max(currentDepth, 0.03)), round2(remaining));
    cumul = round2(cumul + depth);
    remaining = round2(remaining - depth);

    passes.push({
      pass: passNum,
      depth: round2(depth),
      cumul,
    });

    passNum++;
    currentDepth = currentDepth / 1.2;
    if (currentDepth < 0.03) currentDepth = 0.03;
  }

  return passes;
}

// =============================================
// OUTILS & CONVERSIONS
// =============================================

/** Convertit mm en pouces */
export function mmToInch(mm: number): number {
  return round2(mm / 25.4);
}

/** Convertit pouces en mm */
export function inchToMm(inches: number): number {
  return round2(inches * 25.4);
}

/** Convertit degrés en radians */
export function degToRad(degrees: number): number {
  return round2((degrees * Math.PI) / 180 * 10000) / 10000; // 4 décimales pour radians
}

/** Calcule le demi-angle et la conicité d'un cône */
export function calcCone(bigD: number, smallD: number, length: number): { halfAngle: number; taper: number } {
  if (length <= 0) return { halfAngle: 0, taper: 0 };
  const halfAngle = round2((Math.atan((bigD - smallD) / (2 * length)) * 180) / Math.PI);
  const taper = round2(((bigD - smallD) / length) * 1000); // mm/m
  return { halfAngle, taper };
}

/** Calcule le triangle rectangle (2 côtés donnés → 3ème + angle) */
export function calcTriangle(
  a?: number, // adjacent
  b?: number, // opposé
  c?: number  // hypoténuse
): { a: number; b: number; c: number; angle: number } | null {
  if (a !== undefined && b !== undefined && a > 0 && b > 0) {
    const cCalc = Math.sqrt(a * a + b * b);
    return { a: round2(a), b: round2(b), c: round2(cCalc), angle: round2((Math.atan(b / a) * 180) / Math.PI) };
  }
  if (a !== undefined && c !== undefined && a > 0 && c > a) {
    const bCalc = Math.sqrt(c * c - a * a);
    return { a: round2(a), b: round2(bCalc), c: round2(c), angle: round2((Math.atan(bCalc / a) * 180) / Math.PI) };
  }
  if (b !== undefined && c !== undefined && b > 0 && c > b) {
    const aCalc = Math.sqrt(c * c - b * b);
    return { a: round2(aCalc), b: round2(b), c: round2(c), angle: round2((Math.atan(b / aCalc) * 180) / Math.PI) };
  }
  return null;
}

/** Calcule le volume en mm³ selon la forme */
export function calcVolume(
  shape: WeightShape,
  dims: { diameter?: number; innerDiameter?: number; length?: number; width?: number; thickness?: number }
): number {
  switch (shape) {
    case 'cylinder': {
      const r = (dims.diameter || 0) / 2;
      return Math.PI * r * r * (dims.length || 0);
    }
    case 'tube': {
      const rExt = (dims.diameter || 0) / 2;
      const rInt = (dims.innerDiameter || 0) / 2;
      return Math.PI * (rExt * rExt - rInt * rInt) * (dims.length || 0);
    }
    case 'plate': {
      return (dims.length || 0) * (dims.width || 0) * (dims.thickness || 0);
    }
  }
}

/** Calcule le poids en kg à partir du volume (mm³) et de la densité (g/cm³) */
export function calcWeight(volumeMm3: number, density: number): number {
  return round2(volumeMm3 / 1_000_000 * density);
}

/** Calcule les plateaux compatibles pour un diviseur (rapport 40:1) */
export function calcDivisionHead(divisions: number): {
  fullTurns: number;
  fraction: number;
  compatiblePlates: DivisionResult[];
} {
  if (divisions <= 0) return { fullTurns: 0, fraction: 0, compatiblePlates: [] };

  const turnsPerDivision = 40 / divisions;
  const fullTurns = Math.floor(turnsPerDivision);
  const fraction = turnsPerDivision - fullTurns;

  const compatiblePlates: DivisionResult[] = [];

  if (Math.abs(fraction) < 0.0001) {
    // Nombre entier de tours, tous les plateaux sont compatibles
    return { fullTurns, fraction: 0, compatiblePlates: [] };
  }

  for (const plateHoles of PLATEAUX_DIVISEUR) {
    const holesCount = fraction * plateHoles;
    // Vérifier si le résultat est un entier (tolérance 0.001)
    if (Math.abs(holesCount - Math.round(holesCount)) < 0.001) {
      compatiblePlates.push({
        plateHoles,
        holesCount: Math.round(holesCount),
        fullTurns,
      });
    }
  }

  return { fullTurns, fraction: round2(fraction), compatiblePlates };
}
