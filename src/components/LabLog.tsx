import { LAB_ENTRIES } from '../data/portfolio';
import { SectionHeader } from './SectionHeader';

const GRID_COLS = 'md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.6fr)_190px]';

export function LabLog() {
  return (
    <section id="lab" aria-labelledby="lab-heading" className="border-t border-[#111111] scroll-mt-11">
      <SectionHeader
        index="03"
        title="Log Lab & Proyek Pendukung"
        meta={`${String(LAB_ENTRIES.length).padStart(2, '0')} Baris Log`}
        headingId="lab-heading"
      />

      <div
        className={`hidden md:grid ${GRID_COLS} bg-[#E8E6DF] border-b border-[#111111] font-mono text-[11px] uppercase tracking-[0.06em] text-[#55534D]`}
        aria-hidden="true"
      >
        <span className="px-5 py-2.5">ID</span>
        <span className="px-5 py-2.5 border-l border-[#C8C5BC]">Entri</span>
        <span className="px-5 py-2.5 border-l border-[#C8C5BC]">Deskripsi</span>
        <span className="px-5 py-2.5 border-l border-[#C8C5BC]">Akses</span>
      </div>

      <ul className="divide-y divide-[#C8C5BC]">
        {LAB_ENTRIES.map((entry) => (
          <li
            key={entry.id}
            className={`grid grid-cols-1 ${GRID_COLS} gap-2 md:gap-0 p-5 md:p-0 hover:bg-[#E8E6DF] transition-colors duration-100`}
          >
            <span className="md:px-5 md:py-5 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-[#FF3B00]">
              [{entry.id}]
            </span>
            <h3 className="md:px-5 md:py-5 md:border-l border-[#C8C5BC] text-[16px] font-bold leading-[1.35] tracking-[-0.01em]">
              {entry.title}
            </h3>
            <p className="md:px-5 md:py-5 md:border-l border-[#C8C5BC] text-[15px] leading-[1.7] text-[#55534D]">
              {entry.description}
            </p>
            <div className="pt-2 md:pt-5 md:px-5 md:pb-5 md:border-l border-[#C8C5BC]">
              {entry.access.url ? (
                <a
                  href={entry.access.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-4 w-full border border-[#111111] px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-[#FF3B00] transition-colors duration-100"
                >
                  <span>[{entry.access.label}</span>
                  <span aria-hidden="true">→]</span>
                </a>
              ) : (
                <span className="inline-flex w-full border border-[#C8C5BC] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-[#55534D]">
                  [{entry.access.label}]
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
