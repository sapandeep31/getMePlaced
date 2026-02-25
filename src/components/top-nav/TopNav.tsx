import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import { AiOutlineFileText, AiOutlineCode } from "react-icons/ai";
import { useSettings } from "../../contexts/SettingsContext";

export default function TopNav() {
  const location = useLocation();
  const { openSettings } = useSettings();

  const navLinks = [
    {
      name: "Interview Assistant",
      path: "/",
      altPath: "/interview",
      icon: <AiOutlineFileText className="text-xl flex-shrink-0" />,
    },
    {
      name: "DSA Companion",
      path: "/dsa",
      icon: <AiOutlineCode className="text-xl flex-shrink-0" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <span className="text-white font-bold text-sm sm:text-xl tracking-tighter">gP</span>
        </div>
        <h1 className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 truncate">
          getMePlaced
        </h1>
      </div>

      <div className="flex z-10 items-center justify-center space-x-1 sm:space-x-2 bg-white/5 rounded-full p-1 sm:p-1.5 border border-white/5 shadow-inner">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname === link.altPath;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-white bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {link.icon}
              <span className="hidden sm:block">{link.name}</span>

              {isActive && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Settings button */}
      <button
        onClick={openSettings}
        title="API Settings"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all active:scale-95"
      >
        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </nav>
  );
}

