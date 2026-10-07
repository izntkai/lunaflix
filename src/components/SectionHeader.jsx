export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <header className="mb-6 space-y-2">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-[#C4B5FD]">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold text-[#F5F5F5] md:text-4xl">{title}</h1>
      {description ? <p className="max-w-3xl text-sm text-[#A1A1AA] md:text-base">{description}</p> : null}
    </header>
  );
}
