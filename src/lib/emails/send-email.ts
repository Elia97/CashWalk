import { ServerClient } from 'postmark';

const pmClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

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
  return pmClient.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  });
}
