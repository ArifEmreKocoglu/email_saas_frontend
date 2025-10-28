"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      router.replace("/mail-accounts");
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div 
        className="max-w-md w-full p-8 rounded-xl shadow-xl"
        style={{ backgroundColor: '#E5E1DA' }}
      >
        <div className="text-center mb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: '#89A8B2' }}
          >
            Create your account
          </h1>
          <p 
            className="text-sm opacity-80"
            style={{ color: '#89A8B2' }}
          >
            Get started with Entrfy Mail SaaS
          </p>
        </div>

        {err && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#89A8B2' }}
            >
              Name
            </label>
            <input
              className="w-full rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'white',
                border: '2px solid #B3C8CF',
                color: '#89A8B2'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#89A8B2';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#B3C8CF';
              }}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#89A8B2' }}
            >
              Email
            </label>
            <input
              className="w-full rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'white',
                border: '2px solid #B3C8CF',
                color: '#89A8B2'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#89A8B2';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#B3C8CF';
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
              style={{ color: '#89A8B2' }}
            >
              Password
            </label>
            <input
              className="w-full rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'white',
                border: '2px solid #B3C8CF',
                color: '#89A8B2'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#89A8B2';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#B3C8CF';
              }}
              placeholder="Minimum 6 characters"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button 
            className="w-full rounded-lg px-4 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: '#B3C8CF',
              color: '#F1F0E8'
            }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p 
          className="text-sm text-center mt-6"
          style={{ color: '#89A8B2' }}
        >
          Already have an account?{' '}
          <Link 
            className="font-semibold underline underline-offset-4 transition-all duration-200 hover:opacity-70"
            href="/auth/login"
            style={{ color: '#89A8B2' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}