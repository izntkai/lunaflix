import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050505] font-paragraph text-[#F5F5F5] selection:bg-[#A78BFA]/30 selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-[1680px] flex-1 pt-20 pb-24 md:pb-10">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
