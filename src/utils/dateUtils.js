/**
 * Central date utilities — all API params and date inputs must use YYYY-MM-DD.
 * Always use these helpers instead of inline new Date() manipulations.
 */

/** Convert any Date object or date string to "YYYY-MM-DD". */
export const formatDate = (date) =>
  new Date(date).toISOString().split("T")[0];

/** Today's date as "YYYY-MM-DD". */
export const todayStr = () => new Date().toISOString().split("T")[0];

/** First day of the current month as "YYYY-MM-DD". */
export const firstOfMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

/** Current year-month as "YYYY-MM" (for month-only pickers). */
export const currentYearMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
