export default function StatsCard({ title, value, color }) {
  const colorMap = {
    blue: { bg: '#B3C8CF', text: '#F1F0E8' },
    green: { bg: '#E5E1DA', text: '#89A8B2' },
    emerald: { bg: '#B3C8CF', text: '#F1F0E8' },
    red: { bg: '#d1d5db', text: '#6b7280' },
  };

  const colors = colorMap[color] || { bg: '#E5E1DA', text: '#89A8B2' };

  return (
    <div 
      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: colors.bg,
        border: '1px solid rgba(179, 200, 207, 0.3)'
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