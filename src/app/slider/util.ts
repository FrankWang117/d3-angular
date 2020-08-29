export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

export function getDecimals(value: number): number {
  const valueString = value.toString();
  const integerLength = valueString.indexOf('.') + 1;
  return integerLength >= 0 ? valueString.length - integerLength : 0;
}

export function valueMustBeValid(value: number): boolean {
  return !isNaN(typeof value !== 'number' ? parseFloat(value) : value);
}
