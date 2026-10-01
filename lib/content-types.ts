/** Formats come from saved content, so every view uses the same records. */
export const defaultContentTypes = ['Short-form', 'Long-form'];
export function normalizeFormat(value: string): string {
  const cleaned = value.trim().replace(/\s+/g, ' ');
  return defaultContentTypes.find(type => type.toLowerCase() === cleaned.toLowerCase()) || cleaned;
}
export function formatKey(value: string): string {
  return normalizeFormat(value).toLowerCase();
}
export function validFormat(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 60 && !/[\x00-\x1f\x7f]/.test(value);
}
export function getContentTypes(records: {kind: string; format?: unknown}[]): string[] {
  const types = [...defaultContentTypes];
  const seen = new Set(types.map(formatKey));
  for (const record of records) {
    if (record.kind !== 'content' || !validFormat(record.format)) continue;
    const format = normalizeFormat(record.format);
    if (!seen.has(formatKey(format))) { seen.add(formatKey(format)); types.push(format); }
  }
  return [...defaultContentTypes, ...types.slice(2).sort((a, b) => a.localeCompare(b))];
}
export function matchesContentType(format: string, selected: string | null): boolean {
  return selected === null || formatKey(format) === formatKey(selected);
}
