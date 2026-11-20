import { PORTFOLIO_LINKS } from '../data/portfolio';

const AVATAR_URL = 'https://avatars.githubusercontent.com/u/184733707?v=4';

const OPERATOR_SPECS: Array<[string, string]> = [
  ['Basis', 'Bandung, ID'],
  ['Prodi', 'D4 Teknik Informatika'],
  ['Fokus', 'TCP/IP · Microservices · Linux'],
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <div className="border-b md:border-b-0 md:border-r border-[#111111] px-5 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 flex flex-col justify-between gap-12">
        <div>
          <p className="flex items-start gap-2.5 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.06em]">
            <span className="led mt-[5px] w-2 h-2 shrink-0 bg-[#008A3C]" aria-hidden="true" />
            <span>Status: Terbuka untuk Magang Network Engineering / NOC</span>
          </p>

          <h1 id="hero-title" className="hero-title mt-10 sm:mt-14 uppercase">
            <span className="block">Samuel H.P.</span>
            <span className="block">Lumbantoruan</span>
          </h1>

          <p className="mt-8 max-w-[58ch] text-[16px] sm:text-[17px] leading-[1.65] text-[#55534D]">
            Mahasiswa D4 Teknik Informatika di Universitas Logistik dan Bisnis Internasional (ULBI)
            yang fokus pada pemrograman jaringan, komunikasi protokol antar-layanan, dan
            administrasi sistem Linux.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-flow-col lg:auto-cols-max w-full lg:w-fit border border-[#111111] divide-y lg:divide-y-0 lg:divide-x divide-[#111111] font-mono text-[12px] font-semibold uppercase tracking-[0.06em]">
          <a
            href="#studi-kasus"
            className="flex items-center justify-between gap-8 px-5 py-4 bg-[#111111] text-[#F2F1EC] hover:bg-[#FF3B00] hover:text-[#111111] transition-colors duration-100"
          >
            <span>Lihat Studi Kasus</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={PORTFOLIO_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-8 px-5 py-4 hover:bg-[#111111] hover:text-[#F2F1EC] transition-colors duration-100"
          >
            <span>GitHub @muelharr</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href={PORTFOLIO_LINKS.cv}
            className="flex items-center justify-between gap-8 px-5 py-4 bg-[#E8E6DF] text-[#55534D] hover:text-[#FF3B00] transition-colors duration-100"
          >
            <span>Unduh CV (PDF)</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <aside aria-label="Panel identitas operator" className="flex flex-col">
        <div className="px-5 py-3 border-b border-[#C8C5BC] flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.06em]">
          <span className="font-semibold">Fig 01 // Operator</span>
          <span className="text-[#55534D]">1:1</span>
        </div>

        <div className="p-5 flex-1 flex items-center">
          <img
            src={AVATAR_URL}
            alt="Foto profil Samuel H.P. Lumbantoruan"
            width={460}
            height={460}
            loading="eager"
            className="block w-full max-w-[420px] md:max-w-none mx-auto aspect-square object-cover grayscale contrast-125 border border-[#111111] bg-[#E8E6DF]"
          />
        </div>

        <dl className="border-t border-[#C8C5BC] divide-y divide-[#C8C5BC] font-mono text-[11px] uppercase tracking-[0.06em]">
          {OPERATOR_SPECS.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[64px_minmax(0,1fr)] gap-2 px-5 py-2.5">
              <dt className="text-[#55534D]">{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}
