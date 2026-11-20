import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/portfolio';

const wibFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function useWibClock() {
  const [time, setTime] = useState(() => wibFormatter.format(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(wibFormatter.format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function TopBar() {
  const time = useWibClock();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F2F1EC] border-b border-[#111111]">
      <div className="relative h-11 flex items-stretch justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.06em]">
        <div className="flex items-stretch">
          <span className="hidden sm:flex items-center px-4 lg:px-5 border-r border-[#111111] text-[#55534D]">
            DOC-ID: MHR-NET-2026
          </span>
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 lg:px-5 border-r border-[#111111] font-semibold hover:bg-[#FF3B00] transition-colors duration-100"
          >
            MUELHARR
          </a>
        </div>

        <div
          className="hidden md:flex flex-1 items-center justify-center gap-3"
          aria-label="Waktu lokal Bandung (WIB)"
        >
          <span className="text-[#55534D]">Bandung, ID</span>
          <time className="tabular-nums font-semibold">{time}</time>
          <span>WIB</span>
        </div>

        <nav aria-label="Navigasi utama" className="hidden lg:flex items-stretch">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2 px-4 xl:px-5 border-l border-[#111111] hover:bg-[#FF3B00] transition-colors duration-100"
            >
              <span className="text-[#FF3B00] group-hover:text-[#111111] transition-colors duration-100">
                {item.index}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden flex items-center px-4 border-l border-[#111111] font-semibold hover:bg-[#FF3B00] transition-colors duration-100"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Tutup [–]' : 'Menu [+]'}
        </button>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Navigasi mobile"
            className="lg:hidden absolute top-full left-0 right-0 bg-[#F2F1EC] border-y border-[#111111] divide-y divide-[#C8C5BC]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FF3B00] transition-colors duration-100"
              >
                <span className="text-[#FF3B00]">{item.index}</span>
                <span>{item.label}</span>
              </a>
            ))}
            <div className="md:hidden flex items-center gap-3 px-5 py-3 text-[#55534D]">
              <span>Bandung, ID</span>
              <time className="tabular-nums text-[#111111]">{time}</time>
              <span>WIB</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
