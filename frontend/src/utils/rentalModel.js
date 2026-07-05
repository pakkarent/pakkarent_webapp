export { isMonthlyRentalProduct } from './productPricing';

export const MIXED_CART_MSG =
  'Cannot mix appliance monthly rentals with day-based rentals in one order.';

/** YYYY-MM-DD in local calendar */
export function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Next calendar day after `ymd` (YYYY-MM-DD), local */
export function addDaysYMD(ymd, deltaDays) {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d + deltaDays);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/**
 * Inclusive day count for rental from start to end (YYYY-MM-DD).
 * Returns 0 if missing, invalid, or end before start.
 */
export function rentalDaysInclusive(fromStr, toStr) {
  if (!fromStr || !toStr) return 0;
  const from = new Date(fromStr + 'T12:00:00');
  const to = new Date(toStr + 'T12:00:00');
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  const dayMs = 86400000;
  const days = Math.floor((to - from) / dayMs) + 1;
  return days > 0 ? days : 0;
}

/** True when cart should use monthly tenure UI (all lines are per_month). */
export function cartUsesMonthlyPricing(cart) {
  return Array.isArray(cart) && cart.length > 0 && cart.every(isMonthlyRentalProduct);
}
