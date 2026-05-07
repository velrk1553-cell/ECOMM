export function formatPrice(value: number): string {
  return "₹" + value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
