// GST Calculator UI: add or remove GST, with the CGST and SGST split. Maths in lib/tools/calc.ts.
"use client";

import { useState } from "react";
import { gst } from "../../../lib/tools/calc.ts";
import { Field, Stat, ErrorNote, inputClass, buttonClass } from "../ui.tsx";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const RATES = [0, 5, 12, 18, 28];

export function GstCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  let result: ReturnType<typeof gst> | null = null;
  let error: string | null = null;
  if (amount !== "") {
    try {
      result = gst(Number(amount), rate, mode);
    } catch (e) {
      error = e instanceof Error ? e.message : "Check the numbers.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="gst-amount" label="Amount (₹)">
          <input id="gst-amount" type="number" inputMode="decimal" min={0} className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field id="gst-rate" label="GST rate (%)" hint="Check the official GST portal for current rates.">
          <select id="gst-rate" className={inputClass} value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            {RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
          </select>
        </Field>
      </div>

      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="mb-2 text-sm font-medium">What is the amount?</legend>
        <label className="flex items-center gap-2"><input type="radio" name="gst-mode" checked={mode === "add"} onChange={() => setMode("add")} /> Amount before GST</label>
        <label className="flex items-center gap-2"><input type="radio" name="gst-mode" checked={mode === "remove"} onChange={() => setMode("remove")} /> Amount including GST</label>
      </fieldset>

      <ErrorNote message={error} />

      {result ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Before GST" value={inr(result.base)} />
          <Stat label="GST" value={inr(result.tax)} />
          <Stat label="After GST" value={inr(result.total)} />
          <Stat label="CGST" value={inr(result.cgst)} />
          <Stat label="SGST" value={inr(result.sgst)} />
        </dl>
      ) : null}

      <p className="text-sm text-muted">CGST and SGST are equal halves, used for sales within one state.</p>
      <button type="button" className={buttonClass} onClick={() => setAmount("")}>Clear</button>
    </div>
  );
}
