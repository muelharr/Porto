import type { CSSProperties } from 'react';
import { COMPETENCY_COLUMNS } from '../data/portfolio';
import { SectionHeader } from './SectionHeader';

const MAX_ROWS = Math.max(...COMPETENCY_COLUMNS.map((col) => col.items.length));

/**
 * Spec table: DOM order is column-major (stacks naturally on mobile),
 * while on md+ each cell is placed explicitly so rows align across columns.
 */
export function Competencies() {
  const lastCol = COMPETENCY_COLUMNS.length - 1;

  return (
    <section
      id="kompetensi"
      aria-labelledby="kompetensi-heading"
      className="border-t border-[#111111] scroll-mt-11"
    >
      <SectionHeader
        index="02"
        title="Spesifikasi Kompetensi"
        meta="Tanpa skor · Daftar terverifikasi proyek"
        headingId="kompetensi-heading"
      />

      <div className="grid grid-cols-1 md:grid-cols-3">
        {COMPETENCY_COLUMNS.map((col, ci) => {
          const colStyle = { '--c': ci + 1 } as CSSProperties;
          const colBorder = ci > 0 ? 'md:border-l md:border-l-[#111111]' : '';

          return [
            <div
              key={`${col.index}-head`}
              style={{ ...colStyle, '--r': 1 } as CSSProperties}
              className={`md:[grid-column:var(--c)] md:[grid-row:var(--r)] bg-[#E8E6DF] px-5 sm:px-8 py-5 border-b border-[#111111] ${
                ci > 0 ? 'border-t md:border-t-0' : ''
              } ${colBorder}`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#FF3B00] font-semibold">
                Kolom {col.index}
              </p>
              <h3 className="mt-1 text-[18px] sm:text-[19px] font-bold uppercase tracking-[-0.02em] leading-[1.15]">
                {col.title}
              </h3>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#55534D]">
                {String(col.items.length).padStart(2, '0')} Entri
              </p>
            </div>,
            ...Array.from({ length: MAX_ROWS }).map((_, ri) => {
              const item = col.items[ri];
              const cellStyle = { ...colStyle, '--r': ri + 2 } as CSSProperties;
              const isLastRow = ri === MAX_ROWS - 1;
              const isLastMobileCell = ci === lastCol && ri === col.items.length - 1;

              if (!item) {
                return (
                  <div
                    key={`${col.index}-empty-${ri}`}
                    aria-hidden="true"
                    style={cellStyle}
                    className={`hidden md:flex md:[grid-column:var(--c)] md:[grid-row:var(--r)] items-center px-5 sm:px-8 py-4 border-[#C8C5BC] font-mono text-[12px] text-[#C8C5BC] ${
                      isLastRow ? '' : 'border-b'
                    } ${colBorder}`}
                  >
                    —
                  </div>
                );
              }

              return (
                <div
                  key={`${col.index}-${item}`}
                  style={cellStyle}
                  className={`md:[grid-column:var(--c)] md:[grid-row:var(--r)] flex items-baseline gap-4 px-5 sm:px-8 py-4 border-[#C8C5BC] hover:bg-[#E8E6DF] transition-colors duration-100 ${
                    isLastMobileCell ? 'md:border-b-0' : 'border-b'
                  } ${isLastRow ? 'md:border-b-0' : ''} ${colBorder}`}
                >
                  <span className="font-mono text-[11px] tracking-[0.06em] text-[#55534D] shrink-0 w-10">
                    {col.index}.{String(ri + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-[1.5]">{item}</span>
                </div>
              );
            }),
          ];
        })}
      </div>
    </section>
  );
}
