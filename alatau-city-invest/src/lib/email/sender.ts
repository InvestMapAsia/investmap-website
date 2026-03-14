type SendEmailPayload = {
  to: string;
  subject: string;
  html: string;
};

type EmailSendResult = {
  provider: "console" | "resend";
  sent: boolean;
  error?: string;
};

export async function sendEmail(payload: SendEmailPayload): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Alatau City Invest <no-reply@alatau.city>";

  if (!resendApiKey) {
    console.info("[email] No RESEND_API_KEY configured. Email preview fallback enabled.", {
      to: payload.to,
      subject: payload.subject,
    });
    return { provider: "console", sent: false, error: "missing_resend_api_key" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[email] Resend API failed", { status: response.status, body });
      return {
        provider: "console",
        sent: false,
        error: `resend_http_${response.status}`,
      };
    }

    return { provider: "resend", sent: true };
  } catch (error) {
    console.error("[email] Failed to send via Resend", error);
    return { provider: "console", sent: false, error: "resend_network_error" };
  }
}
