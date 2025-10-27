export default function StatsCard({ title, value, color }) {
    const colorMap = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      emerald: "bg-emerald-100 text-emerald-700",
      red: "bg-red-100 text-red-700",
    };
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">{title}</p>
        <h3
          className={`text-2xl font-semibold mt-2 ${colorMap[color] || "text-gray-800"}`}
        >
          {value}
        </h3>
      </div>
    );
  }
  