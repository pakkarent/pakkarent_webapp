const roundMoney = (n) => Math.round(Number(n) * 100) / 100;

/**
 * @param {object} row - product row from DB
 * @param {number} discountPercent - 0-100
 */
function applyDiscountToProduct(row, discountPercent) {
  const d = Math.min(100, Math.max(0, Number(discountPercent) || 0));
  if (d <= 0) {
    return {
      ...row,
      offer_discount_percent: 0,
      offer_monthly_price: null,
      offer_price_3month: null,
      offer_price_6month: null,
      offer_price_12month: null,
    };
  }
  const f = (x) => (x == null || x === '' ? null : roundMoney(Number(x) * (1 - d / 100)));
  return {
    ...row,
    offer_discount_percent: d,
    offer_monthly_price: f(row.monthly_price),
    offer_price_3month: f(row.price_3month),
    offer_price_6month: f(row.price_6month),
    offer_price_12month: f(row.price_12month),
  };
}

/**
 * @param {import('pg').Pool} pool
 * @returns {Promise<{ globalPercent: number, byCategory: Record<number, number> }>}
 */
function parseSpecs(specs) {
  if (!specs) return {};
  if (typeof specs === 'string') {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  }
  return specs;
}

function productPricingSegment(row) {
  const pt = parseSpecs(row.specs).pricing_type;
  return pt === 'per_month' ? 'monthly' : 'event';
}

function emptySegmentRules() {
  return { globalPercent: 0, byCategory: {} };
}

async function loadActivePricingRules(pool) {
  const res = await pool.query(
    `SELECT scope, category_id, discount_percent, pricing_segment
     FROM pricing_offers WHERE is_active = true`
  );
  const rules = {
    monthly: emptySegmentRules(),
    event: emptySegmentRules(),
  };
  for (const r of res.rows) {
    const seg = r.pricing_segment === 'event' ? 'event' : 'monthly';
    if (r.scope === 'all') {
      rules[seg].globalPercent = Number(r.discount_percent) || 0;
    } else if (r.scope === 'category' && r.category_id != null) {
      rules[seg].byCategory[r.category_id] = Number(r.discount_percent) || 0;
    }
  }
  return rules;
}

function discountForProduct(categoryId, rules, row) {
  const seg = productPricingSegment(row);
  const segRules = rules[seg] || rules.monthly;
  if (segRules.byCategory[categoryId] != null && segRules.byCategory[categoryId] > 0) {
    return segRules.byCategory[categoryId];
  }
  return segRules.globalPercent || 0;
}

function enrichProduct(row, rules) {
  const pct = discountForProduct(row.category_id, rules, row);
  return applyDiscountToProduct(row, pct);
}

module.exports = {
  roundMoney,
  applyDiscountToProduct,
  loadActivePricingRules,
  discountForProduct,
  enrichProduct,
};
