// Terms and conditions (/terms). Plain text inside LegalPage. Fill in the ToFill placeholders.
import type { Metadata } from "next";
import { LegalPage } from "../../components/legal/LegalPage.tsx";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The rules for using ToolifyHub.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and conditions" updated="3 November 2026">
      <p>By using ToolifyHub you agree to these terms. They are a plain draft and should be reviewed by a qualified lawyer before launch.</p>
      <h2>Using the tools</h2>
      <ul>
        <li>The tools are free and provided as they are.</li>
        <li>Do not use the site to process content you have no right to use.</li>
        <li>Do not try to overload, attack or scrape the site.</li>
        <li>Check important results, such as loan or tax figures, before you rely on them.</li>
      </ul>
      <h2>Your files and your responsibility</h2>
      <p>You are responsible for the files and text you process. Keep your own copies of anything important.</p>
      <h2>Changes</h2>
      <p>We may change or remove tools. We may update these terms, and the date above will change when we do.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, and the courts of Bihar have jurisdiction.</p>
    </LegalPage>
  );
}
