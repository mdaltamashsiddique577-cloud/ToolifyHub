// Character Counter UI with SMS (160) and post (280) limits. Logic in lib/tools/text.ts.
"use client";

import { useMemo, useState } from "react";
import { countCharacters, MAX_TEXT_CHARS } from "../../../lib/tools/text.ts";
import { Field, Stat, buttonClass } from "../ui.tsx";

const LIMITS = [
  { label: "No limit", value: 0 },
  { label: "SMS (160)", value: 160 },
  { label: "Post (280)", value: 280 },
];

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(0);

  const total = useMemo(() => countCharacters(text, true), [text]);
  const noSpaces = useMemo(() => countCharacters(text, false), [text]);
  const over = limit > 0 && total > limit;
  const tooLong = text.length > MAX_TEXT_CHARS;

  return (
    <div className="space-y-6">
      <Field id="char-text" label="Your text">
        <textarea
          id="char-text"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-[var(--radius-control)] border border-line bg-white p-4 text-base"
          aria-invalid={tooLong}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Limit</legend>
        <div className="flex flex-wrap gap-2">
          {LIMITS.map((l) => (
            <label key={l.value} className={`${buttonClass} cursor-pointer ${limit === l.value ? "border-primary bg-secondary" : ""}`}>
              <input
                type="radio"
                name="limit"
                value={l.value}
                checked={limit === l.value}
                onChange={() => setLimit(l.value)}
                className="sr-only"
              />
              {l.label}
            </label>
          ))}
        </div>
      </fieldset>

      <dl className="grid grid-cols-2 gap-3">
        <Stat label="Characters" value={total} />
        <Stat label="Without spaces" value={noSpaces} />
      </dl>

      <p className={`text-sm ${over || tooLong ? "text-red-700" : "text-muted"}`} aria-live="polite">
        {tooLong
          ? "This text is longer than 500,000 characters."
          : limit > 0
            ? over
              ? `${total - limit} characters over the limit of ${limit}.`
              : `${limit - total} characters left of ${limit}.`
            : "Emoji count as one character. Platforms may count differently."}
      </p>
    </div>
  );
}
