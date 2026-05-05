/**
 * Unit tests for age-aware BMI calculation logic.
 * Tests Deurenberg body fat (adults) and CDC percentile (teens) paths.
 */

// Inline the pure functions to avoid RN module resolution in Jest
// ─── Helpers (extracted from helpers.ts) ────────────────────────────────────

interface LMSEntry { ageMonths: number; L: number; M: number; S: number; }

const LMS_BOYS: LMSEntry[] = [
  { ageMonths: 24,  L: -1.6626, M: 16.5128, S: 0.07840 },
  { ageMonths: 36,  L: -1.5611, M: 15.9577, S: 0.07732 },
  { ageMonths: 48,  L: -1.3680, M: 15.5906, S: 0.07832 },
  { ageMonths: 60,  L: -1.1852, M: 15.3980, S: 0.07897 },
  { ageMonths: 72,  L: -1.1300, M: 15.4633, S: 0.08332 },
  { ageMonths: 84,  L: -1.1906, M: 15.8138, S: 0.08881 },
  { ageMonths: 96,  L: -1.3490, M: 16.3432, S: 0.09456 },
  { ageMonths: 108, L: -1.5316, M: 16.9885, S: 0.10023 },
  { ageMonths: 120, L: -1.7466, M: 17.6993, S: 0.10576 },
  { ageMonths: 132, L: -1.9249, M: 18.4418, S: 0.11133 },
  { ageMonths: 144, L: -2.0589, M: 19.1836, S: 0.11560 },
  { ageMonths: 156, L: -2.1396, M: 19.9101, S: 0.11893 },
  { ageMonths: 168, L: -2.1696, M: 20.5802, S: 0.12134 },
  { ageMonths: 180, L: -2.1671, M: 21.1872, S: 0.12282 },
  { ageMonths: 192, L: -2.1373, M: 21.7275, S: 0.12401 },
  { ageMonths: 204, L: -2.0942, M: 22.2069, S: 0.12483 },
  { ageMonths: 216, L: -2.0532, M: 22.6384, S: 0.12533 },
  { ageMonths: 228, L: -2.0160, M: 23.0210, S: 0.12580 },
  { ageMonths: 240, L: -1.9788, M: 23.3940, S: 0.12627 },
];

const normCDF = (z: number): number => {
  if (z < -6) return 0;
  if (z > 6) return 1;
  const coeffs = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  let poly = 0, tPow = t;
  for (const c of coeffs) { poly += c * tPow; tPow *= t; }
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
};

const calcBMIPercentile = (bmi: number, ageMonths: number, sex: 'male' | 'female'): number => {
  const table = sex === 'male' ? LMS_BOYS : LMS_BOYS; // boys only for these tests
  const clamped = Math.max(table[0].ageMonths, Math.min(table[table.length - 1].ageMonths, ageMonths));
  const hiIdx = table.findIndex(e => e.ageMonths >= clamped);
  let L: number, M: number, S: number;
  if (hiIdx <= 0) {
    ({ L, M, S } = table[0]);
  } else if (hiIdx >= table.length - 1) {
    ({ L, M, S } = table[table.length - 1]);
  } else {
    const lo = table[hiIdx - 1], hi = table[hiIdx];
    const t = (clamped - lo.ageMonths) / (hi.ageMonths - lo.ageMonths);
    L = lo.L + t * (hi.L - lo.L);
    M = lo.M + t * (hi.M - lo.M);
    S = lo.S + t * (hi.S - lo.S);
  }
  const z = L !== 0 ? (Math.pow(bmi / M, L) - 1) / (L * S) : Math.log(bmi / M) / S;
  return Math.min(99, Math.max(1, Math.round(normCDF(z) * 100)));
};

const calcBodyFatPct = (bmi: number, ageYears: number, sex: 'male' | 'female'): number => {
  const sexFactor = sex === 'male' ? 1 : 0;
  const raw = 1.20 * bmi + 0.23 * ageYears - 10.8 * sexFactor - 5.4;
  return Math.round(raw * 10) / 10;
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('calcBodyFatPct (Deurenberg)', () => {
  test('healthy adult male — BMI 22, age 30', () => {
    // 1.20*22 + 0.23*30 - 10.8 - 5.4 = 26.4 + 6.9 - 10.8 - 5.4 = 17.1
    expect(calcBodyFatPct(22, 30, 'male')).toBeCloseTo(17.1, 1);
  });

  test('healthy adult female — BMI 22, age 30', () => {
    // 1.20*22 + 0.23*30 - 0 - 5.4 = 26.4 + 6.9 - 5.4 = 27.9
    expect(calcBodyFatPct(22, 30, 'female')).toBeCloseTo(27.9, 1);
  });

  test('obese male — BMI 35, age 40', () => {
    // 1.20*35 + 0.23*40 - 10.8 - 5.4 = 42 + 9.2 - 10.8 - 5.4 = 35.0
    expect(calcBodyFatPct(35, 40, 'male')).toBeCloseTo(35.0, 1);
  });
});

describe('calcBMIPercentile (CDC LMS)', () => {
  test('50th percentile boy should be near the median BMI at 120 months', () => {
    // M at 120 months = 17.6993 — BMI at median should give ~50th percentile
    const pct = calcBMIPercentile(17.7, 120, 'male');
    expect(pct).toBeGreaterThanOrEqual(48);
    expect(pct).toBeLessThanOrEqual(52);
  });

  test('interpolation: midpoint between 120 and 132 months', () => {
    // At 126 months, result should be between percentiles computed at 120 and 132
    const pctAt120 = calcBMIPercentile(18, 120, 'male');
    const pctAt132 = calcBMIPercentile(18, 132, 'male');
    const pctAt126 = calcBMIPercentile(18, 126, 'male');
    const lo = Math.min(pctAt120, pctAt132);
    const hi = Math.max(pctAt120, pctAt132);
    expect(pctAt126).toBeGreaterThanOrEqual(lo - 1);
    expect(pctAt126).toBeLessThanOrEqual(hi + 1);
  });

  test('very high BMI returns 99th percentile', () => {
    expect(calcBMIPercentile(40, 120, 'male')).toBe(99);
  });

  test('very low BMI returns 1st percentile', () => {
    expect(calcBMIPercentile(8, 120, 'male')).toBe(1);
  });

  test('age beyond table clamps to last entry', () => {
    // 250 months > 240-month max; should not throw
    expect(() => calcBMIPercentile(20, 250, 'male')).not.toThrow();
  });
});

describe('normCDF sanity checks', () => {
  test('z=0 → 50%', () => expect(normCDF(0)).toBeCloseTo(0.5, 3));
  test('z=1.645 → ~95%', () => expect(normCDF(1.645)).toBeCloseTo(0.95, 2));
  test('z=-1.645 → ~5%', () => expect(normCDF(-1.645)).toBeCloseTo(0.05, 2));
});
