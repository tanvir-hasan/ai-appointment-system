export function PageLoader() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="relative">
        {/* outer ring */}
        <div className="h-20 w-20 rounded-full border-4 border-zinc-800" />

        {/* animated ring */}
        <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-indigo-500 border-r-violet-500" />

        {/* glow */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl" />
      </div>
    </div>
  );
}