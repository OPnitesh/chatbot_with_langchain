// Temperature gradient: Deep Blue (<=0°C) -> Light Purple (15°C) -> Bright Red (>=35°C)
export function getTemperatureColor(temp: number): string {
  if (temp <= 0) return "rgb(0, 0, 139)"; // Deep Blue
  if (temp >= 35) return "rgb(255, 0, 0)"; // Bright Red
  
  if (temp <= 15) {
    // 0 to 15: Deep Blue to Light Purple
    const ratio = temp / 15;
    const r = Math.round(0 + ratio * 147);
    const g = Math.round(0 + ratio * 112);
    const b = Math.round(139 + ratio * 80);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // 15 to 35: Light Purple to Bright Red
    const ratio = (temp - 15) / 20;
    const r = Math.round(147 + ratio * 108);
    const g = Math.round(112 - ratio * 112);
    const b = Math.round(219 - ratio * 219);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// Decimal grayscale: .00 = white, .50 = mid-grey, .99 = black
export function getDecimalColor(decimal: number): string {
  const safe = Math.max(0, Math.min(0.99, decimal));
  const intensity = Math.round(255 * (1 - safe));
  return `rgb(${intensity}, ${intensity}, ${intensity})`;
}

function interpolateColor(from: [number, number, number], to: [number, number, number], ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const r = Math.round(from[0] + (to[0] - from[0]) * clamped);
  const g = Math.round(from[1] + (to[1] - from[1]) * clamped);
  const b = Math.round(from[2] + (to[2] - from[2]) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
}

// Urgency spectrum: calm (pale yellow) -> moderate (magenta) -> high panic (bright violet)
export function getUrgencyColor(urgency: number): string {
  const u = Math.max(0, Math.min(10, urgency));
  const calm: [number, number, number] = [255, 255, 224]; // Pale yellow
  const moderate: [number, number, number] = [255, 0, 255]; // Magenta
  const high: [number, number, number] = [138, 43, 226]; // Bright violet

  if (u <= 5) {
    return interpolateColor(calm, moderate, u / 5);
  }
  return interpolateColor(moderate, high, (u - 5) / 5);
}

// Calculate contrast ratio for WCAG compliance
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) return 0;
    const [r, g, b] = match.map(Number);
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Get highest-contrast text color for readability
export function getAccessibleTextColor(bgColor: string): string {
  const whiteContrast = getContrastRatio(bgColor, "rgb(255, 255, 255)");
  const blackContrast = getContrastRatio(bgColor, "rgb(0, 0, 0)");
  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

// Parse city and temperature from user input
export function parseCityTemperature(text: string): { city: string; temp: number } | null {
  const patterns = [
    /(?:in\s+)?([a-zA-Z\s]+?)\s+(?:is\s+)?(-?\d+(?:\.\d+)?)\s*°?[cC]?/i,
    /(-?\d+(?:\.\d+)?)\s*°?[cC]?\s+in\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+?):\s*(-?\d+(?:\.\d+)?)\s*°?[cC]?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const city = (match[1] || match[2]).trim();
      const temp = parseFloat(match[2] || match[1]);
      if (city && !isNaN(temp) && city.length > 1) {
        return { city, temp };
      }
    }
  }
  return null;
}

// Parse standalone decimal number and keep ONLY first two decimal digits.
export function parseDecimal(text: string): number | null {
  const trimmed = text.trim();
  const match = trimmed.match(/^-?\d*\.(\d{2,})$/);
  if (!match) return null;

  const firstTwoDigits = match[1].slice(0, 2);
  const normalized = Number(firstTwoDigits) / 100;
  return Math.min(normalized, 0.99);
}
