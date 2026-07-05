import { getPricingType } from './productPricing';

/** Append city context when the description does not already mention the city. */
export function citySpecificDescription(product) {
  const base = (product?.description || '').trim();
  const cityLabel = product?.city === 'all' ? 'India' : product?.city;
  if (!cityLabel) return base;
  if (base.toLowerCase().includes(cityLabel.toLowerCase())) return base;
  const suffix = ` Available for rent in ${cityLabel} with doorstep delivery from PakkaRent.`;
  return base ? `${base}${suffix}` : `Rent ${product?.name || 'this item'} in ${cityLabel} with PakkaRent.${suffix}`;
}

export function citySpecificMetaDescription(product) {
  const cityLabel = product?.city === 'all' ? 'India' : product?.city;
  const price = product?.monthly_price;
  const unit = getPricingType(product) === 'per_month' ? 'month' : getPricingType(product) === 'per_event' ? 'event' : 'day';
  const snippet = citySpecificDescription(product).slice(0, 100);
  return `Rent ${product?.name} in ${cityLabel} from ₹${price}/${unit}. ${snippet} Free delivery & flexible rental on PakkaRent.`;
}
