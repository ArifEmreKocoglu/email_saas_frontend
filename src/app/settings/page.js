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
            border: '1px solid var(--accent-light)'
          }}
        >
          <div className="pb-4 border-b" style={{ borderColor: 'var(--background)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              Name
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              {user.name || "-"}
            </p>
          </div>

          <div className="pb-4 border-b" style={{ borderColor: 'var(--background)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              Email
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              {user.email}
            </p>
          </div>

          <div>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              Plan
            </p>
            <div className="flex items-center gap-2">
              <p 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {user.plan || "Free"}
              </p>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--success-text)' }}
                />
                Active
              </span>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'var(--background)' }}>
            <p 
              className="text-sm font-medium mb-2 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              Theme
            </p>
            <div className="flex items-center gap-3">
              <p 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--background)' : 'rgba(162, 175, 155, 0.3)'
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: 'var(--foreground)',
                    transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}