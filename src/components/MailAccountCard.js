export default function MailAccountCard({ account }) {
  const statusColors = {
    active: { bg: 'var(--accent)', text: 'var(--foreground)' },
    paused: { bg: 'var(--accent)', text: 'var(--background)' },
    error: { bg: '#d1d5db', text: '#6b7280' },
  };

  const status = statusColors[account.status] || { bg: '#d1d5db', text: '#6b7280' };

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
          style={{ color: 'var(--background)' }}
        >
          {account.email}
        </h3>
        <span
          className="text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm"
          style={{
            backgroundColor: status.bg,
            color: status.text
          }}
        >
          {account.status}
        </span>
      </div>

      <p 
        className="text-sm opacity-80 mb-3"
        style={{ color: 'var(--background)' }}
      >
        Connected on {new Date(account.createdAt).toLocaleDateString()}
      </p>

      <button 
        className="text-sm font-medium transition-all duration-300 hover:underline hover:translate-x-1 inline-flex items-center gap-1"
        style={{ color: 'var(--background)' }}
      >
        View Logs
        <span className="text-xs">→</span>
      </button>
    </div>
  );
}