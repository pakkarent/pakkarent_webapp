/**
 * Server sends base prices plus optional offer_* fields when a % discount applies.
 * Prices are unit rates — not multiplied by tenure months or rental days.
 */

export function originalPriceForTenure(product, tenure) {
  if (tenure === 3 && product.price_3month != null) return Number(product.price_3month);
  if (tenure === 6 && product.price_6month != null) return Number(product.price_6month);
  if (tenure === 12 && product.price_12month != null) return Number(product.price_12month);
  return Number(product.monthly_price);
}

export function offerPriceForTenure(product, tenure) {
  const d = Number(product.offer_discount_percent) || 0;
  if (d <= 0) return null;
  if (tenure === 3 && product.offer_price_3month != null) return product.offer_price_3month;
  if (tenure === 6 && product.offer_price_6month != null) return product.offer_price_6month;
  if (tenure === 12 && product.offer_price_12month != null) return product.offer_price_12month;
  if (tenure === 1 && product.offer_monthly_price != null) return product.offer_monthly_price;
  return null;
}

/** Unit rental rate for monthly products (offer if active, else list tier rate). */
export function effectivePriceForTenure(product, tenure) {
  const offer = offerPriceForTenure(product, tenure);
  if (offer != null) return offer;
  return originalPriceForTenure(product, tenure);
}

/** Unit rate for day/event rentals (monthly_price column stores per-day or per-event rate). */
export function unitDayPrice(product) {
  return Number(product.monthly_price) || 0;
}

/** Unit rate for event/day rentals with offer applied when available. */
export function effectiveEventPrice(product) {
  if (hasOffer(product) && product.offer_monthly_price != null) {
    return Number(product.offer_monthly_price);
  }
  return unitDayPrice(product);
}

export function hasOffer(product) {
  return (Number(product.offer_discount_percent) || 0) > 0;
}
