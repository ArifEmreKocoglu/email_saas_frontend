"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div 
            className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
            style={{ borderColor: '#B3C8CF', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#F1F0E8' }}>Loading...</p>
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
          style={{ color: '#F1F0E8' }}
        >
          Settings
        </h2>
        <p 
          className="mb-6 opacity-80"
          style={{ color: '#F1F0E8' }}
        >
          Manage your account, plan and preferences.
        </p>

        <div 
          className="p-6 rounded-xl shadow-lg space-y-6"
          style={{ 
            backgroundColor: '#E5E1DA',
            border: '1px solid rgba(179, 200, 207, 0.3)'
          }}
        >
          <div className="pb-4 border-b" style={{ borderColor: 'rgba(137, 168, 178, 0.2)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: '#89A8B2' }}
            >
              Name
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: '#89A8B2' }}
            >
              {user.name || "-"}
            </p>
          </div>

          <div className="pb-4 border-b" style={{ borderColor: 'rgba(137, 168, 178, 0.2)' }}>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: '#89A8B2' }}
            >
              Email
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: '#89A8B2' }}
            >
              {user.email}
            </p>
          </div>

          <div>
            <p 
              className="text-sm font-medium mb-1 opacity-70"
              style={{ color: '#89A8B2' }}
            >
              Plan
            </p>
            <div className="flex items-center gap-2">
              <p 
                className="text-lg font-semibold"
                style={{ color: '#89A8B2' }}
              >
                {user.plan || "Free"}
              </p>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: '#B3C8CF',
                  color: '#F1F0E8'
                }}
              >
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}