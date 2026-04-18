/**
 * Server sends base prices plus optional offer_* fields when a % discount applies.
 */

export function originalPriceForTenure(product, tenure) {
  if (tenure === 3) return product.price_3month ?? product.monthly_price * 3;
  if (tenure === 6) return product.price_6month ?? product.monthly_price * 6;
  if (tenure === 12) return product.price_12month ?? product.monthly_price * 12;
  return product.monthly_price * tenure;
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

/** Price used at checkout for this tenure (offer if active, else list). */
export function effectivePriceForTenure(product, tenure) {
  const offer = offerPriceForTenure(product, tenure);
  if (offer != null) return offer;
  return originalPriceForTenure(product, tenure);
}

export function hasOffer(product) {
  return (Number(product.offer_discount_percent) || 0) > 0;
}
