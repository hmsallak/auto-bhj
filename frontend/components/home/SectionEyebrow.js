export default function SectionEyebrow({ children }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-[3px] w-6 rounded-full bg-ink" />
        <span className="h-[3px] w-3 rounded-full bg-brand" />
      </div>
      <p className="text-[13px] font-bold uppercase tracking-wide text-brand">{children}</p>
    </div>
  );
}
