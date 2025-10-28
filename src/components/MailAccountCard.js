export default function MailAccountCard({ account }) {
  const statusColors = {
    active: { bg: '#B3C8CF', text: '#F1F0E8' },
    paused: { bg: '#E5E1DA', text: '#89A8B2' },
    error: { bg: '#d1d5db', text: '#6b7280' },
  };

  const status = statusColors[account.status] || { bg: '#d1d5db', text: '#6b7280' };

  return (
    <div 
      className="rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102"
      style={{
        backgroundColor: '#E5E1DA',
        border: '1px solid rgba(179, 200, 207, 0.3)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="font-semibold text-lg"
          style={{ color: '#89A8B2' }}
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
        style={{ color: '#89A8B2' }}
      >
        Connected on {new Date(account.createdAt).toLocaleDateString()}
      </p>

      <button 
        className="text-sm font-medium transition-all duration-300 hover:underline hover:translate-x-1 inline-flex items-center gap-1"
        style={{ color: '#89A8B2' }}
      >
        View Logs
        <span className="text-xs">→</span>
      </button>
    </div>
  );
}