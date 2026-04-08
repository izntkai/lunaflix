import { Link, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv } from "lucide-react";

export function MobileMenu({ isMobileMenuOpen, setIsMobileMenuOpen, query, setQuery, handleSearch }) {
  const location = useLocation();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#0f0f0f] pt-24 px-6 md:hidden flex flex-col gap-6">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-purple-500 outline-none"
        />
      </form>

      <div className="flex flex-col gap-2">
        <MobileNavLink to="/" label="Home" icon={Home} isActive={location.pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
        <MobileNavLink to="/movies" label="Movies" icon={Film} isActive={location.pathname === '/movies'} onClick={() => setIsMobileMenuOpen(false)} />
        <MobileNavLink to="/series" label="Series" icon={Tv} isActive={location.pathname === '/series'} onClick={() => setIsMobileMenuOpen(false)} />
      </div>
    </div>
  );
}

function MobileNavLink({ to, label, icon: Icon, isActive, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
      {Icon && <Icon size={20} />} <span className="text-lg font-medium">{label}</span>
    </Link>
  );
}
