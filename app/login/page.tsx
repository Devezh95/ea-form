
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <section className="auth-card">
        <Link href="/login" className="auth-brand">
          <span className="auth-brand-mark">EA</span>
          <span>FORM</span>
        </Link>

        <div className="auth-heading">
          <span className="auth-overline">YOUR FORM. YOUR RULES.</span>
          <h1>С возвращением</h1>
          <p>Войди в аккаунт, чтобы продолжить работу</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label className="auth-field">
            <span>Email</span>
            <input
              required
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Пароль</span>
            <input
              required
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {message && (
            <div className="auth-error">
              {message}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Входим..." : "Войти в аккаунт"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="auth-divider">
          <span />
          <span>НОВЫЙ В EA FORM?</span>
          <span />
        </div>

        <p className="auth-register">
          Ещё нет аккаунта?
          <Link href="/register"> Создать аккаунт</Link>
        </p>
      </section>

      <footer className="auth-footer">
        <span>EA FORM</span>
        <span>ТВОЯ ФОРМА. ТВОИ ПРАВИЛА.</span>
      </footer>
    </main>
  );
}
