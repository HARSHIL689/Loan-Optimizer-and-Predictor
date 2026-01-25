export function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return "-";
    return num.toFixed(decimals);
  }
  