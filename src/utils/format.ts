export function formatTime(timestamp: number, format: '12h' | '24h' = '12h'): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h',
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatWeekday(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString([], { weekday: 'long' });
}

export function formatTemperature(value: number, unit: 'celsius' | 'fahrenheit'): string {
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}
