interface SectionHeaderProps {
  index: string;
  title: string;
  meta?: string;
  headingId: string;
}

export function SectionHeader({ index, title, meta, headingId }: SectionHeaderProps) {
  return (
    <div className="border-b border-[#111111] px-5 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.06em]">
      <h2 id={headingId} className="font-semibold">
        <span className="text-[#FF3B00]">{index}</span>
        <span className="text-[#55534D] mx-2" aria-hidden="true">
          //
        </span>
        {title}
      </h2>
      {meta && <span className="hidden sm:block text-[#55534D] shrink-0">{meta}</span>}
    </div>
  );
}
