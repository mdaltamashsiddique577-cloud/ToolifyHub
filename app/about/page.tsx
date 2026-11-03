import type { Metadata } from "next";
import { LegalPage } from "../../components/legal/LegalPage.tsx";

export const metadata: Metadata = {
  title: "About Us",
  description: "What ToolifyHub is, how the tools work and why there is no login.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPage title="About us">
      <p>ToolifyHub is a free collection of everyday online tools: text counters, calculators, a JSON formatter and more.</p>
      <h2>Why there is no login</h2>
      <p>You should not have to create an account to count words or convert a currency. Our tools do not ask for your name, email or phone number.</p>
      <h2>Where your data goes</h2>
      <p>Most tools run entirely in your browser. Text you type and files you open are not uploaded to us. The AI summarizer is the only tool that sends your text to a server, and it is labelled as such.</p>
      <h2>Who runs this site</h2>
      <p>ToolifyHub is operated by <strong>[owner or company name to add before launch]</strong>.</p>
    </LegalPage>
  );
}
