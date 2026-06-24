import { Resend } from "resend";

const resendClient = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  return await resendClient.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: to,
    subject: subject,
    html: html,
    // TextBody: text,
  });
}
