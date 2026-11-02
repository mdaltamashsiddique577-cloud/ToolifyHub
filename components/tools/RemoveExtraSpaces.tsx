"use client";

import { useState } from "react";
import { removeExtraSpaces, type SpaceOptions, DEFAULT_SPACE_OPTIONS, MAX_TEXT_CHARS } from "../../lib/tools/text.ts";
import { CopyButton, ErrorNote, buttonClass } from "./ui.tsx";

const OPTIONS: { key: keyof SpaceOptions; label: string }[] = [
  { key: "collapseSpaces", label: "Collapse repeated spaces" },
  { key: "trimLines", label: "Trim spaces at line start and end" },
  { key: "removeBlankLines", label: "Remove blank lines" },
];

export function RemoveExtraSpaces() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<SpaceOptions>(DEFAULT_SPACE_OPTIONS);
  const [error, setError] = useState<string | null>(null);

  const output = text.length > MAX_TEXT_CHARS ? "" : removeExtraSpaces(text, options);

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Clean up</legend>
        {OPTIONS.map((o) => (
          <label key={o.key} className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={options[o.key]}
              onChange={(e) => setOptions({ ...options, [o.key]: e.target.checked })}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            {o.label}
          </label>
        ))}
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="space-input" className="block text-sm font-medium">Your text</label>
        <textarea
          id="space-input"
          rows={6}
          value={text}
          onChange={(e) => {
            setError(e.target.value.length > MAX_TEXT_CHARS ? "This text is longer than 500,000 characters." : null);
            setText(e.target.value);
          }}
          className="w-full rounded-[var(--radius-control)] border border-line bg-white p-4 text-base"
        />
      </div>

      <ErrorNote message={error} />

      <div className="space-y-1.5">
        <label htmlFor="space-output" className="block text-sm font-medium">Result</label>
        <textarea
          id="space-output"
          rows={6}
          readOnly
          value={output}
          className="w-full rounded-[var(--radius-control)] border border-line bg-secondary p-4 text-base"
        />
        <div className="flex gap-2">
          <CopyButton text={output} />
          <button type="button" onClick={() => { setText(""); setError(null); }} className={buttonClass}>Clear</button>
        </div>
      </div>
    </div>
  );
}
