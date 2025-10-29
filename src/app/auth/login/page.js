"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.replace("/mail-accounts");
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-6">
      <div 
        className="max-w-md w-full p-8 rounded-xl shadow-xl"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <div className="text-center mb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Welcome back
          </h1>
          <p 
            className="text-sm opacity-80"
            style={{ color: 'var(--foreground)' }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {err && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error)',
              border: '1px solid var(--error-border)'
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Email
            </label>
            <input
              className="w-full rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--background)',
                border: '2px solid var(--accent)',
                color: 'var(--background)',
                WebkitBoxShadow: '0 0 0 1000px var(--foreground) inset',
                WebkitTextFillColor: 'var(--background)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--background)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--accent)';
              }}
              placeholder="you@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Password
            </label>
            <input
              className="w-full rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--background)',
                border: '2px solid var(--accent)',
                color: 'var(--background)',
                WebkitBoxShadow: '0 0 0 1000px var(--foreground) inset',
                WebkitTextFillColor: 'var(--background)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--background)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--accent)';
              }}
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-center">
            <button 
              className="rounded-lg shadow px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--foreground)'
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p 
          className="text-sm text-center mt-6"
          style={{ color: 'var(--foreground)' }}
        >
          No account?{' '}
          <Link 
            className="font-semibold underline underline-offset-4 transition-all duration-200 hover:opacity-70"
            href="/auth/register"
            style={{ color: 'var(--foreground)' }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}