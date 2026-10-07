export function HomeSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#050505] pb-16">
      <div className="mx-4 mt-6 h-[58vh] rounded-3xl bg-[#18181C] md:mx-10" />
      <div className="mt-8 space-y-8 px-4 md:px-10">
        {[1, 2, 3, 4].map((section) => (
          <div key={section} className="space-y-4">
            <div className="h-6 w-52 rounded bg-[#18181C]" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-60 w-40 rounded-2xl bg-[#18181C]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
