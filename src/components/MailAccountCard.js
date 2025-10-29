export default function MailAccountCard({ account }) {
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
          style={{ color: 'var(--background)' }}
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
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: status.text }}
          />
          {status.label}
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