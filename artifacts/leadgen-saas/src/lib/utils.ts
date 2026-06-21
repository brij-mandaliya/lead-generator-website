import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
};

export function getCurrencySymbol(currency: string | null | undefined): string {
  return CURRENCY_SYMBOLS[currency ?? "INR"] ?? currency ?? "₹";
}

export function formatPrice(
  amount: number,
  currency: string | null | undefined,
  options: { fractionDigits?: number } = {},
): string {
  const symbol = getCurrencySymbol(currency);
  const digits = options.fractionDigits ?? 0;
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}
