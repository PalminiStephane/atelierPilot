import { describe, it, expect } from 'vitest';
import {
  calcBoltCircle,
  calcRectGrid,
  calcRPM,
  calcVc,
  calcFeedRate,
  calcCone,
  calcTriangle,
  calcVolume,
  calcWeight,
  calcDivisionHead,
  calcPilotHole,
  calcThreadDepth,
  calcLathePasses,
  mmToInch,
  inchToMm,
} from './calculations';

// === CERCLE DE PERÇAGE ===
describe('calcBoltCircle', () => {
  it('calcule 4 trous correctement', () => {
    const holes = calcBoltCircle({
      outerDiameter: 100,
      pcd: 50,
      holeCount: 4,
      holeDiameter: 5,
      holeDepth: 10,
      startAngle: 0,
      direction: 'cw',
    });
    expect(holes).toHaveLength(4);
    // Premier trou à 0° → X=25, Y=0
    expect(holes[0].xAbs).toBe(25);
    expect(holes[0].yAbs).toBe(0);
    // Deuxième trou à 90° → X≈0, Y=25
    expect(holes[1].xAbs).toBeCloseTo(0, 1);
    expect(holes[1].yAbs).toBe(25);
    // Profondeur toujours négative
    expect(holes[0].depth).toBe(-10);
  });

  it('calcule 6 trous', () => {
    const holes = calcBoltCircle({
      outerDiameter: 80,
      pcd: 40,
      holeCount: 6,
      holeDiameter: 4,
      holeDepth: 8,
      startAngle: 0,
      direction: 'cw',
    });
    expect(holes).toHaveLength(6);
    // Angle entre chaque trou = 60°
    expect(holes[1].angle).toBe(60);
    expect(holes[2].angle).toBe(120);
  });

  it('calcule 8 trous', () => {
    const holes = calcBoltCircle({
      outerDiameter: 120,
      pcd: 80,
      holeCount: 8,
      holeDiameter: 6,
      holeDepth: 12,
      startAngle: 0,
      direction: 'cw',
    });
    expect(holes).toHaveLength(8);
    expect(holes[0].angle).toBe(0);
    expect(holes[1].angle).toBe(45);
  });

  it('calcule les ΔX/ΔY correctement', () => {
    const holes = calcBoltCircle({
      outerDiameter: 100,
      pcd: 50,
      holeCount: 4,
      holeDiameter: 5,
      holeDepth: 10,
      startAngle: 0,
      direction: 'cw',
    });
    // Premier trou : ΔX = xAbs (départ du centre)
    expect(holes[0].deltaX).toBe(holes[0].xAbs);
    expect(holes[0].deltaY).toBe(holes[0].yAbs);
    // Deuxième trou : ΔX = X1 - X0
    expect(holes[1].deltaX).toBeCloseTo(holes[1].xAbs - holes[0].xAbs, 1);
  });
});

// === GRILLE RECTANGULAIRE ===
describe('calcRectGrid', () => {
  it('calcule une grille 2x3 en serpentin', () => {
    const holes = calcRectGrid({
      rows: 2,
      cols: 3,
      spacingX: 10,
      spacingY: 15,
      startX: 0,
      startY: 0,
      holeDiameter: 5,
      holeDepth: 8,
    });
    expect(holes).toHaveLength(6);
    // Rangée 1 : gauche → droite (0, 10, 20)
    expect(holes[0].xAbs).toBe(0);
    expect(holes[1].xAbs).toBe(10);
    expect(holes[2].xAbs).toBe(20);
    // Rangée 2 : droite → gauche (serpentin) (20, 10, 0)
    expect(holes[3].xAbs).toBe(20);
    expect(holes[4].xAbs).toBe(10);
    expect(holes[5].xAbs).toBe(0);
    // Y de la rangée 2
    expect(holes[3].yAbs).toBe(15);
  });
});

// === VITESSES DE COUPE ===
describe('calcRPM', () => {
  it('N = (Vc × 1000) / (π × D)', () => {
    const rpm = calcRPM(30, 10);
    expect(rpm).toBeCloseTo((30 * 1000) / (Math.PI * 10), 1);
  });

  it('retourne 0 si diamètre = 0', () => {
    expect(calcRPM(30, 0)).toBe(0);
  });
});

describe('calcVc', () => {
  it('Vc = (π × D × N) / 1000', () => {
    const vc = calcVc(955, 10);
    expect(vc).toBeCloseTo((Math.PI * 10 * 955) / 1000, 1);
  });
});

describe('calcFeedRate', () => {
  it('Vf = fz × Z × N', () => {
    expect(calcFeedRate(0.1, 4, 1000)).toBe(400);
  });
});

// === CÔNES ===
describe('calcCone', () => {
  it('calcule demi-angle et conicité', () => {
    const result = calcCone(30, 20, 100);
    expect(result.halfAngle).toBeCloseTo(Math.atan(10 / 200) * 180 / Math.PI, 1);
    expect(result.taper).toBeCloseTo(100, 0); // (30-20)/100 * 1000 = 100 mm/m
  });

  it('retourne 0 si longueur = 0', () => {
    expect(calcCone(30, 20, 0)).toEqual({ halfAngle: 0, taper: 0 });
  });
});

// === TRIANGLE RECTANGLE ===
describe('calcTriangle', () => {
  it('a + b → c (3-4-5)', () => {
    const r = calcTriangle(3, 4, undefined);
    expect(r).not.toBeNull();
    expect(r!.c).toBe(5);
  });

  it('a + c → b', () => {
    const r = calcTriangle(3, undefined, 5);
    expect(r).not.toBeNull();
    expect(r!.b).toBe(4);
  });

  it('b + c → a', () => {
    const r = calcTriangle(undefined, 4, 5);
    expect(r).not.toBeNull();
    expect(r!.a).toBe(3);
  });

  it('retourne null si pas assez de données', () => {
    expect(calcTriangle(3, undefined, undefined)).toBeNull();
  });
});

// === POIDS ===
describe('calcVolume & calcWeight', () => {
  it('cylindre plein', () => {
    const vol = calcVolume('cylinder', { diameter: 20, length: 100 });
    expect(vol).toBeCloseTo(Math.PI * 100 * 100, 0); // π × 10² × 100
  });

  it('tube creux', () => {
    const vol = calcVolume('tube', { diameter: 20, innerDiameter: 16, length: 100 });
    const expected = Math.PI * (100 - 64) * 100;
    expect(vol).toBeCloseTo(expected, 0);
  });

  it('plaque', () => {
    const vol = calcVolume('plate', { length: 100, width: 50, thickness: 10 });
    expect(vol).toBe(50000);
  });

  it('poids en kg', () => {
    // 1 cm³ d'acier = 7.85g
    const weight = calcWeight(1_000_000, 7.85); // 1 000 000 mm³ = 1 dm³
    expect(weight).toBe(7.85);
  });
});

// === PLATEAU DIVISEUR ===
describe('calcDivisionHead', () => {
  it('40/6 → 6 tours + 2/3', () => {
    const r = calcDivisionHead(6);
    expect(r.fullTurns).toBe(6);
    expect(r.fraction).toBeCloseTo(0.67, 1);
    expect(r.compatiblePlates.length).toBeGreaterThan(0);
  });

  it('40/8 → 5 tours exactement', () => {
    const r = calcDivisionHead(8);
    expect(r.fullTurns).toBe(5);
    expect(r.fraction).toBe(0);
  });

  it('40/12 → 3 tours + 1/3', () => {
    const r = calcDivisionHead(12);
    expect(r.fullTurns).toBe(3);
    expect(r.fraction).toBeCloseTo(0.33, 1);
  });
});

// === TARAUDAGE ===
describe('taraudage', () => {
  it('avant-trou M6 pas 1.0 = 5.0', () => {
    expect(calcPilotHole(6, 1.0)).toBe(5);
  });

  it('profondeur filet', () => {
    expect(calcThreadDepth(1.0)).toBeCloseTo(0.61, 1);
  });

  it('passes dégressives convergent vers la profondeur totale', () => {
    const passes = calcLathePasses(1.0);
    const totalDepth = 0.6134;
    const lastCumul = passes[passes.length - 1].cumul;
    expect(lastCumul).toBeCloseTo(totalDepth, 1);
  });
});

// === CONVERSIONS ===
describe('conversions', () => {
  it('mm → inch', () => {
    expect(mmToInch(25.4)).toBe(1);
  });

  it('inch → mm', () => {
    expect(inchToMm(1)).toBe(25.4);
  });
});
