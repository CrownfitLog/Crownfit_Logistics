// utils/pricing.js
export function calculatePrice({ miles }) {
  const base = parseFloat(process.env.BASE_FEE_USD || '10.00');
  const perMile = parseFloat(process.env.PER_MILE_USD || '1.50');
  const total = base + perMile * miles;
  // round to cents
  return Math.round(total * 100) / 100;
}
