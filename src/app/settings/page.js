"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";


export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div 
            className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--foreground)' }}>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <RequireAuth>
      <div className="p-8">
        <h2 
          className="text-3xl font-semibold mb-2 tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Settings
        </h2>
        <p 
          className="mb-6 opacity-80"
          style={{ color: 'var(--foreground)' }}
        >
          Manage your account, plan and preferences.
        </p>

        <div 
          className="p-6 rounded-xl shadow-lg space-y-6"
          style={{ 
            backgroundColor: 'var(--accent)',
            border: '1px solid rgba(220, 207, 192, 0.3)'
          }}
        >
          <div className="pb-4 border-b" style={{ borderColor: 'rgba(137, 168, 178, 0.2)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--background)' }}
            >
              Name
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: 'var(--background)' }}
            >
              {user.name || "-"}
            </p>
          </div>

          <div className="pb-4 border-b" style={{ borderColor: 'rgba(137, 168, 178, 0.2)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--background)' }}
            >
              Email
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: 'var(--background)' }}
            >
              {user.email}
            </p>
          </div>

          <div>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--background)' }}
            >
              Plan
            </p>
            <div className="flex items-center gap-2">
              <p 
                className="text-lg font-semibold"
                style={{ color: 'var(--background)' }}
              >
                {user.plan || "Free"}
              </p>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: 'var(--foreground)'
                }}
              >
                Active
              </span>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'var(--accent)' }}>
            <p 
              className="text-sm font-medium mb-2 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              Theme
            </p>
            <div className="flex items-center justify-between">
              <p 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--foreground)'
                }}
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}