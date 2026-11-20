import { CASE_STUDIES, type CaseStudy, type CaseStudyId } from '../data/portfolio';
import { FtpSimulator } from './FtpSimulator';
import { SectionHeader } from './SectionHeader';
import { ShuttleSimulator } from './ShuttleSimulator';
import { SwasembadaDiagram } from './SwasembadaDiagram';

function CaseVisual({ id }: { id: CaseStudyId }) {
  switch (id) {
    case 'ftp':
      return <FtpSimulator />;
    case 'shuttle':
      return <ShuttleSimulator />;
    case 'swasembada':
      return <SwasembadaDiagram />;
  }
}

const DESCRIPTION_ROWS: Array<{ key: 'context' | 'approach' | 'result'; index: string; label: string }> = [
  { key: 'context', index: 'A', label: 'Konteks' },
  { key: 'approach', index: 'B', label: 'Pendekatan Teknis' },
  { key: 'result', index: 'C', label: 'Hasil' },
];

function CaseArticle({ study }: { study: CaseStudy }) {
  return (
    <article
      aria-labelledby={`${study.id}-title`}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)]"
    >
      <div className="bg-[#E8E6DF] border-b lg:border-b-0 lg:border-r border-[#111111]">
        <CaseVisual id={study.id} />
      </div>

      <div className="px-5 sm:px-8 lg:px-10 py-8 lg:py-10 flex flex-col">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em]">
          <span className="font-semibold text-[#FF3B00] mr-1.5">{study.code}</span>
          <span className="text-[#C8C5BC] mr-1.5" aria-hidden="true">
            |
          </span>
          {study.tags.map((tag) => (
            <span key={tag} className="border border-[#111111] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <h3 id={`${study.id}-title`} className="case-title mt-6 uppercase">
          {study.title}
        </h3>

        <dl className="mt-8 border-t border-[#111111]">
          {DESCRIPTION_ROWS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-1.5 sm:gap-5 py-4 border-b border-[#C8C5BC]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#55534D] sm:pt-1">
                <span className="text-[#FF3B00] mr-2">{row.index}</span>
                {row.label}
              </dt>
              <dd
                className={`text-[15px] leading-[1.7] ${
                  row.key === 'result' ? 'font-semibold text-[#111111]' : 'text-[#111111]'
                }`}
              >
                {study[row.key]}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-8">
          {study.repoUrl ? (
            <a
              href={study.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border border-[#111111] px-4 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#FF3B00] transition-colors duration-100"
            >
              <span>Buka Repositori GitHub</span>
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <p className="border border-[#C8C5BC] bg-[#E8E6DF] px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#55534D]">
              {study.privateStatus}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function CaseStudies() {
  return (
    <section
      id="studi-kasus"
      aria-labelledby="studi-kasus-heading"
      className="border-t border-[#111111] scroll-mt-11"
    >
      <SectionHeader
        index="01"
        title="Studi Kasus Pilihan & Arsitektur Sistem"
        meta={`${String(CASE_STUDIES.length).padStart(2, '0')} Entri · 02 Simulator`}
        headingId="studi-kasus-heading"
      />

      <div className="divide-y divide-[#111111]">
        {CASE_STUDIES.map((study) => (
          <CaseArticle key={study.id} study={study} />
        ))}
      </div>
    </section>
  );
}
