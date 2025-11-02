"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchMailAccounts } from "@/lib/api";
import MailAccountCard from "@/components/MailAccountCard";

export default function MailAccountsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchMailAccounts(user.id);
      console.log("test", res);
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
              className="px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105 hover:bg-[rgba(179,200,207,0.15)]"
              style={{
                borderColor: 'var(--accent)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)'
              }}
              disabled={loading}
              type="button"
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
              <MailAccountCard key={acc.email} account={acc} />
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}