"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

type Mode = "login" | "register";

export function LoginPanel({ callbackUrl }: { callbackUrl?: string }) {
  const { lang } = useCurrentLanguage();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "INVESTOR",
  });

  const t = pickLang(lang, {
    EN: {
      invalid: "Invalid credentials.",
      regFailed: "Registration failed.",
      regSuccess: "Registration successful. You can now sign in.",
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
      demo:
        "Demo logins: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
      loadRoleError: "Could not detect role after login. Opening investor cabinet.",
    },
    RU: {
      invalid: "Неверные данные для входа.",
      regFailed: "Ошибка регистрации.",
      regSuccess: "Регистрация успешна. Теперь вы можете войти.",
      login: "Вход",
      register: "Регистрация",
      name: "Имя",
      email: "Email",
      password: "Пароль",
      role: "Роль",
      investor: "Инвестор",
      owner: "Собственник",
      wait: "Подождите...",
      signIn: "Войти",
      create: "Создать аккаунт",
      demo:
        "Демо-доступ: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
      loadRoleError: "Не удалось определить роль после входа. Открываем кабинет инвестора.",
    },
    KZ: {
      invalid: "Кіру деректері қате.",
      regFailed: "Тіркелу қатесі.",
      regSuccess: "Тіркелу сәтті. Енді жүйеге кіре аласыз.",
      login: "Кіру",
      register: "Тіркелу",
      name: "Аты",
      email: "Email",
      password: "Құпиясөз",
      role: "Рөл",
      investor: "Инвестор",
      owner: "Жер иесі",
      wait: "Күте тұрыңыз...",
      signIn: "Кіру",
      create: "Аккаунт ашу",
      demo:
        "Демо кіру: admin@alatau.city / Admin#2026, investor@alatau.city / Investor#2026, owner@alatau.city / Owner#2026",
      loadRoleError: "Кіруден кейін рөл анықталмады. Инвестор кабинетіне өту орындалады.",
    },
  });

  const target = useMemo(() => callbackUrl || "/cabinet/investor", [callbackUrl]);

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

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: target,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setMessage(t.invalid);
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

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(payload?.error || t.regFailed);
      return;
    }

    setMode("login");
    setMessage(t.regSuccess);
  };

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

      {message ? (
        <p className="muted" style={{ marginTop: 12 }}>
          {message}
        </p>
      ) : null}

      <div className="notice" style={{ marginTop: 14 }}>
        {t.demo}
      </div>
    </section>
  );
}

