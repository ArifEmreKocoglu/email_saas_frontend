"use client";

import { useRouter } from "next/navigation";

export default function MailAccountCard({ account }) {
  const router = useRouter();
  const statusColors = {
    active: { bg: 'var(--success)', text: 'var(--success-text)', label: 'Active' },
    paused: { bg: '#fbbf24', text: '#78350f', label: 'Paused' },
    error: { bg: 'var(--error)', text: 'white', label: 'Error' },
  };

  const status = statusColors[account.status] || { bg: '#d1d5db', text: '#6b7280', label: account.status };

  return (
    <div 
      className="rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102"
      style={{
        backgroundColor: 'var(--accent)',
        border: '1px solid var(--accent-light)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="font-semibold text-lg"
          style={{ color: 'var(--foreground)' }}
        >
          {account.email}
        </h3>
        <span
          className="text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm flex items-center gap-1.5"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)"
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: status.text }}
          />
          {status.label}
        </span>
      </div>

      <div className="flex-1 mb-3">
        <div 
          className="text-sm opacity-80 mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          {account.provider} • connected {new Date(account.connectedAt || account.createdAt).toLocaleString()}
        </div>
        {account.watchExpiration && (
          <div 
            className="text-xs opacity-70 mb-1"
            style={{ color: 'var(--foreground)' }}
          >
            Watch expires: {new Date(account.watchExpiration).toLocaleString()}
          </div>
        )}
        {account.lastHistoryId && (
          <div 
            className="text-xs opacity-60 font-mono mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            lastHistoryId: {String(account.lastHistoryId).slice(0, 12)}…
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/mail-accounts/${encodeURIComponent(account.email)}/tags`)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            borderColor: 'var(--background)'
          }}
          type="button"
        >
          Manage Tags
        </button>
        <button
          onClick={() => router.push('/logs')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            borderColor: 'var(--background)'
          }}
          type="button"
        >
          View Logs
        </button>
      </div>
    </div>
  );
}