"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/mail-accounts", label: "Mail Accounts" },
    { href: "/logs", label: "Logs" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside 
      className="w-56 flex flex-col shadow-xl border-r backdrop-blur-sm" 
      style={{ 
        backgroundColor: 'var(--accent-light)',
        borderRightColor: 'var(--accent-hover)'
      }}
    >
      {/* Header with subtle animation */}
      <div 
        className="px-6 py-6 border-b border-opacity-20 transform transition-all duration-300 hover:scale-105" 
        style={{ borderColor: 'var(--accent-hover)' }}
      >
        <h2 
          className="text-2xl font-bold tracking-wide" 
          style={{ 
            color: 'var(--foreground)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Entrfy
        </h2>
        <p className="text-xs mt-1 opacity-80" style={{ color: 'var(--foreground)' }}>
          Mail Management
        </p>
      </div>

      {/* Navigation with enhanced animations */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group block relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-1"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.1}s backwards`,
              }}
            >
              <div
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive ? 'shadow-lg' : ''
                }`}
                style={{
                  color: 'var(--foreground)',
                  backgroundColor: isActive 
                    ? 'rgba(229, 225, 218, 0.3)' 
                    : 'transparent',
                }}
              >
                <span className="relative">
                  {link.label}
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-0 h-0.5 w-full"
                      style={{ 
                        backgroundColor: 'var(--accent)',
                        animation: 'slideRight 0.3s ease-out'
                      }}
                    />
                  )}
                </span>
              </div>
              
              {/* Hover effect overlay */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundColor: 'rgba(229, 225, 218, 0.15)',
                }}
              />
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      <div className="px-4 pb-4">
        <div 
          className="rounded-lg p-3 border border-opacity-20"
          style={{ 
            borderColor: 'var(--accent)',
            backgroundColor: 'var(--accent-hover)'
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#4ade80' }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Footer with hover effect */}
      <div 
        className="border-t border-opacity-20 p-4 text-xs text-center transition-all duration-300 hover:bg-opacity-10" 
        style={{ 
          borderColor: 'var(--accent-hover)', 
          color: 'var(--foreground)',
          backgroundColor: 'transparent'
        }}
      >
        <p className="font-medium">Entrfy Mail SaaS</p>
        <p className="opacity-70 mt-1">© {new Date().getFullYear()}</p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideRight {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}