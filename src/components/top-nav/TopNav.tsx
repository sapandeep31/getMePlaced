import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import { AiOutlineFileText, AiOutlineCode } from "react-icons/ai";

export default function TopNav() {
  const location = useLocation();

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

      <div className="w-8 sm:w-[100px]" /> {/* Spacer */}
    </nav>
  );
}
