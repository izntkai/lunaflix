export function HomeSkeleton() {
  return (
    <div className="bg-[#141414] min-h-screen animate-pulse">
      <div className="h-[80vh] bg-gray-800 w-full" />
      <div className="p-12 space-y-12 -mt-32 relative z-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-48 bg-gray-800 rounded" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="h-64 w-44 bg-gray-800 rounded-md flex-none" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
