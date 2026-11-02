"use client";

import { useState } from "react";
import { formatJson, type JsonIndent, MAX_DEV_BYTES } from "../../lib/tools/dev.ts";
import { CopyButton, ErrorNote, Field, inputClass, primaryButtonClass, buttonClass } from "./ui.tsx";

function parseIndent(value: string): JsonIndent {
  if (value === "tab" || value === "minify") return value;
  return value === "4" ? 4 : 2;
}

function parseIndent(value: string): JsonIndent {
  if (value === "tab" || value === "minify") return value;
  return value === "4" ? 4 : 2;
}

export function JsonFormatter() {
  const [text, setText] = useState("");
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run() {
    if (new Blob([text]).size > MAX_DEV_BYTES) {
      setError("This JSON is larger than 5 MB.");
      setOutput("");
      return;
    }
    const result = formatJson(text, indent);
    if (result.ok) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput("");
      setError(result.error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="json-input" className="block text-sm font-medium">Your JSON</label>
        <textarea
          id="json-input"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="w-full rounded-[var(--radius-control)] border border-line bg-white p-4 font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field id="json-indent" label="Format">
          <select id="json-indent" className={inputClass} value={String(indent)} onChange={(e) => setIndent(parseIndent(e.target.value))}>
            <option value="2">Indent 2 spaces</option>
            <option value="4">Indent 4 spaces</option>
            <option value="tab">Tabs</option>
            <option value="minify">Minify (one line)</option>
          </select>
        </Field>
        <button type="button" className={primaryButtonClass} onClick={run} disabled={!text.trim()}>Format</button>
        <button type="button" className={buttonClass} onClick={() => { setText(""); setOutput(""); setError(null); }}>Clear</button>
      </div>

      <ErrorNote message={error} />

      {output ? (
        <div className="space-y-2">
          <label htmlFor="json-output" className="block text-sm font-medium">Result</label>
          <textarea id="json-output" readOnly rows={12} value={output} spellCheck={false} className="w-full rounded-[var(--radius-control)] border border-line bg-secondary p-4 font-mono text-sm" />
          <CopyButton text={output} />
        </div>
      ) : null}
    </div>
  );
}
