import type { WeatherCondition } from '@/features/weather/types';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface GradientConfig {
  colors: readonly string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

// ─── Sky backgrounds (time-of-day) ────────────────────────────────────────────

export const SkyGradients = {
  dawn: {
    colors: ['#0D0920', '#3D1060', '#8B2CA5', '#D9584A', '#F5A245'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  sunrise: {
    colors: ['#1A1040', '#6B2060', '#E06020', '#F5A030', '#FFD060'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  morning: {
    colors: ['#1A5DC8', '#2070E0', '#3B8AFF', '#5BA8FF', '#87CEEB'],
    start: { x: 0, y: 0 },
    end: { x: 0.2, y: 1 },
  },
  noon: {
    colors: ['#0070C0', '#0090D8', '#1AABEF', '#45C0FF', '#87D8FF'],
    start: { x: 0, y: 0 },
    end: { x: 0.15, y: 1 },
  },
  afternoon: {
    colors: ['#1050B0', '#1868CC', '#2A7FE0', '#4AA8FF', '#70C8FF'],
    start: { x: 0, y: 0 },
    end: { x: 0.2, y: 1 },
  },
  sunset: {
    colors: ['#180A30', '#5A1A88', '#C02868', '#F06820', '#FFC030'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  dusk: {
    colors: ['#100C20', '#1E1840', '#4C1D95', '#7C3AED', '#A855F7'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  night: {
    colors: ['#020510', '#040C22', '#080E34', '#0E1648', '#181F5C'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  midnight: {
    colors: ['#000000', '#020408', '#050710', '#08091A', '#0A0C20'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const satisfies Record<string, GradientConfig>;

export type SkyPeriod = keyof typeof SkyGradients;

// ─── Weather condition gradients ──────────────────────────────────────────────

export const ConditionGradients: Record<
  WeatherCondition | 'default',
  { day: GradientConfig; night: GradientConfig }
> = {
  clear: {
    day: {
      colors: ['#1355C8', '#1870D8', '#2E8AEA', '#4FA8F8', '#87CEEB'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#010208', '#03061A', '#080E35', '#0C1454', '#111A62'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  clouds: {
    day: {
      colors: ['#3D4C5F', '#4E6070', '#617484', '#778B9E', '#8EA3B5'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0F1520', '#182230', '#212F3E', '#2D3E4F', '#3A4E62'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  rain: {
    day: {
      colors: ['#0D1B2A', '#162C45', '#1D3C60', '#1D4ED8', '#2563EB'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#020912', '#061526', '#0A2040', '#102D5A', '#1D4ED8'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  drizzle: {
    day: {
      colors: ['#0C2240', '#1A3E6A', '#2166AA', '#2D82C5', '#3A9EDF'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#050C18', '#08172C', '#0C2244', '#10305A', '#163E76'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  thunderstorm: {
    day: {
      colors: ['#0A0520', '#1A0B4A', '#2D1B69', '#4338CA', '#5B52D6'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#030108', '#080425', '#12083F', '#1C1068', '#2D1B94'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  snow: {
    day: {
      colors: ['#9AB8D8', '#B0CDE8', '#C8DFFE', '#DCF0FF', '#EEF8FF'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0E1929', '#1A2A3F', '#1E3A5F', '#243B55', '#2C4870'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  mist: {
    day: {
      colors: ['#8A9BAB', '#9DAFC0', '#B0C3D3', '#C4D5E3', '#D8E5EF'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#101820', '#18262E', '#20313D', '#2D3E4C', '#394C5A'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  fog: {
    day: {
      colors: ['#8A9BAB', '#9DAFC0', '#B0C3D3', '#C4D5E3', '#D8E5EF'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#101820', '#18262E', '#20313D', '#2D3E4C', '#394C5A'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  default: {
    day: {
      colors: ['#1355C8', '#1870D8', '#2E8AEA', '#4FA8F8', '#87CEEB'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#010208', '#03061A', '#080E35', '#0C1454', '#111A62'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getConditionGradient(
  condition: WeatherCondition,
  isNight: boolean,
): GradientConfig {
  const entry = ConditionGradients[condition] ?? ConditionGradients.default;
  return isNight ? entry.night : entry.day;
}

export function getSkyPeriod(hour: number): SkyPeriod {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 9) return 'sunrise';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'sunset';
  if (hour >= 19 && hour < 21) return 'dusk';
  if (hour >= 21 || hour < 3) return 'night';
  return 'midnight';
}

export function getCurrentSkyGradient(): GradientConfig {
  const hour = new Date().getHours();
  return SkyGradients[getSkyPeriod(hour)];
}
