// Age Calculator UI: birth date and reference date (defaults to today). Maths in lib/tools/calc.ts.
"use client";

import { useEffect, useState } from "react";
import { ageBetween } from "../../../lib/tools/calc.ts";
import { Field, Stat, ErrorNote, inputClass, todayIso, buttonClass } from "../ui.tsx";

export function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [on, setOn] = useState("");

  useEffect(() => { setOn(todayIso()); }, []);

  let result: ReturnType<typeof ageBetween> | null = null;
  let error: string | null = null;
  if (birth && on) {
    try {
      result = ageBetween(birth, on);
    } catch (e) {
      error = e instanceof Error ? e.message : "Check the dates.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="age-birth" label="Date of birth">
          <input id="age-birth" type="date" className={inputClass} value={birth} onChange={(e) => setBirth(e.target.value)} />
        </Field>
        <Field id="age-on" label="Age on this date">
          <input id="age-on" type="date" className={inputClass} value={on} onChange={(e) => setOn(e.target.value)} />
        </Field>
      </div>

      <ErrorNote message={error} />

      {result ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Years" value={result.years} />
          <Stat label="Months" value={result.months} />
          <Stat label="Days" value={result.days} />
          <Stat label="Total days" value={result.totalDays.toLocaleString("en-IN")} />
        </dl>
      ) : null}

      <button type="button" className={buttonClass} onClick={() => { setBirth(""); setOn(todayIso()); }}>Clear</button>
    </div>
  );
}
