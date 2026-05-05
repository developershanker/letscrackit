/**
 * CDC 2000 Growth Charts — LMS parameters for BMI-for-age (ages 2–20).
 *
 * Each entry covers one age in whole years (stored as months for precision).
 * L = Box-Cox power  |  M = median BMI  |  S = coefficient of variation
 *
 * The z-score formula:  z = [(BMI/M)^L − 1] / (L × S)
 * Then map z → percentile via the standard normal CDF.
 *
 * ⚠️  These values are sampled at yearly intervals and are approximate.
 * For production, replace with the full half-monthly table from:
 * https://www.cdc.gov/growthcharts/data/zscore/bmiagerev.xls
 */

export interface LMSEntry {
  ageMonths: number;
  L: number;
  M: number;
  S: number;
}

export const LMS_BOYS: LMSEntry[] = [
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

export const LMS_GIRLS: LMSEntry[] = [
  { ageMonths: 24,  L: -1.7591, M: 16.3988, S: 0.07860 },
  { ageMonths: 36,  L: -1.6724, M: 15.7960, S: 0.07724 },
  { ageMonths: 48,  L: -1.5506, M: 15.4097, S: 0.07728 },
  { ageMonths: 60,  L: -1.4809, M: 15.2098, S: 0.07770 },
  { ageMonths: 72,  L: -1.5122, M: 15.2783, S: 0.08133 },
  { ageMonths: 84,  L: -1.6497, M: 15.5691, S: 0.08744 },
  { ageMonths: 96,  L: -1.7829, M: 16.0063, S: 0.09460 },
  { ageMonths: 108, L: -1.8498, M: 16.6153, S: 0.10246 },
  { ageMonths: 120, L: -1.8439, M: 17.3925, S: 0.11096 },
  { ageMonths: 132, L: -1.8108, M: 18.2538, S: 0.11930 },
  { ageMonths: 144, L: -1.7640, M: 19.1337, S: 0.12724 },
  { ageMonths: 156, L: -1.6788, M: 19.9924, S: 0.13414 },
  { ageMonths: 168, L: -1.5975, M: 20.7884, S: 0.13981 },
  { ageMonths: 180, L: -1.5190, M: 21.4821, S: 0.14418 },
  { ageMonths: 192, L: -1.4478, M: 22.0633, S: 0.14744 },
  { ageMonths: 204, L: -1.3884, M: 22.5523, S: 0.14963 },
  { ageMonths: 216, L: -1.3402, M: 22.9800, S: 0.15090 },
  { ageMonths: 228, L: -1.3043, M: 23.3549, S: 0.15140 },
  { ageMonths: 240, L: -1.2684, M: 23.7300, S: 0.15190 },
];
