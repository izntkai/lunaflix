import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { usePlatform } from "../hooks/usePlatform";

export default function Layout() {
  const { isNative } = usePlatform();

  return (
    <div className={`min-h-screen flex flex-col bg-[#0f0f0f] text-gray-100 selection:bg-purple-600 selection:text-white font-sans ${isNative ? 'pb-24' : ''}`}>
      <Navbar />
      <main className={`flex-1 ${isNative ? 'pt-16' : 'pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
      {isNative && <MobileBottomNav />}
    </div>
  );
}
