export default function MailAccountCard({ account }) {
    const statusColors = {
      active: "bg-green-100 text-green-700",
      paused: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
    };
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{account.email}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusColors[account.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {account.status}
          </span>
        </div>
  
        <p className="text-xs text-gray-500 mt-2">
          Connected on {new Date(account.createdAt).toLocaleDateString()}
        </p>
  
        <button className="mt-3 text-sm text-blue-600 hover:underline">
          View Logs
        </button>
      </div>
    );
  }
  