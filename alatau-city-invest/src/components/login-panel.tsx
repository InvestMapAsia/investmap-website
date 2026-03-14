"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

type Mode = "login" | "register";

type RegisterResponse = {
  error?: string;
  verification?: {
    required?: boolean;
    sent?: boolean;
    provider?: "resend" | "console";
    error?: string | null;
    expiresAt?: string;
    previewUrl?: string | null;
  };
};

type ResendResponse = {
  ok?: boolean;
  error?: string;
  sent?: boolean;
  alreadyVerified?: boolean;
  deliveryError?: string | null;
  previewUrl?: string | null;
};

export function LoginPanel({
  callbackUrl,
  verificationStatus,
  verificationReason,
}: {
  callbackUrl?: string;
  verificationStatus?: "1" | "0" | null;
  verificationReason?: string | null;
}) {
  const { lang } = useCurrentLanguage();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [verificationPreviewUrl, setVerificationPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "INVESTOR",
  });

  const t = useMemo(
    () =>
      pickLang(lang, {
        EN: {
          invalid: "Invalid credentials.",
          emailNotVerified: "Please confirm your email first. Check your inbox and try again.",
          regFailed: "Registration failed.",
          regSuccess: "Registration successful. Check your email to confirm your account.",
          regSuccessPreview:
            "Registration successful. Email provider is not configured, use preview link below.",
          regNoEmail:
            "Registration completed, but verification email was not sent. Contact support.",
          verifySuccess: "Email confirmed. You can now sign in.",
          verifyInvalid: "Verification link is invalid.",
          verifyExpired:
            "Verification link has expired. Enter your email and request a new one.",
          resend: "Resend verification email",
          resendWait: "Sending...",
          resendNeedEmail: "Enter your email first, then request a new verification link.",
          resendSuccess: "Verification email sent. Check your inbox.",
          resendSuccessPreview:
            "Email provider is not configured, use the preview verification link below.",
          resendAlreadyVerified: "This email is already verified. You can sign in.",
          resendFailed: "Could not resend verification email.",
          resendNoEmail:
            "Could not send verification email. Check mail settings in Vercel and Resend.",
          login: "Login",
          register: "Register",
          name: "Name",
          email: "Email",
          password: "Password",
          role: "Role",
          investor: "Investor",
          owner: "Owner",
          wait: "Please wait...",
          signIn: "Sign in",
          create: "Create account",
          previewLabel: "Verification link preview:",
          open: "Open",
          demo:
            "Demo logins: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
          loadRoleError: "Could not detect role after login. Opening investor cabinet.",
        },
        RU: {
          invalid: "Invalid credentials.",
          emailNotVerified: "Please confirm your email first. Check your inbox and try again.",
          regFailed: "Registration failed.",
          regSuccess: "Registration successful. Check your email to confirm your account.",
          regSuccessPreview:
            "Registration successful. Email provider is not configured, use preview link below.",
          regNoEmail:
            "Registration completed, but verification email was not sent. Contact support.",
          verifySuccess: "Email confirmed. You can now sign in.",
          verifyInvalid: "Verification link is invalid.",
          verifyExpired:
            "Verification link has expired. Enter your email and request a new one.",
          resend: "Resend verification email",
          resendWait: "Sending...",
          resendNeedEmail: "Enter your email first, then request a new verification link.",
          resendSuccess: "Verification email sent. Check your inbox.",
          resendSuccessPreview:
            "Email provider is not configured, use the preview verification link below.",
          resendAlreadyVerified: "This email is already verified. You can sign in.",
          resendFailed: "Could not resend verification email.",
          resendNoEmail:
            "Could not send verification email. Check mail settings in Vercel and Resend.",
          login: "Login",
          register: "Register",
          name: "Name",
          email: "Email",
          password: "Password",
          role: "Role",
          investor: "Investor",
          owner: "Owner",
          wait: "Please wait...",
          signIn: "Sign in",
          create: "Create account",
          previewLabel: "Verification link preview:",
          open: "Open",
          demo:
            "Demo logins: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
          loadRoleError: "Could not detect role after login. Opening investor cabinet.",
        },
        KZ: {
          invalid: "Invalid credentials.",
          emailNotVerified: "Please confirm your email first. Check your inbox and try again.",
          regFailed: "Registration failed.",
          regSuccess: "Registration successful. Check your email to confirm your account.",
          regSuccessPreview:
            "Registration successful. Email provider is not configured, use preview link below.",
          regNoEmail:
            "Registration completed, but verification email was not sent. Contact support.",
          verifySuccess: "Email confirmed. You can now sign in.",
          verifyInvalid: "Verification link is invalid.",
          verifyExpired:
            "Verification link has expired. Enter your email and request a new one.",
          resend: "Resend verification email",
          resendWait: "Sending...",
          resendNeedEmail: "Enter your email first, then request a new verification link.",
          resendSuccess: "Verification email sent. Check your inbox.",
          resendSuccessPreview:
            "Email provider is not configured, use the preview verification link below.",
          resendAlreadyVerified: "This email is already verified. You can sign in.",
          resendFailed: "Could not resend verification email.",
          resendNoEmail:
            "Could not send verification email. Check mail settings in Vercel and Resend.",
          login: "Login",
          register: "Register",
          name: "Name",
          email: "Email",
          password: "Password",
          role: "Role",
          investor: "Investor",
          owner: "Owner",
          wait: "Please wait...",
          signIn: "Sign in",
          create: "Create account",
          previewLabel: "Verification link preview:",
          open: "Open",
          demo:
            "Demo logins: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
          loadRoleError: "Could not detect role after login. Opening investor cabinet.",
        },
      }),
    [lang]
  );

  const target = useMemo(() => callbackUrl || "/cabinet/investor", [callbackUrl]);

  const verificationMessage = useMemo(() => {
    if (verificationStatus === "1") {
      return t.verifySuccess;
    }
    if (verificationStatus === "0") {
      if (verificationReason === "expired") {
        return t.verifyExpired;
      }
      return t.verifyInvalid;
    }
    return null;
  }, [verificationReason, verificationStatus, t.verifyExpired, t.verifyInvalid, t.verifySuccess]);

  const resolveRoleRedirect = async () => {
    if (callbackUrl) return callbackUrl;

    const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
    if (!sessionRes.ok) {
      return "/cabinet/investor";
    }

    const sessionData = (await sessionRes.json()) as {
      user?: { role?: "ADMIN" | "MODERATOR" | "OWNER" | "INVESTOR" };
    };

    const role = sessionData.user?.role;
    if (role === "ADMIN" || role === "MODERATOR") return "/admin";
    if (role === "OWNER") return "/cabinet/owner";
    return "/cabinet/investor";
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setVerificationPreviewUrl(null);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: target,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      if (result?.error?.includes("EMAIL_NOT_VERIFIED")) {
        setMessage(t.emailNotVerified);
        setCanResend(true);
      } else {
        setMessage(t.invalid);
        setCanResend(false);
      }
      return;
    }

    const roleRedirect = await resolveRoleRedirect().catch(() => {
      window.alert(t.loadRoleError);
      return "/cabinet/investor";
    });

    window.location.href = roleRedirect || result.url || target;
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setVerificationPreviewUrl(null);
    setCanResend(false);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });

    const payload = (await response.json().catch(() => null)) as RegisterResponse | null;
    setLoading(false);

    if (!response.ok) {
      setMessage(payload?.error || t.regFailed);
      return;
    }

    setMode("login");
    setVerificationPreviewUrl(payload?.verification?.previewUrl ?? null);
    setCanResend(true);

    if (payload?.verification?.sent) {
      setMessage(t.regSuccess);
      return;
    }

    if (payload?.verification?.previewUrl) {
      setMessage(t.regSuccessPreview);
      return;
    }

    const reason =
      process.env.NODE_ENV !== "production" && payload?.verification?.error
        ? ` (${payload.verification.error})`
        : "";
    setMessage(`${t.regNoEmail}${reason}`);
  };

  const handleResend = async () => {
    if (!form.email.trim()) {
      setMessage(t.resendNeedEmail);
      return;
    }

    setResending(true);
    setMessage(null);
    setVerificationPreviewUrl(null);

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    const payload = (await response.json().catch(() => null)) as ResendResponse | null;
    setResending(false);

    if (!response.ok) {
      setMessage(payload?.error || t.resendFailed);
      return;
    }

    if (payload?.alreadyVerified) {
      setMessage(t.resendAlreadyVerified);
      setCanResend(false);
      return;
    }

    setCanResend(true);
    setVerificationPreviewUrl(payload?.previewUrl ?? null);
    if (payload?.sent) {
      setMessage(t.resendSuccess);
      return;
    }

    if (payload?.previewUrl) {
      setMessage(t.resendSuccessPreview);
      return;
    }

    const reason =
      process.env.NODE_ENV !== "production" && payload?.deliveryError
        ? ` (${payload.deliveryError})`
        : "";
    setMessage(`${t.resendNoEmail}${reason}`);
  };

  const displayMessage = message ?? verificationMessage;
  const showResendAction = mode === "login" && (canResend || verificationStatus === "0");

  return (
    <section className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="tabs">
        <button
          type="button"
          className={mode === "login" ? "tab-btn active" : "tab-btn"}
          onClick={() => setMode("login")}
        >
          {t.login}
        </button>
        <button
          type="button"
          className={mode === "register" ? "tab-btn active" : "tab-btn"}
          onClick={() => setMode("register")}
        >
          {t.register}
        </button>
      </div>

      <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          {mode === "register" ? (
            <div className="form-field">
              <label>{t.name}</label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
          ) : null}

          <div className="form-field">
            <label>{t.email}</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>

          <div className="form-field">
            <label>{t.password}</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>

          {mode === "register" ? (
            <div className="form-field">
              <label>{t.role}</label>
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="INVESTOR">{t.investor}</option>
                <option value="OWNER">{t.owner}</option>
              </select>
            </div>
          ) : null}
        </div>

        <div className="plot-actions" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t.wait : mode === "login" ? t.signIn : t.create}
          </button>
        </div>
      </form>

      {displayMessage ? (
        <p className="muted" style={{ marginTop: 12 }}>
          {displayMessage}
        </p>
      ) : null}

      {showResendAction ? (
        <div className="plot-actions" style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={resending}
            onClick={handleResend}
          >
            {resending ? t.resendWait : t.resend}
          </button>
        </div>
      ) : null}

      {verificationPreviewUrl ? (
        <p className="muted" style={{ marginTop: 8, wordBreak: "break-all" }}>
          {t.previewLabel}{" "}
          <a href={verificationPreviewUrl} target="_blank" rel="noreferrer">
            {t.open}
          </a>
        </p>
      ) : null}

      <div className="notice" style={{ marginTop: 14 }}>
        {t.demo}
      </div>
    </section>
  );
}
