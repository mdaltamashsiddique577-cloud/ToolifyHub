// Word Counter UI: text box and live counts. Counting logic is in lib/tools/text.ts.
"use client";

import { useMemo, useState } from "react";
import { Eraser } from "lucide-react";
import {
  countWords, countCharacters, countSentences, countParagraphs, readingTimeSeconds, MAX_TEXT_CHARS,
} from "../../../lib/tools/text.ts";

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = countWords(text);
    return {
      words,
      characters: countCharacters(text, true),
      charactersNoSpaces: countCharacters(text, false),
      sentences: countSentences(text),
      paragraphs: countParagraphs(text),
      readingSeconds: readingTimeSeconds(words),
    };
  }, [text]);

  const tooLong = text.length > MAX_TEXT_CHARS;
  const readingLabel = stats.readingSeconds < 60
    ? `${stats.readingSeconds} sec`
    : `${Math.ceil(stats.readingSeconds / 60)} min`;

  const items: { label: string; value: string | number }[] = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: readingLabel },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="word-counter-text" className="block text-sm font-medium">
          Your text
        </label>
        <textarea
          id="word-counter-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste or type your text here"
          aria-describedby="word-counter-help"
          aria-invalid={tooLong}
          className="mt-2 w-full rounded-[var(--radius-control)] border border-line bg-white p-4 text-base leading-relaxed"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p id="word-counter-help" className={tooLong ? "text-red-700" : "text-muted"}>
            {tooLong
              ? "This text is longer than 500,000 characters. Shorten it to count."
              : "Text stays in your browser. Nothing is sent to a server."}
          </p>
          <button
            type="button"
            onClick={() => setText("")}
            disabled={text === ""}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-medium hover:border-primary disabled:opacity-50"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[var(--radius-card)] bg-secondary p-4">
            <dt className="text-xs font-medium text-muted">{item.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
