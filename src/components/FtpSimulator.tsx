import { useRef, useState } from 'react';
import { randomBetween, randomInt, randomToken, useSimulation, type Waypoint } from '../lib/simulation';
import { SimButton, SimFrame } from './SimFrame';
import { ArrowMarker, GRID, INK, MONO, PulseLayer, SIGNAL, SvgNode, Wire } from './svgKit';

const CLIENT_Y = [75, 135, 195];
const THREAD_Y = [100, 155, 210];
const MAIN_Y = 135;

function buildRoute(clientIdx: number, threadIdx: number): Waypoint[] {
  const cy = CLIENT_Y[clientIdx];
  const ty = THREAD_Y[threadIdx];
  return [
    { x: 54, y: cy, event: 'client' },
    { x: 96, y: cy },
    { x: 108, y: cy },
    { x: 108, y: MAIN_Y },
    { x: 124, y: MAIN_Y },
    { x: 170, y: MAIN_Y, event: 'gzip' },
    { x: 216, y: MAIN_Y },
    { x: 240, y: MAIN_Y },
    { x: 286, y: MAIN_Y, event: 'fernet' },
    { x: 332, y: MAIN_Y },
    { x: 356, y: MAIN_Y },
    { x: 402, y: MAIN_Y, event: 'tcp' },
    { x: 448, y: MAIN_Y },
    { x: 460, y: MAIN_Y },
    { x: 460, y: ty },
    { x: 482, y: ty },
    { x: 529, y: ty, event: 'thread' },
  ];
}

const STAGES: Array<[string, number]> = [
  ['01', 124],
  ['02', 240],
  ['03', 356],
];

export function FtpSimulator() {
  const sim = useSimulation();
  const [packets, setPackets] = useState(0);
  const [savedKb, setSavedKb] = useState(0);
  const [threadReq, setThreadReq] = useState([0, 0, 0]);
  const roundRobinRef = useRef(0);

  const sendPacket = (clientIdx: number, threadIdx: number, prefix = '') => {
    const raw = randomBetween(32, 64);
    const ratio = randomBetween(0.66, 0.74);
    const compressed = raw * (1 - ratio);
    const token = `gAAAAABk${randomToken(6)}...`;
    const seq = randomInt(10000, 99999);

    return sim.spawn(buildRoute(clientIdx, threadIdx), (event) => {
      switch (event) {
        case 'client':
          sim.flash(`client-${clientIdx}`);
          sim.pushLog(`${prefix}RAW: ${raw.toFixed(1)} KB`);
          break;
        case 'gzip':
          sim.flash('gzip');
          sim.pushLog(`${prefix}GZIP: ${compressed.toFixed(1)} KB (-${Math.round(ratio * 100)}%)`);
          break;
        case 'fernet':
          sim.flash('fernet');
          sim.pushLog(`${prefix}FERNET: ${token}`);
          break;
        case 'tcp':
          sim.flash('tcp');
          sim.pushLog(`${prefix}TCP: SEND → :2121 · SEQ=${seq}`);
          break;
        case 'thread':
          sim.flash(`thread-${threadIdx}`, 700);
          sim.pushLog(`${prefix}ACK: THREAD-0${threadIdx + 1} OK`, 'accent');
          setPackets((n) => n + 1);
          setSavedKb((s) => s + raw - compressed);
          setThreadReq((prev) => prev.map((v, i) => (i === threadIdx ? v + 1 : v)));
          break;
      }
    });
  };

  const handleSingle = () =>
    sim.run(async () => {
      const idx = roundRobinRef.current % 3;
      roundRobinRef.current += 1;
      sim.pushLog(`SESSION: CLIENT-${idx + 1} → SERVER :2121`, 'muted');
      await sendPacket(idx, idx);
    });

  const handleParallel = () =>
    sim.run(async () => {
      sim.pushLog('SERVER: LISTEN :2121 · 3 KONEKSI MASUK', 'muted');
      await Promise.all(
        [0, 1, 2].map(async (i) => {
          await sim.wait(i * 170);
          await sendPacket(i, i, `C${i + 1} › `);
        })
      );
      sim.pushLog('SERVER: 3/3 SELESAI PARALEL · NON-BLOCKING', 'accent');
    });

  return (
    <SimFrame
      fig="Fig 02 // Sim-FTP Pipeline"
      status={sim.running ? 'running' : 'idle'}
      log={sim.log}
      stats={[
        { label: 'Paket Terkirim', value: String(packets).padStart(3, '0') },
        { label: 'Bandwidth Hemat', value: `${savedKb.toFixed(1)} KB`, accent: packets > 0 },
        { label: 'Enkripsi', value: 'Fernet' },
        { label: 'Port', value: ':2121' },
      ]}
      controls={
        <>
          <SimButton label="Kirim 1 Paket" onClick={handleSingle} disabled={sim.running} />
          <SimButton
            label="Simulasi 3 Client Paralel"
            onClick={handleParallel}
            disabled={sim.running}
            variant="secondary"
          />
        </>
      }
    >
      <svg
        viewBox="0 0 600 262"
        className="w-full h-auto block"
        role="img"
        aria-label="Simulator pipeline FTP: paket dari client dikompresi Gzip, dienkripsi Fernet, dikirim lewat TCP socket ke server multi-thread"
      >
        <title>Simulator Pipeline FTP Multi-Client Terenkripsi</title>
        <defs>
          <ArrowMarker id="ftp-arrow" />
        </defs>

        {CLIENT_Y.map((cy) => (
          <Wire key={`cw-${cy}`} points={[[96, cy], [108, cy]]} />
        ))}
        <Wire points={[[108, 75], [108, 195]]} />
        <Wire points={[[108, MAIN_Y], [124, MAIN_Y]]} marker="ftp-arrow" />
        <Wire points={[[216, MAIN_Y], [240, MAIN_Y]]} marker="ftp-arrow" />
        <Wire points={[[332, MAIN_Y], [356, MAIN_Y]]} marker="ftp-arrow" />
        <Wire points={[[448, MAIN_Y], [460, MAIN_Y]]} />
        <Wire points={[[460, 100], [460, 210]]} />
        {THREAD_Y.map((ty) => (
          <Wire key={`tw-${ty}`} points={[[460, ty], [482, ty]]} marker="ftp-arrow" />
        ))}

        {CLIENT_Y.map((cy, i) => (
          <SvgNode
            key={`client-${cy}`}
            x={12}
            y={cy - 15}
            w={84}
            h={30}
            lines={[`CLIENT ${i + 1}`]}
            lit={sim.isLit(`client-${i}`)}
          />
        ))}

        {STAGES.map(([label, x]) => (
          <text
            key={label}
            x={x}
            y={105}
            fontFamily={MONO}
            fontSize={10}
            fontWeight={600}
            letterSpacing="0.06em"
            fill={SIGNAL}
          >
            {label}
          </text>
        ))}

        <SvgNode x={124} y={113} w={92} h={44} lines={['GZIP', 'COMPRESS']} lit={sim.isLit('gzip')} />
        <SvgNode x={240} y={113} w={92} h={44} lines={['FERNET', 'AES-128']} lit={sim.isLit('fernet')} />
        <SvgNode x={356} y={113} w={92} h={44} lines={['TCP', 'SOCKET']} lit={sim.isLit('tcp')} />

        <rect x={470} y={20} width={118} height={226} fill="none" stroke={INK} strokeWidth={1.5} />
        <text x={529} y={40} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} letterSpacing="0.06em" fill={INK}>
          THREADED
        </text>
        <text x={529} y={54} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} letterSpacing="0.06em" fill={INK}>
          SERVER
        </text>
        <line x1={470} y1={64} x2={588} y2={64} stroke={GRID} strokeWidth={1} />

        {THREAD_Y.map((ty, i) => (
          <SvgNode
            key={`thread-${ty}`}
            x={482}
            y={ty - 18}
            w={94}
            h={36}
            lines={[`THREAD-0${i + 1}`, `REQ ${threadReq[i]}`]}
            lit={sim.isLit(`thread-${i}`)}
          />
        ))}

        <PulseLayer pulses={sim.pulses} />
      </svg>
    </SimFrame>
  );
}
