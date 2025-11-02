"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMailAccount, stopMailWatch } from "@/lib/api";

export default function MailAccountCard({ account }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [stopping, setStopping] = useState(false);

  console.log("ACCOUNT:", account);
    console.log("isActive typeof:", typeof account.isActive, "value:", account.isActive);

  const isStopped = !account.isActive || new Date(account.watchExpiration) < new Date();

  const statusColors = {
    active: { bg: 'var(--success)', text: 'var(--success-text)', label: 'Active' },
    paused: { bg: '#fbbf24', text: '#78350f', label: 'Paused' },
    error: { bg: 'var(--error)', text: 'white', label: 'Error' },
    stopped: { bg: '#9ca3af', text: '#111827', label: 'Stopped' }
  };

  const status = isStopped
    ? statusColors.stopped
    : statusColors[account.status] || { bg: '#d1d5db', text: '#6b7280', label: account.status };

  // 🟡 Stop Watching
  const handleStopWatching = async () => {
    if (!confirm(`Stop watching for ${account.email}?`)) return;
    setStopping(true);
    try {
      await stopMailWatch(account.email);
      alert(`Stopped watching ${account.email}`);
      router.refresh();
    } catch (err) {
      alert(`Failed to stop watching: ${err.message}`);
    } finally {
      setStopping(false);
    }
  };

  // 🔁 Reconnect (yeniden OAuth’a yönlendir)
  const handleReconnect = () => {
    const reconnectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?userId=${account.userId}`;
    window.location.href = reconnectUrl;
  };

  // 🔴 Delete Mail Account
  const handleDelete = async () => {
    if (!confirm(`Delete mail account ${account.email}? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteMailAccount(account.email);
      alert(`${account.email} deleted`);
      router.refresh();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

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
            backgroundColor: status.bg,
            color: status.text
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
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

      {/* === Butonlar === */}
      <div className="flex flex-wrap gap-3 mt-3">
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

        {/* 🔁 Reconnect veya 🟡 Stop Watching */}
        {isStopped ? (
          <button
            onClick={handleReconnect}
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--success)',
              borderColor: 'var(--success-text)',
              color: '#000'
            }}
          >
            Reconnect
          </button>
        ) : (
          <button
            onClick={handleStopWatching}
            disabled={stopping}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--accent-light)',
              color: 'var(--foreground)'
            }}
          >
            {stopping ? "Stopping..." : "Stop Watching"}
          </button>
        )}

        {/* 🔴 Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error)'
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* ℹ️ Bilgilendirme alanı */}
      {isStopped && (
        <p
          className="mt-3 text-xs italic opacity-80"
          style={{ color: 'var(--foreground)' }}
        >
          Watching is stopped — click <strong>Reconnect</strong> to resume monitoring this mailbox.
        </p>
      )}
    </div>
  );
}