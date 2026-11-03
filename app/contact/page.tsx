import type { Metadata } from "next";
import { LegalPage, ToFill } from "../../components/legal/LegalPage.tsx";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "How to reach the ToolifyHub team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact us">
      <p>We read every message. We do not run a contact form, so we never ask you for personal details on this site.</p>
      <h2>Write to us</h2>
      <p>Email: <ToFill>public contact email, added before launch</ToFill></p>
      <p>Please include the tool name and what you were doing. Do not send files or personal information in your message.</p>
    </LegalPage>
  );
}
