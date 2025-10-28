"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header 
      className="flex items-center justify-between px-6 py-4 shadow-md backdrop-blur-sm border-b"
      style={{ 
        backgroundColor: 'rgba(220, 207, 192, 0.3)',
        borderBottomColor: 'rgba(220, 207, 192, 0.2)'
      }}
    >
      <h1 
        className="text-xl font-bold tracking-tight transition-all duration-300 hover:scale-105"
        style={{ 
          color: 'var(--foreground)',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Entrfy Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
              style={{ backgroundColor: 'rgba(220, 207, 192, 0.2)' }}
            >
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                Hello, <b className="font-semibold">{user.name || user.email}</b>
              </span>
              <span className="text-lg">👋</span>
            </div>
            <button
              onClick={onLogout}
              className="text-sm font-medium rounded-lg px-4 py-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ 
                color: 'var(--foreground)',
                borderColor: 'var(--accent)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 207, 192, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <span 
            className="text-sm opacity-70"
            style={{ color: 'var(--foreground)' }}
          >
            Not signed in
          </span>
        )}
      </div>
    </header>
  );
}