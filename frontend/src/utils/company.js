/** PakkaRent founded December 2014 */
const SERVICE_START = new Date(2014, 11, 1);

/**
 * Full years of service completed (increments each December).
 * e.g. May 2026 → 11, December 2026 → 12
 */
export function getYearsOfTrustedService(asOf = new Date()) {
  let years = asOf.getFullYear() - SERVICE_START.getFullYear();
  const monthDiff = asOf.getMonth() - SERVICE_START.getMonth();
  const dayDiff = asOf.getDate() - SERVICE_START.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years -= 1;
  return Math.max(1, years);
}

export function trustedServiceLabel(asOf = new Date()) {
  const years = getYearsOfTrustedService(asOf);
  return `${years} ${years === 1 ? 'Year' : 'Years'} of Trusted Service`;
}
