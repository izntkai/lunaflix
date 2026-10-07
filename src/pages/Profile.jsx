import SectionHeader from "../components/SectionHeader";
import { useMediaLibrary } from "../hooks/useMediaLibrary";
import { Link } from "react-router-dom";

export default function Profile() {
  const { myList, continueWatching } = useMediaLibrary();

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="Profile"
        title="Your LunaFlix Profile"
        description="Manage playback preferences and quickly return to saved titles and active sessions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border border-[#2A2A2F] bg-[#111114] p-5 md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A78BFA]/20 text-lg font-semibold text-[#C4B5FD]">L</div>
            <div>
              <p className="font-semibold text-[#F5F5F5]">LunaFlix Viewer</p>
              <p className="text-sm text-[#A1A1AA]">Account status: Active</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-[#A1A1AA]">
            <li>Language: English</li>
            <li>Subtitles: Enabled</li>
            <li>Autoplay Next Episode: Enabled</li>
            <li>Playback Quality: Auto</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#2A2A2F] bg-[#111114] p-5 md:col-span-2">
          <h2 className="text-lg font-semibold text-[#F5F5F5]">Activity</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ActivityCard title="My List" value={myList.length} link="/my-list" linkLabel="Open list" />
            <ActivityCard title="Continue Watching" value={continueWatching.length} link="/" linkLabel="Resume" />
          </div>
          <p className="mt-5 text-sm text-[#A1A1AA]">
            Authentication settings are managed by the active provider integration in your environment.
          </p>
        </section>
      </div>
    </div>
  );
}

function ActivityCard({ title, value, link, linkLabel }) {
  return (
    <div className="rounded-xl border border-[#2A2A2F] bg-[#18181C] p-4">
      <p className="text-sm text-[#A1A1AA]">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-[#F5F5F5]">{value}</p>
      <Link to={link} className="mt-3 inline-block text-sm text-[#C4B5FD] hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}
