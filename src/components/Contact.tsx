import { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_LINKS } from '../data/portfolio';

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopy = async () => {
    const ok = await copyText(PORTFOLIO_LINKS.email);
    if (!ok) return;
    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="kontak"
      aria-labelledby="kontak-heading"
      className="bg-[#111111] text-[#F2F1EC] border-t border-[#111111] scroll-mt-11"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <p className="font-mono text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.06em] text-[#FF3B00]">
          04 // Koneksi &amp; Penugasan
        </p>

        <h2 id="kontak-heading" className="contact-title mt-6 max-w-[17ch]">
          Terbuka untuk Magang Network Engineering &amp; NOC.
        </h2>

        <p className="mt-6 max-w-[58ch] text-[16px] sm:text-[17px] leading-[1.65] text-[#C8C5BC]">
          Siap berkontribusi dalam pemeliharaan jaringan, pemrograman protokol, maupun operasional
          infrastruktur IT. Hubungi langsung via email atau tinjau kode di GitHub.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1fr)] border border-[#F2F1EC] divide-y lg:divide-y-0 lg:divide-x divide-[#F2F1EC] font-mono text-[12px] font-semibold uppercase tracking-[0.06em]">
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className={`text-left px-5 py-5 break-all transition-colors duration-100 ${
              copied ? 'text-[#FF3B00]' : 'hover:bg-[#FF3B00] hover:text-[#111111]'
            }`}
          >
            {copied ? (
              '[Email Tersalin ✓]'
            ) : (
              <>
                [Salin Email: <span className="normal-case">{PORTFOLIO_LINKS.email}</span>]
              </>
            )}
          </button>

          <a
            href={PORTFOLIO_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 px-5 py-5 hover:bg-[#FF3B00] hover:text-[#111111] transition-colors duration-100"
          >
            <span>GitHub (@muelharr)</span>
            <span aria-hidden="true">↗</span>
          </a>

          <a
            href={PORTFOLIO_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 px-5 py-5 hover:bg-[#FF3B00] hover:text-[#111111] transition-colors duration-100"
          >
            <span>LinkedIn</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2A2A2A] px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-[#C8C5BC]">
      <span>Samuel H.P. Lumbantoruan // D4 Teknik Informatika ULBI</span>
      <span>Bandung, Indonesia // 2026</span>
    </footer>
  );
}
