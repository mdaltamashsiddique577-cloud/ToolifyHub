// Privacy policy (/privacy-policy). Plain text inside LegalPage. Fill in the ToFill placeholders
// (owner, contact, AI provider, log retention, jurisdiction, launch date) before going live.
import type { Metadata } from "next";
import { LegalPage, ToFill } from "../../components/legal/LegalPage.tsx";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What ToolifyHub stores, what it does not, and how files are handled.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy" updated={<ToFill>date of launch</ToFill>}>
      <p>This policy explains what happens to information when you use ToolifyHub. It is a plain summary and should be reviewed by a qualified lawyer before launch.</p>

      <h2>No accounts and no personal details</h2>
      <p>You do not need to sign up or log in. We do not collect your name, email address or phone number.</p>

      <h2>Files stay on your device</h2>
      <p>Images and PDFs are processed in your browser. We do not receive or store them.</p>

      <h2>Text and the AI summarizer</h2>
      <p>The AI summarizer sends the text you submit to our server, which passes it to an AI provider to create the summary. We do not store that text, and we log only its length, the mode and how long the request took. The provider&apos;s own policy applies to what it does with the text: <ToFill>provider name and link, added before launch</ToFill>.</p>

      <h2>Recently used tools</h2>
      <p>Your browser&apos;s local storage keeps the names of up to six tools you used most recently, so the homepage can show them. Nothing else is saved. You can clear this at any time from the tools page.</p>

      <h2>Server logs</h2>
      <p>Our hosting provider keeps standard access logs, such as IP address, time and page requested, for security and to keep the service running. We do not use them to identify you. Retention period: <ToFill>from hosting provider, added before launch</ToFill>.</p>

      <h2>Advertising</h2>
      <p>We do not show advertising yet. If we add it, this section will be updated before the change, including how Google&apos;s advertising cookies work and how to opt out.</p>

      <h2>Your rights</h2>
      <p>Because we hold no account data, there is usually nothing to access, correct or delete. If you believe we hold something about you, contact us using the details on the contact page.</p>
    </LegalPage>
  );
}
