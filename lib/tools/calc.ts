// Calculator tools: pure functions with input checks. Money is rounded to 2 decimals.

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
}

function daysInMonth(year: number, month1: number): number {
  return new Date(Date.UTC(year, month1, 0)).getUTCDate();
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function ageBetween(birth: string, on: string): AgeResult {
  if (!isIsoDate(birth) || !isIsoDate(on)) throw new Error("Enter both dates.");
  if (birth > on) throw new Error("Birth date cannot be after the chosen date.");

  const [by, bm, bd] = birth.split("-").map(Number);
  const [oy, om, od] = on.split("-").map(Number);

  // Count whole months first, then days from the last "monthiversary" to the chosen date.
  let totalMonths = (oy - by) * 12 + (om - bm);
  if (od < bd) totalMonths -= 1;

  const anchorYear = by + Math.floor((bm - 1 + totalMonths) / 12);
  const anchorMonth = ((bm - 1 + totalMonths) % 12) + 1;
  const anchorDay = Math.min(bd, daysInMonth(anchorYear, anchorMonth));

  const msPerDay = 864e5;
  const days = Math.round(
    (Date.UTC(oy, om - 1, od) - Date.UTC(anchorYear, anchorMonth - 1, anchorDay)) / msPerDay,
  );
  const totalDays = Math.round((Date.UTC(oy, om - 1, od) - Date.UTC(by, bm - 1, bd)) / msPerDay);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days,
    totalDays,
  };
}

export type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
}

export function bmi(weightKg: number, heightCm: number): BmiResult {
  if (!(heightCm >= 50 && heightCm <= 250)) throw new Error("Height must be between 50 and 250 cm.");
  if (!(weightKg >= 10 && weightKg <= 500)) throw new Error("Weight must be between 10 and 500 kg.");
  const m = heightCm / 100;
  const value = Math.round((weightKg / (m * m)) * 10) / 10;
  let category: BmiCategory;
  if (value < 18.5) category = "Underweight";
  else if (value < 25) category = "Normal";
  else if (value < 30) category = "Overweight";
  else category = "Obese";
  return { bmi: value, category };
}

export interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export function emi(principal: number, annualRatePct: number, months: number): EmiResult {
  if (!(principal > 0)) throw new Error("Loan amount must be more than 0.");
  if (!(annualRatePct >= 0 && annualRatePct <= 50)) throw new Error("Interest rate must be between 0 and 50 percent.");
  if (!Number.isInteger(months) || months < 1 || months > 480) {
    throw new Error("Tenure must be a whole number of months from 1 to 480.");
  }

  let value: number;
  if (annualRatePct === 0) {
    value = principal / months;
  } else {
    const r = annualRatePct / 12 / 100;
    const growth = Math.pow(1 + r, months);
    value = (principal * r * growth) / (growth - 1);
  }
  const totalPayment = value * months;
  return {
    emi: round2(value),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalPayment - principal),
  };
}

export interface ScheduleRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

// Month-by-month table. The last payment absorbs rounding so the balance ends at 0.
export function emiSchedule(principal: number, annualRatePct: number, months: number): ScheduleRow[] {
  const { emi: monthly } = emi(principal, annualRatePct, months);
  const r = annualRatePct / 12 / 100;
  const rows: ScheduleRow[] = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    const interest = round2(balance * r);
    let payment = m === months ? round2(balance + interest) : monthly;
    let principalPart = round2(payment - interest);
    balance = round2(balance - principalPart);
    rows.push({ month: m, payment, interest, principal: principalPart, balance: Math.max(0, balance) });
  }
  return rows;
}

export type PercentMode = "of" | "isWhat" | "change" | "add" | "subtract";

export function percentage(mode: PercentMode, x: number, y: number): number {
  if (![x, y].every(Number.isFinite)) throw new Error("Enter numbers in both boxes.");
  switch (mode) {
    case "of":
      return round2((x / 100) * y);
    case "isWhat":
      if (y === 0) throw new Error("The second number cannot be 0.");
      return round2((x / y) * 100);
    case "change":
      if (x === 0) throw new Error("The starting value cannot be 0.");
      return round2(((y - x) / x) * 100);
    case "add":
      return round2(x + (x * y) / 100);
    case "subtract":
      return round2(x - (x * y) / 100);
  }
}

export interface GstResult {
  base: number;
  tax: number;
  total: number;
  cgst: number;
  sgst: number;
}

// GST split equally into CGST and SGST for intra-state supply.
export function gst(amount: number, ratePct: number, mode: "add" | "remove"): GstResult {
  if (!(amount >= 0)) throw new Error("Amount must be 0 or more.");
  if (!(ratePct >= 0 && ratePct <= 100)) throw new Error("GST rate must be between 0 and 100 percent.");
  let base: number;
  let total: number;
  if (mode === "add") {
    base = amount;
    total = amount + (amount * ratePct) / 100;
  } else {
    total = amount;
    base = amount / (1 + ratePct / 100);
  }
  const tax = total - base;
  return {
    base: round2(base),
    tax: round2(tax),
    total: round2(total),
    cgst: round2(tax / 2),
    sgst: round2(tax / 2),
  };
}
