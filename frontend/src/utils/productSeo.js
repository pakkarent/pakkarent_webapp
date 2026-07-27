import { getPricingType } from './productPricing';

/** Append city context when the description does not already mention the city. */
export function citySpecificDescription(product) {
  const base = stripFreeTransportClaims((product?.description || '').trim());
  const cityLabel = product?.city === 'all' ? 'India' : product?.city;
  if (!cityLabel) return base;
  if (base.toLowerCase().includes(cityLabel.toLowerCase())) return base;
  const suffix = ` Available for rent in ${cityLabel} with doorstep delivery from PakkaRent.`;
  return base ? `${base}${suffix}` : `Rent ${product?.name || 'this item'} in ${cityLabel} with PakkaRent.${suffix}`;
}

function stripFreeTransportClaims(text) {
  if (!text) return '';
  return text
    .replace(/\s*Free transportation[^.]*\./gi, '')
    .replace(/\s*Includes free transport[^.]*\./gi, '')
    .replace(/\s*\d+\s*km free delivery[^.]*\./gi, '')
    .replace(/\s*Hassle[-\s]?free transportation and delivery\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function citySpecificMetaDescription(product) {
  const cityLabel = product?.city === 'all' ? 'India' : product?.city;
  const price = product?.monthly_price;
  const unit = getPricingType(product) === 'per_month' ? 'month' : getPricingType(product) === 'per_event' ? 'event' : 'day';
  const snippet = citySpecificDescription(product).slice(0, 100);
  return `Rent ${product?.name} in ${cityLabel} from ₹${price}/${unit}. ${snippet} Flexible rental on PakkaRent.`;
}
