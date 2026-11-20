import { useEffect, useRef, type ReactNode } from 'react';
import type { LogLine } from '../lib/simulation';

export interface SimStat {
  label: string;
  value: string;
  accent?: boolean;
}

interface SimFrameProps {
  fig: string;
  status: 'idle' | 'running' | 'static';
  children: ReactNode;
  controls?: ReactNode;
  stats?: SimStat[];
  log?: LogLine[];
  idleMessage?: string;
}

const STATUS_LABEL = {
  idle: 'Idle',
  running: 'Running',
  static: 'Statis',
} as const;

export function SimFrame({
  fig,
  status,
  children,
  controls,
  stats,
  log,
  idleMessage = 'Menunggu perintah. Tekan tombol simulasi di atas.',
}: SimFrameProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-stretch justify-between border-b border-[#111111] font-mono text-[11px] uppercase tracking-[0.06em]">
        <span className="px-4 py-2.5">{fig}</span>
        <span className="px-4 py-2.5 border-l border-[#111111] flex items-center gap-2 shrink-0">
          <span
            aria-hidden="true"
            className={`w-2 h-2 transition-colors duration-100 ${
              status === 'running' ? 'bg-[#FF3B00]' : 'bg-[#C8C5BC]'
            }`}
          />
          <span className={status === 'running' ? 'text-[#FF3B00]' : 'text-[#55534D]'}>
            {STATUS_LABEL[status]}
          </span>
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="sm:hidden px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.06em] text-[#55534D]">
          ← Geser diagram →
        </p>
        <div className="overflow-x-auto px-4 py-5 sm:px-6 sm:py-7">
          <div className="min-w-[480px] sm:min-w-0">{children}</div>
        </div>
      </div>

      {controls && (
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#111111] divide-y sm:divide-y-0 sm:divide-x divide-[#111111]">
          {controls}
        </div>
      )}

      {stats && stats.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#C8C5BC] border-t border-[#111111]">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#E8E6DF] px-4 py-2.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#55534D]">
                {stat.label}
              </dt>
              <dd
                className={`mt-0.5 font-mono text-[12px] font-semibold uppercase tracking-[0.04em] transition-colors duration-100 ${
                  stat.accent ? 'text-[#FF3B00]' : 'text-[#111111]'
                }`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {log && (
        <div className="border-t border-[#111111] bg-[#F2F1EC]">
          <div className="px-4 py-2 border-b border-[#C8C5BC] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-[#55534D]">
            <span>Telemetri Log</span>
            <span>{String(log.length).padStart(2, '0')} Evt</span>
          </div>
          <div
            ref={logRef}
            role="log"
            className="h-[172px] overflow-y-auto px-4 py-3 font-mono text-[11.5px] leading-[1.75]"
          >
            {log.length === 0 ? (
              <p className="text-[#55534D] uppercase tracking-[0.04em]">&gt; {idleMessage}</p>
            ) : (
              log.map((line) => (
                <p key={line.id} className="flex gap-3">
                  <span className="text-[#55534D] shrink-0 w-[54px] tabular-nums">{line.time}</span>
                  <span
                    className={`break-all ${
                      line.tone === 'accent'
                        ? 'text-[#FF3B00] font-semibold'
                        : line.tone === 'muted'
                          ? 'text-[#55534D]'
                          : 'text-[#111111]'
                    }`}
                  >
                    {line.text}
                  </span>
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SimButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function SimButton({ label, onClick, disabled = false, variant = 'primary' }: SimButtonProps) {
  const base =
    'w-full px-4 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-left sm:text-center transition-colors duration-100 disabled:bg-[#C8C5BC] disabled:text-[#55534D] disabled:cursor-not-allowed';
  const tone =
    variant === 'primary'
      ? 'bg-[#FF3B00] text-[#111111] enabled:hover:bg-[#111111] enabled:hover:text-[#F2F1EC]'
      : 'bg-[#F2F1EC] text-[#111111] enabled:hover:bg-[#FF3B00]';

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${tone}`}>
      [{label}]
    </button>
  );
}
