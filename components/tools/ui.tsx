// Small shared pieces for every tool form: Field (label plus input), input and button class names,
// ErrorNote (accessible error message), Stat (number tile), CopyButton and todayIso.
// Shared pieces for tool pages. Kept small and dependency-free.
import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function Field({ id, label, children, hint }: { id: string; label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-[var(--radius-control)] border border-line bg-white px-3.5 py-2.5 text-base";

export const buttonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-primary disabled:opacity-50";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg hover:brightness-110 disabled:opacity-50";

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-[var(--radius-control)] bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-secondary p-4">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  }
  return (
    <button type="button" onClick={copy} disabled={!text} className={buttonClass}>
      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
