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
async function loadActivePricingRules(pool) {
  const res = await pool.query(
    `SELECT scope, category_id, discount_percent FROM pricing_offers WHERE is_active = true`
  );
  let globalPercent = 0;
  const byCategory = {};
  for (const r of res.rows) {
    if (r.scope === 'all') {
      globalPercent = Number(r.discount_percent) || 0;
    } else if (r.scope === 'category' && r.category_id != null) {
      byCategory[r.category_id] = Number(r.discount_percent) || 0;
    }
  }
  return { globalPercent, byCategory };
}

function discountForProduct(categoryId, rules) {
  if (rules.byCategory[categoryId] != null && rules.byCategory[categoryId] > 0) {
    return rules.byCategory[categoryId];
  }
  return rules.globalPercent || 0;
}

function enrichProduct(row, rules) {
  const pct = discountForProduct(row.category_id, rules);
  return applyDiscountToProduct(row, pct);
}

module.exports = {
  roundMoney,
  applyDiscountToProduct,
  loadActivePricingRules,
  discountForProduct,
  enrichProduct,
};
