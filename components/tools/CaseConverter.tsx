"use client";

import { useState } from "react";
import { convertCase, type CaseMode, MAX_TEXT_CHARS } from "../../lib/tools/text.ts";
import { CopyButton, ErrorNote, buttonClass } from "./ui.tsx";

const MODES: { mode: CaseMode; label: string }[] = [
  { mode: "upper", label: "UPPER CASE" },
  { mode: "lower", label: "lower case" },
  { mode: "title", label: "Title Case" },
  { mode: "sentence", label: "Sentence case" },
  { mode: "camel", label: "camelCase" },
  { mode: "snake", label: "snake_case" },
  { mode: "kebab", label: "kebab-case" },
];

export function CaseConverter() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function apply(mode: CaseMode) {
    if (text.length > MAX_TEXT_CHARS) {
      setError("This text is longer than 500,000 characters.");
      return;
    }
    setError(null);
    setOutput(convertCase(text, mode));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="case-text" className="block text-sm font-medium">Your text</label>
        <textarea
          id="case-text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-[var(--radius-control)] border border-line bg-white p-4 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a case">
        {MODES.map((m) => (
          <button key={m.mode} type="button" onClick={() => apply(m.mode)} disabled={!text} className={buttonClass}>
            {m.label}
          </button>
        ))}
      </div>

      <ErrorNote message={error} />

      <div className="space-y-1.5">
        <label htmlFor="case-output" className="block text-sm font-medium">Result</label>
        <textarea
          id="case-output"
          rows={6}
          readOnly
          value={output}
          className="w-full rounded-[var(--radius-control)] border border-line bg-secondary p-4 text-base"
        />
        <div className="flex gap-2">
          <CopyButton text={output} />
          <button type="button" onClick={() => { setText(""); setOutput(""); setError(null); }} className={buttonClass}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
