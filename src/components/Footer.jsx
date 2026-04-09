export default function Footer() {
    return (
        <footer className="py-12 px-10 text-center text-gray-400 text-xs md:text-sm bg-black/40 border-t border-white/10 mt-12">
            <p className="mb-2 max-w-2xl mx-auto leading-relaxed opacity-80">
                Disclaimer: This website does not own, store, or host any movie player content.
                <br className="hidden md:block" /> All streaming players are embedded through third-party hosting services using their respective APIs.
            </p>
            <p className="font-title font-bold text-gray-300 tracking-widest mt-4">© 2026 LUNAFLIX</p>
        </footer>
    );
}