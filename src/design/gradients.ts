import type { WeatherCondition } from '@/features/weather/types';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface GradientConfig {
  colors: readonly string[];
  /** LinearGradient start point */
  start?: { x: number; y: number };
  /** LinearGradient end point */
  end?: { x: number; y: number };
}

// ─── Sky backgrounds (time-of-day) ────────────────────────────────────────────
// Use these as full-screen backgrounds; condition gradients layer on top as tints.

export const SkyGradients = {
  dawn: {
    colors: ['#1C1C3E', '#8B2FC9', '#E8714A', '#FFC86E'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  sunrise: {
    colors: ['#FF9A5C', '#FFCF77', '#87CEEB'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  morning: {
    colors: ['#60A5FA', '#3B82F6', '#2563EB'],
    start: { x: 0, y: 0 },
    end: { x: 0.2, y: 1 },
  },
  noon: {
    colors: ['#38BDF8', '#0EA5E9', '#0369A1'],
    start: { x: 0, y: 0 },
    end: { x: 0.15, y: 1 },
  },
  afternoon: {
    colors: ['#0EA5E9', '#2563EB', '#1E40AF'],
    start: { x: 0, y: 0 },
    end: { x: 0.2, y: 1 },
  },
  sunset: {
    colors: ['#7C3AED', '#DB2777', '#F97316', '#FCD34D'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  dusk: {
    colors: ['#1E1B4B', '#4C1D95', '#7C3AED', '#C026D3'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  night: {
    colors: ['#020617', '#0F172A', '#1E1B4B'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  midnight: {
    colors: ['#000000', '#030712', '#0C0A1E'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const satisfies Record<string, GradientConfig>;

export type SkyPeriod = keyof typeof SkyGradients;

// ─── Weather condition gradients ──────────────────────────────────────────────
// Day and night variants per condition.

export const ConditionGradients: Record<
  WeatherCondition | 'default',
  { day: GradientConfig; night: GradientConfig }
> = {
  clear: {
    day: {
      colors: ['#38BDF8', '#0EA5E9', '#0369A1'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0C0A1E', '#1E1B4B', '#312E81'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  clouds: {
    day: {
      colors: ['#94A3B8', '#64748B', '#475569'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#1E293B', '#334155', '#475569'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  rain: {
    day: {
      colors: ['#1D4ED8', '#2563EB', '#3B82F6'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0F172A', '#1E3A5F', '#1D4ED8'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  drizzle: {
    day: {
      colors: ['#38BDF8', '#0EA5E9', '#0284C7'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0F172A', '#0C4A6E', '#075985'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  thunderstorm: {
    day: {
      colors: ['#312E81', '#4338CA', '#6366F1'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0C0A1E', '#1E1B4B', '#312E81'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  snow: {
    day: {
      colors: ['#BAE6FD', '#7DD3FC', '#38BDF8'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#1E293B', '#334155', '#475569'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  mist: {
    day: {
      colors: ['#CBD5E1', '#94A3B8', '#64748B'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#1E293B', '#334155', '#475569'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  fog: {
    day: {
      colors: ['#CBD5E1', '#94A3B8', '#64748B'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#1E293B', '#334155', '#475569'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
  },
  default: {
    day: {
      colors: ['#38BDF8', '#0EA5E9', '#0369A1'],
      start: { x: 0, y: 0 },
      end: { x: 0.2, y: 1 },
    },
    night: {
      colors: ['#0C0A1E', '#1E1B4B', '#312E81'],
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

/**
 * Derive the sky period from a UTC hour (0-23).
 * Used to pick an ambient sky background independent of weather condition.
 */
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

/** Convenience: get the recommended sky gradient for the current local time. */
export function getCurrentSkyGradient(): GradientConfig {
  const hour = new Date().getHours();
  return SkyGradients[getSkyPeriod(hour)];
}
