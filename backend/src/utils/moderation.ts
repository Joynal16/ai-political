const blockedTerms = [
  'terrorist propaganda',
  'racial slur',
  'violent threat',
  'kill all',
  'hate speech'
];

export function moderateText(values: string[]) {
  const haystack = values.join(' ').toLowerCase();
  const reasons = blockedTerms.filter((term) => haystack.includes(term));
  return { flagged: reasons.length > 0, reasons };
}
