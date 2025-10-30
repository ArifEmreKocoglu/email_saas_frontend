"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const status = sp.get("status");
  const email = sp.get("email");
  const msg = sp.get("msg");

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => router.replace("/mail-accounts"), 1500);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div 
          className="max-w-md w-full p-8 rounded-xl shadow-xl text-center"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <span className="text-3xl">❌</span>
          </div>
          <h1 
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--background)' }}
          >
            Connection Error
          </h1>
          <p 
            className="text-red-600 font-medium"
            style={{ color: 'var(--error)' }}
          >
            {msg || "Unknown error"}
          </p>
          <button
            onClick={() => router.push("/mail-accounts")}
            className="mt-6 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: 'var(--accent)',
              color: 'var(--foreground)'
            }}
          >
            Back to Mail Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div 
        className="max-w-md w-full p-8 rounded-xl shadow-xl text-center"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse"
          style={{ backgroundColor: 'rgba(75, 222, 128, 0.2)' }}
        >
          <span className="text-3xl">✓</span>
        </div>
        <h1 
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--background)' }}
        >
          Account Connected
        </h1>
        <p 
          className="mb-2"
          style={{ color: 'var(--background)' }}
        >
          Gmail: <b className="font-semibold">{email}</b>
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: 'var(--accent)',
              animationDelay: '0s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: 'var(--accent)',
              animationDelay: '0.1s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: 'var(--accent)',
              animationDelay: '0.2s'
            }}
          />
        </div>
        <p 
          className="mt-2 text-sm opacity-80"
          style={{ color: 'var(--background)' }}
        >
          Redirecting...
        </p>
      </div>
    </div>
  );
}