import type { Pulse } from '../lib/simulation';

export const INK = '#111111';
export const MUTED = '#55534D';
export const PAPER = '#F2F1EC';
export const INSET = '#E8E6DF';
export const GRID = '#C8C5BC';
export const SIGNAL = '#FF3B00';
export const MONO = 'JetBrains Mono, ui-monospace, monospace';

export function ArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="8"
      markerHeight="8"
      markerUnits="userSpaceOnUse"
      orient="auto"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={INK} />
    </marker>
  );
}

interface WireProps {
  points: Array<[number, number]>;
  marker?: string;
  dashed?: boolean;
  color?: string;
  width?: number;
}

export function Wire({ points, marker, dashed = false, color = INK, width = 1.5 }: WireProps) {
  return (
    <polyline
      points={points.map(([x, y]) => `${x},${y}`).join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? '5 4' : undefined}
      strokeLinejoin="miter"
      markerEnd={marker ? `url(#${marker})` : undefined}
    />
  );
}

interface SvgNodeProps {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  lit?: boolean;
  strong?: boolean;
}

export function SvgNode({ x, y, w, h, lines, lit = false, strong = false }: SvgNodeProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const primaryFill = lit ? SIGNAL : INK;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={PAPER}
        stroke={lit ? SIGNAL : INK}
        strokeWidth={lit ? 2.25 : strong ? 1.5 : 1}
        style={{ transition: 'stroke 100ms linear, stroke-width 100ms linear' }}
      />
      {lines.length === 1 ? (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={11}
          fontWeight={600}
          letterSpacing="0.06em"
          fill={primaryFill}
          style={{ transition: 'fill 100ms linear' }}
        >
          {lines[0]}
        </text>
      ) : (
        <>
          <text
            x={cx}
            y={cy - 3}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={11}
            fontWeight={600}
            letterSpacing="0.06em"
            fill={primaryFill}
            style={{ transition: 'fill 100ms linear' }}
          >
            {lines[0]}
          </text>
          <text
            x={cx}
            y={cy + 11}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={9.5}
            letterSpacing="0.04em"
            fill={MUTED}
          >
            {lines[1]}
          </text>
        </>
      )}
    </g>
  );
}

export function PulseLayer({ pulses }: { pulses: Pulse[] }) {
  return (
    <g aria-hidden="true">
      {pulses.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r={5} fill={SIGNAL} stroke={INK} strokeWidth={1} />
      ))}
    </g>
  );
}
