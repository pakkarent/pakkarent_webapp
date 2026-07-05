import { safeJsonObject } from './media';

export const PRICING_TYPES = [
  { value: 'per_month', label: 'Monthly (appliances)' },
  { value: 'per_day', label: 'Per day (camping / gear)' },
  { value: 'per_event', label: 'Per event (functions / props)' },
];

/** Home Appliances category — monthly rentals only */
export const MONTHLY_CATEGORY_ID = 2;
const CAMPING_CATEGORY_ID = 1;

export function getPricingType(product) {
  const specs = safeJsonObject(product?.specs);
  const stored = specs.pricing_type;
  if (stored === 'per_day_or_week') return 'per_day';
  if (stored) return stored;
  if (isMonthlyCategory(product?.category_id)) return 'per_month';
  if (Number(product?.category_id) === CAMPING_CATEGORY_ID) return 'per_day';
  return 'per_event';
}

export function isMonthlyRentalProduct(product) {
  if (isMonthlyCategory(product?.category_id)) return true;
  return getPricingType(product) === 'per_month';
}

export function isMonthlyPricingType(pricingType) {
  return pricingType === 'per_month';
}

export function isEventPricingType(pricingType) {
  return pricingType === 'per_event' || pricingType === 'per_day';
}

export function pricingTypeLabel(pricingType) {
  if (pricingType === 'per_event') return 'Per event';
  if (pricingType === 'per_day') return 'Per day';
  return 'Monthly';
}

export function basePriceLabel(pricingType) {
  if (pricingType === 'per_event') return 'Event price';
  if (pricingType === 'per_day') return 'Per-day price';
  return 'Monthly price';
}

export function priceUnitSuffix(product) {
  const pricingType = getPricingType(product);
  if (pricingType === 'per_month') return '/mo';
  if (pricingType === 'per_event') return '/event';
  return '/day';
}

export function priceUnitLabel(product) {
  const pricingType = getPricingType(product);
  if (pricingType === 'per_month') return 'per month';
  if (pricingType === 'per_event') return 'per event';
  return 'per day';
}

export function pricePeriodHeading(product) {
  const pricingType = getPricingType(product);
  if (pricingType === 'per_month') return 'Monthly rent';
  if (pricingType === 'per_event') return 'Event rent';
  return 'Daily rent';
}

export function rateLabel(product, tenureMonths = 1) {
  const pricingType = getPricingType(product);
  if (pricingType === 'per_month') return `Rate (${tenureMonths} mo plan):`;
  if (pricingType === 'per_event') return 'Rate (per event):';
  return 'Rate (per day):';
}

export function schemaPriceUnit(product) {
  const pricingType = getPricingType(product);
  if (pricingType === 'per_month') return 'MONTH';
  if (pricingType === 'per_event') return 'EVENT';
  return 'DAY';
}

export function isMonthlyCategory(categoryId) {
  return Number(categoryId) === MONTHLY_CATEGORY_ID;
}

export function isEventCategory(categoryId) {
  return !isMonthlyCategory(categoryId);
}
