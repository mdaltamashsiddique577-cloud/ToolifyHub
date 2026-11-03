// Base64 Encoder/Decoder UI, with URL-safe option. Logic in lib/tools/dev.ts.
"use client";

import { useState } from "react";
import { base64Encode, base64Decode, MAX_DEV_BYTES } from "../../../lib/tools/dev.ts";
import { CopyButton, ErrorNote, Field, inputClass, buttonClass } from "../ui.tsx";

export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(nextMode = mode, nextInput = input, nextUrlSafe = urlSafe) {
    if (new Blob([nextInput]).size > MAX_DEV_BYTES) {
      setError("This input is larger than 5 MB.");
      setOutput("");
      return;
    }
    if (nextMode === "encode") {
      setOutput(base64Encode(nextInput, nextUrlSafe));
      setError(null);
    } else {
      const result = base64Decode(nextInput);
      if (result.ok) {
        setOutput(result.text);
        setError(null);
      } else {
        setOutput("");
        setError(result.message);
      }
    }
  }

  return (
    <div className="space-y-6">
      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="mb-2 text-sm font-medium">Action</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="b64-mode" checked={mode === "encode"} onChange={() => { setMode("encode"); run("encode"); }} /> Encode text
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="b64-mode" checked={mode === "decode"} onChange={() => { setMode("decode"); run("decode"); }} /> Decode Base64
        </label>
        {mode === "encode" ? (
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={urlSafe} onChange={(e) => { setUrlSafe(e.target.checked); run("encode", input, e.target.checked); }} /> URL-safe
          </label>
        ) : null}
      </fieldset>

      <Field id="b64-input" label={mode === "encode" ? "Text to encode" : "Base64 to decode"}>
        <textarea
          id="b64-input"
          rows={6}
          value={input}
          onChange={(e) => { setInput(e.target.value); run(mode, e.target.value, urlSafe); }}
          spellCheck={false}
          className={inputClass + " font-mono text-sm"}
        />
      </Field>

      <ErrorNote message={error} />

      <div className="space-y-2">
        <label htmlFor="b64-output" className="block text-sm font-medium">Result</label>
        <textarea id="b64-output" readOnly rows={6} value={output} className="w-full rounded-[var(--radius-control)] border border-line bg-secondary p-4 font-mono text-sm break-all" />
        <div className="flex gap-2">
          <CopyButton text={output} />
          <button type="button" className={buttonClass} onClick={() => { setInput(""); setOutput(""); setError(null); }}>Clear</button>
        </div>
      </div>
      <p className="text-sm text-muted">Base64 is an encoding, not encryption. Anyone can decode it.</p>
    </div>
  );
}
