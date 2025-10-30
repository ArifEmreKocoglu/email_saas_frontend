"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchMailAccounts } from "@/lib/api";

export default function MailAccountsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchMailAccounts(user.id);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  if (!user) return null;

  const connectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?userId=${user.id}`;

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Mail Accounts
          </h1>
          <div className="flex items-center gap-3">
            <a 
              href={connectUrl} 
              className="inline-block px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'var(--foreground)'
              }}
            >
              Connect Gmail
            </a>
            <button
              onClick={load}
              className="px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105"
              style={{
                borderColor: 'var(--accent)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(179, 200, 207, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {!data || loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div 
                className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--foreground)' }}>Loading accounts...</p>
            </div>
          </div>
        ) : data.items.length === 0 ? (
          <div 
            className="text-center py-12 rounded-xl"
            style={{ 
              backgroundColor: 'var(--accent-hover)',
              color: 'var(--foreground)'
            }}
          >
            <p className="text-lg">No accounts connected yet</p>
            <p className="text-sm opacity-70 mt-2">Click "Connect Gmail" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((acc) => (
              <div 
                key={acc.email} 
                className="p-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-102 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--accent)',
                  border: '1px solid var(--accent-light)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div 
                      className="font-semibold text-lg mb-1"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {acc.email}
                    </div>
                    <div 
                      className="text-sm opacity-80 mb-2"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {acc.provider} • connected {new Date(acc.connectedAt).toLocaleString()}
                    </div>
                    {acc.watchExpiration && (
                      <div 
                        className="text-xs opacity-70 mb-1"
                        style={{ color: 'var(--foreground)' }}
                      >
                        Watch expires: {new Date(acc.watchExpiration).toLocaleString()}
                      </div>
                    )}
                    {acc.lastHistoryId && (
                      <div 
                        className="text-xs opacity-60 font-mono"
                        style={{ color: 'var(--foreground)' }}
                      >
                        lastHistoryId: {String(acc.lastHistoryId).slice(0, 12)}…
                      </div>
                    )}
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1.5"
                    style={{
                      backgroundColor: acc.status === "active" ? 'var(--background)' : acc.status === "paused" ? '#fbbf24' : 'var(--error)',
                      color: acc.status === "active" ? 'var(--foreground)' : acc.status === "paused" ? '#78350f' : 'white'
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: acc.status === "active" ? 'var(--success-text)' : acc.status === "paused" ? '#78350f' : 'white'
                      }}
                    />
                    {acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}