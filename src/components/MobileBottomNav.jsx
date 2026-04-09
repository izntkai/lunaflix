import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, Tv, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/movies', icon: Film, label: 'Movies' },
  { path: '/tv-shows', icon: Tv, label: 'TV' },
  { path: '/search', icon: Search, label: 'Search' },
];

const MobileBottomNav = () => {
  const handleHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Ignore if not on native
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-t border-white/10 pb-6 pt-3 px-6 md:hidden select-none">
      <div className="flex items-center justify-around">
        {tabs.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={handleHaptic}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center space-y-1 transition-colors duration-300
              ${isActive ? 'text-white' : 'text-gray-500'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -top-3 w-8 h-1 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
