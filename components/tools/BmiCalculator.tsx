"use client";

import { useState } from "react";
import { bmi } from "../../lib/tools/calc.ts";
import { Field, Stat, ErrorNote, inputClass, buttonClass } from "./ui.tsx";

export function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  let result: ReturnType<typeof bmi> | null = null;
  let error: string | null = null;
  if (height !== "" && weight !== "") {
    try {
      result = bmi(Number(weight), Number(height));
    } catch (e) {
      error = e instanceof Error ? e.message : "Check the numbers.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="bmi-height" label="Height (cm)" hint="50 to 250">
          <input id="bmi-height" type="number" inputMode="decimal" min={50} max={250} className={inputClass} value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
        <Field id="bmi-weight" label="Weight (kg)" hint="10 to 500">
          <input id="bmi-weight" type="number" inputMode="decimal" min={10} max={500} className={inputClass} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
      </div>

      <ErrorNote message={error} />

      {result ? (
        <dl className="grid grid-cols-2 gap-3">
          <Stat label="BMI" value={result.bmi} />
          <Stat label="Category" value={result.category} />
        </dl>
      ) : null}

      <p className="text-sm text-muted">
        A screening number for adults, not a diagnosis. Ask a doctor for advice about your health.
      </p>
      <button type="button" className={buttonClass} onClick={() => { setHeight(""); setWeight(""); }}>Clear</button>
    </div>
  );
}
