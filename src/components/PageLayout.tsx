export default function PageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1
        className="
          text-2xl md:text-3xl font-semibold tracking-tight
         
        "
      >
        {title}
      </h1>

      {/* Content Container */}
      <div
        className="
          glass-soft rounded-2xl
          border border-[color:var(--glass-border)]
          shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          p-4 md:p-6
          transition-all
        "
      >
        {children}
      </div>
    </div>
  );
}
