import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function NavLink({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 text-[13px] font-title font-medium transition-all duration-300 group px-5 py-2 rounded-full
        ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
    >
      {Icon && <Icon size={14} />}
      <span className="relative z-10">{label}</span>
      {isActive ? (
        <motion.div
          layoutId="pill-nav"
          className="absolute inset-0 bg-purple-600 rounded-full -z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ) : (
        <motion.div
          whileHover={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 bg-white/5 rounded-full -z-10"
        />
      )}
    </Link>
  );
}
