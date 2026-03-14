import { ApplicationStatus } from "@prisma/client";

const statusLabel: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  kyc_aml: "KYC/AML review",
  legal_review: "Legal review",
  approved: "Approved",
  rejected: "Rejected",
};

export function buildApplicationStatusEmailTemplate(payload: {
  investorName: string;
  applicationId: string;
  plotId: string;
  status: ApplicationStatus;
  reviewNote?: string | null;
}) {
  const noteBlock = payload.reviewNote
    ? `<p style="margin:12px 0 0;color:#334155;"><strong>Review note:</strong> ${escapeHtml(payload.reviewNote)}</p>`
    : "";

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f3ec;font-family:'Segoe UI',Arial,sans-serif;color:#132435;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #d9d2c5;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(145deg,#0c3347 0%,#0f5a73 100%);padding:18px 22px;color:#fff;">
                <h1 style="margin:0;font-size:20px;line-height:1.2;">Alatau City Invest</h1>
                <p style="margin:8px 0 0;font-size:13px;opacity:.9;">Application status update</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px;">
                <p style="margin:0 0 10px;">Hello ${escapeHtml(payload.investorName)},</p>
                <p style="margin:0 0 12px;">Your application <strong>${escapeHtml(payload.applicationId)}</strong> for plot <strong>${escapeHtml(payload.plotId)}</strong> has been updated.</p>
                <div style="display:inline-block;padding:9px 12px;border-radius:999px;background:#e5edf1;color:#163448;font-size:13px;font-weight:600;">
                  New status: ${statusLabel[payload.status]}
                </div>
                ${noteBlock}
                <p style="margin:18px 0 0;color:#475569;">You can track full history in your investor cabinet.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
