// path: src/lib/emails/admin-email-change-request.ts

import { sendEmail } from "./send-email";

interface AdminEmailChangeRequestData {
  user: { name: string; email: string };
  requestedBy: { name: string };
  newEmail: string;
  confirmationToken: string;
  expiresAt: Date;
}

/** All interpolated values below are user-controlled — always escape before templating into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendAdminEmailChangeRequestEmail({
  user,
  requestedBy,
  newEmail,
  confirmationToken,
  expiresAt,
}: AdminEmailChangeRequestData): Promise<void> {
  const safeName = escapeHtml(user.name);
  const safeNewEmail = escapeHtml(newEmail);
  const safeRequesterName = escapeHtml(requestedBy.name || "A workspace owner");
  const confirmUrl = `${process.env.BETTER_AUTH_URL}/account/confirm-email-change?token=${encodeURIComponent(
    confirmationToken,
  )}`;

  await sendEmail({
    to: user.email,
    subject: "Confirm a request to change your account email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Email Change</h2>
        <p>Hello ${safeName},</p>
        <p>${safeRequesterName} has requested to change the email address on your account to <strong>${safeNewEmail}</strong>.</p>
        <p>If you did not expect this, you can safely ignore this email — no change will be made without your confirmation, and your current email stays active either way.</p>
        <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Confirm Email Change</a>
        <p>This link expires on ${expiresAt.toUTCString()} and can only be used while signed in to your account.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `Hello ${user.name},\n\n${requestedBy.name || "A workspace owner"} has requested to change the email address on your account to ${newEmail}.\n\nIf you did not expect this, you can safely ignore this email — no change will be made without your confirmation.\n\nConfirm here (while signed in): ${confirmUrl}\n\nThis link expires on ${expiresAt.toUTCString()}.\n\nBest regards,\nYour App Team`,
  });
}
