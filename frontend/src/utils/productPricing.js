import { safeJsonObject } from './media';

export const PRICING_TYPES = [
  { value: 'per_month', label: 'Monthly (appliances)' },
  { value: 'per_day', label: 'Per day (camping / gear)' },
  { value: 'per_event', label: 'Per event (functions / props)' },
];

export function getPricingType(product) {
  const specs = safeJsonObject(product?.specs);
  return specs.pricing_type || 'per_month';
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

/** Home Appliances category — monthly rentals only */
export const MONTHLY_CATEGORY_ID = 2;

export function isMonthlyCategory(categoryId) {
  return Number(categoryId) === MONTHLY_CATEGORY_ID;
}

export function isEventCategory(categoryId) {
  return !isMonthlyCategory(categoryId);
}
