/**
 * Escapes HTML special characters in user-controlled strings before they're
 * interpolated into email templates, preventing HTML/markup injection into
 * transactional emails (e.g. via a user's display name).
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
