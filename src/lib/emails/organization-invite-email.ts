import { sendEmail } from "./send-email";
import { escapeHtml } from "./utils";

export async function sendOrganizationInviteEmail({
  invitation,
  inviter,
  organization,
  email,
}: {
  invitation: { id: string };
  inviter: { name: string };
  organization: { name: string };
  email: string;
}) {
  const safeInviterName = escapeHtml(inviter.name);
  const safeOrgName = escapeHtml(organization.name);

  await sendEmail({
    to: email,
    subject: `You're invited to join the ${organization.name} organization`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're invited to join ${safeOrgName}</h2>
        <p>Hi there,</p>
        <p>${safeInviterName} invited you to join the ${safeOrgName} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `You're invited to join the ${organization.name} organization\n\nHi there,\n\n${inviter.name} invited you to join the ${organization.name} organization. Please click the link below to accept/reject the invitation:\n\n${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}\n\nBest regards,\nYour App Team`,
  });
}
