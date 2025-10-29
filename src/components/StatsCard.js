export default function StatsCard({ title, value, color }) {
  const colorMap = {
    blue: { bg: 'var(--accent)', text: 'var(--foreground)' },
    green: { bg: 'var(--accent)', text: 'var(--background)' },
    emerald: { bg: 'var(--accent)', text: 'var(--foreground)' },
    red: { bg: '#d1d5db', text: '#6b7280' },
  };

  const colors = colorMap[color] || { bg: 'var(--accent)', text: 'var(--background)' };

  return (
    <div 
      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: colors.bg,
        border: '1px solid var(--accent-light)'
      }}
    >
      <p 
        className="text-sm font-medium uppercase tracking-wider opacity-80 mb-2"
        style={{ color: colors.text }}
      >
        {title}
      </p>
      <h3
        className="text-4xl font-bold"
        style={{ color: colors.text }}
      >
        {value}
      </h3>
    </div>
  );
}