// Percentage Calculator UI with five modes (of, is what %, change, add, subtract). Maths in lib/tools/calc.ts.
"use client";

import { useState } from "react";
import { percentage, type PercentMode } from "../../../lib/tools/calc.ts";
import { Field, Stat, ErrorNote, inputClass, buttonClass } from "../ui.tsx";

const MODES: { mode: PercentMode; label: string; a: string; b: string; text: (a: number, b: number) => string }[] = [
  { mode: "of", label: "X% of Y", a: "X (percent)", b: "Y", text: (a, b) => `${a}% of ${b}` },
  { mode: "isWhat", label: "X is what % of Y", a: "X", b: "Y", text: (a, b) => `${a} is what % of ${b}` },
  { mode: "change", label: "% change from X to Y", a: "From (X)", b: "To (Y)", text: (a, b) => `Change from ${a} to ${b}` },
  { mode: "add", label: "Add X% to Y", a: "Percent (X)", b: "Value (Y)", text: (a, b) => `${b} plus ${a}%` },
  { mode: "subtract", label: "Subtract X% from Y", a: "Percent (X)", b: "Value (Y)", text: (a, b) => `${b} minus ${a}%` },
];

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentMode>("of");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const current = MODES.find((m) => m.mode === mode)!;
  let value: number | null = null;
  let error: string | null = null;
  if (x !== "" && y !== "") {
    try {
      value = percentage(mode, Number(x), Number(y));
    } catch (e) {
      error = e instanceof Error ? e.message : "Check the numbers.";
    }
  }

  return (
    <div className="space-y-6">
      <Field id="pct-mode" label="What do you want to work out?">
        <select id="pct-mode" className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as PercentMode)}>
          {MODES.map((m) => <option key={m.mode} value={m.mode}>{m.label}</option>)}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pct-x" label={current.a}>
          <input id="pct-x" type="number" inputMode="decimal" className={inputClass} value={x} onChange={(e) => setX(e.target.value)} />
        </Field>
        <Field id="pct-y" label={current.b}>
          <input id="pct-y" type="number" inputMode="decimal" className={inputClass} value={y} onChange={(e) => setY(e.target.value)} />
        </Field>
      </div>

      <ErrorNote message={error} />

      {value !== null ? (
        <dl className="grid grid-cols-1">
          <Stat
            label={mode === "change" ? "Percentage change" : "Result"}
            value={mode === "change" || mode === "isWhat" ? `${value}%` : value}
          />
        </dl>
      ) : null}

      {value !== null ? <p className="text-sm text-muted">{current.text(Number(x), Number(y))}</p> : null}
      <button type="button" className={buttonClass} onClick={() => { setX(""); setY(""); }}>Clear</button>
    </div>
  );
}
