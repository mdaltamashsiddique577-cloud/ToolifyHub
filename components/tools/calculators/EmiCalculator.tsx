// EMI Calculator UI: loan amount, rate and tenure, with the full monthly schedule. Maths in lib/tools/calc.ts.
"use client";

import { useState } from "react";
import { emi, emiSchedule } from "../../../lib/tools/calc.ts";
import { Field, Stat, ErrorNote, inputClass, buttonClass } from "../ui.tsx";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function EmiCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  let result: ReturnType<typeof emi> | null = null;
  let schedule: ReturnType<typeof emiSchedule> = [];
  let error: string | null = null;
  if (amount !== "" && rate !== "" && months !== "") {
    try {
      result = emi(Number(amount), Number(rate), Number(months));
      schedule = showSchedule ? emiSchedule(Number(amount), Number(rate), Number(months)) : [];
    } catch (e) {
      error = e instanceof Error ? e.message : "Check the numbers.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="emi-amount" label="Loan amount (₹)">
          <input id="emi-amount" type="number" inputMode="decimal" min={1} className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field id="emi-rate" label="Interest rate (% a year)" hint="0 to 50">
          <input id="emi-rate" type="number" inputMode="decimal" min={0} max={50} step="0.01" className={inputClass} value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field id="emi-months" label="Tenure (months)" hint="1 to 480">
          <input id="emi-months" type="number" inputMode="numeric" min={1} max={480} className={inputClass} value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
      </div>

      <ErrorNote message={error} />

      {result ? (
        <>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Monthly EMI" value={inr(result.emi)} />
            <Stat label="Total interest" value={inr(result.totalInterest)} />
            <Stat label="Total payment" value={inr(result.totalPayment)} />
          </dl>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showSchedule} onChange={(e) => setShowSchedule(e.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />
            Show month-by-month schedule
          </label>
          {showSchedule && schedule.length > 0 ? (
            <div className="max-h-96 overflow-auto rounded-[var(--radius-card)] border border-line">
              <table className="w-full min-w-[520px] text-sm tabular-nums">
                <caption className="sr-only">EMI schedule by month</caption>
                <thead className="sticky top-0 bg-secondary text-left">
                  <tr>
                    <th scope="col" className="px-3 py-2">Month</th>
                    <th scope="col" className="px-3 py-2 text-right">Payment</th>
                    <th scope="col" className="px-3 py-2 text-right">Principal</th>
                    <th scope="col" className="px-3 py-2 text-right">Interest</th>
                    <th scope="col" className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((r) => (
                    <tr key={r.month} className="border-t border-line">
                      <td className="px-3 py-2">{r.month}</td>
                      <td className="px-3 py-2 text-right">{inr(r.payment)}</td>
                      <td className="px-3 py-2 text-right">{inr(r.principal)}</td>
                      <td className="px-3 py-2 text-right">{inr(r.interest)}</td>
                      <td className="px-3 py-2 text-right">{inr(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      ) : null}

      <p className="text-sm text-muted">Assumes a reducing balance. Your bank's figure can differ slightly because of rounding and fees.</p>
      <button type="button" className={buttonClass} onClick={() => { setAmount(""); setRate(""); setMonths(""); }}>Clear</button>
    </div>
  );
}
