import { useRef, useState } from 'react';
import { concatRoutes, randomInt, useSimulation, type Waypoint } from '../lib/simulation';
import { SimButton, SimFrame } from './SimFrame';
import { ArrowMarker, INK, INSET, MONO, MUTED, PAPER, PulseLayer, SIGNAL, SvgNode, Wire } from './svgKit';

const ROUTES: Record<'clientToGateway' | 'toSchedule' | 'toSeat' | 'toRabbit' | 'toTicket', Waypoint[]> = {
  clientToGateway: [
    { x: 49, y: 145, event: 'client' },
    { x: 88, y: 145 },
    { x: 122, y: 145 },
    { x: 170, y: 145, event: 'gateway' },
  ],
  toSchedule: [
    { x: 170, y: 145 },
    { x: 218, y: 145 },
    { x: 244, y: 145 },
    { x: 244, y: 62 },
    { x: 420, y: 62 },
    { x: 496, y: 62, event: 'schedule' },
  ],
  toSeat: [
    { x: 170, y: 145 },
    { x: 218, y: 145 },
    { x: 244, y: 145 },
    { x: 420, y: 145 },
    { x: 496, y: 145, event: 'seat' },
  ],
  toRabbit: [
    { x: 170, y: 145 },
    { x: 218, y: 145 },
    { x: 244, y: 145 },
    { x: 244, y: 236 },
    { x: 286, y: 236 },
    { x: 350, y: 236, event: 'rabbit' },
  ],
  toTicket: [
    { x: 350, y: 236 },
    { x: 414, y: 236 },
    { x: 440, y: 236 },
    { x: 506, y: 236, event: 'ticket' },
  ],
};

const QUEUE_SLOTS = 5;
const SEAT_ROWS = 'ABCD';

export function ShuttleSimulator() {
  const sim = useSimulation();
  const [queue, setQueue] = useState(0);
  const [issued, setIssued] = useState(0);
  const [scheduleLatency, setScheduleLatency] = useState<number | null>(null);
  const [seatLatency, setSeatLatency] = useState<number | null>(null);
  const queueRef = useRef(0);

  const enqueue = () => {
    queueRef.current += 1;
    setQueue(queueRef.current);
    return queueRef.current;
  };

  const dequeue = () => {
    queueRef.current = Math.max(0, queueRef.current - 1);
    setQueue(queueRef.current);
    return queueRef.current;
  };

  const ticketId = () => `TKT-${randomInt(1000, 9999)}`;

  const probeSchedule = (latency: number, suffix = '') =>
    sim.spawn(ROUTES.toSchedule, (event) => {
      sim.flash(event);
      if (event === 'schedule') {
        setScheduleLatency(latency);
        sim.pushLog(`REST: GET /schedule/BDG-JKT → 200 (${latency}ms)${suffix}`);
      }
    });

  const probeSeat = (latency: number, seat: string, suffix = '') =>
    sim.spawn(ROUTES.toSeat, (event) => {
      sim.flash(event);
      if (event === 'seat') {
        setSeatLatency(latency);
        sim.pushLog(`gRPC: SeatService.Check("${seat}") → AVAILABLE (${latency}ms)${suffix}`);
      }
    });

  const consumeTicket = (prefix = 'ISSUED') =>
    sim.spawn(ROUTES.toTicket, (event) => {
      sim.flash(event, 600);
      if (event === 'ticket') {
        const q = dequeue();
        setIssued((n) => n + 1);
        sim.pushLog(`TICKET: ${prefix} #${ticketId()} (ASYNC) · QUEUE=${q}`, 'accent');
      }
    });

  const handleBooking = () =>
    sim.run(async () => {
      const seat = `${randomInt(1, 12)}${SEAT_ROWS[randomInt(0, 3)]}`;

      await sim.spawn(ROUTES.clientToGateway, (event) => {
        sim.flash(event);
        if (event === 'client') sim.pushLog(`CLIENT: POST /api/booking {seat:"${seat}"}`);
        if (event === 'gateway') sim.pushLog('GATEWAY: AUTH OK · ROUTE → schedule-svc', 'muted');
      });
      await sim.wait(90);
      await probeSchedule(24);
      await sim.wait(90);
      await probeSeat(4, seat);
      await sim.wait(90);
      await sim.spawn(ROUTES.toRabbit, (event) => {
        sim.flash(event);
        if (event === 'rabbit') {
          const q = enqueue();
          sim.pushLog(`AMQP: PUBLISH ticket.issue → QUEUE=${q}`);
        }
      });
      sim.pushLog('GATEWAY: 202 ACCEPTED → CLIENT (28ms)', 'muted');
      await sim.wait(380);
      await consumeTicket();
    });

  const handleSurge = () =>
    sim.run(async () => {
      sim.pushLog('LOAD: 5 REQUEST SERENTAK → /api/booking', 'muted');

      const jobs: Promise<void>[] = [];
      for (let i = 0; i < 5; i++) {
        jobs.push(
          (async () => {
            await sim.wait(i * 120);
            await sim.spawn(concatRoutes(ROUTES.clientToGateway, ROUTES.toRabbit), (event) => {
              sim.flash(event);
              if (event === 'rabbit') {
                const q = enqueue();
                sim.pushLog(`AMQP: ENQUEUE REQ-0${i + 1} → QUEUE=${q}`);
              }
            });
          })()
        );
      }

      jobs.push(
        (async () => {
          await sim.wait(420);
          await Promise.all([
            probeSchedule(randomInt(22, 28), ' · RESPONSIF'),
            probeSeat(randomInt(3, 5), `${randomInt(1, 12)}A`, ' · RESPONSIF'),
          ]);
        })()
      );

      await Promise.all(jobs);
      await sim.wait(160);

      const probes: Promise<unknown>[] = [];
      let consumed = 0;
      while (queueRef.current > 0 && sim.isAlive()) {
        consumed += 1;
        if (consumed === 2 || consumed === 4) {
          probes.push(
            Promise.all([
              probeSchedule(randomInt(22, 28), ' · TETAP UP'),
              probeSeat(randomInt(3, 5), `${randomInt(1, 12)}B`, ' · TETAP UP'),
            ])
          );
        }
        await consumeTicket('CONSUME');
        await sim.wait(140);
      }
      await Promise.all(probes);

      sim.pushLog(`SISTEM: ${consumed}/5 TIKET TERBIT · 0 GAGAL · SCHEDULE & SEAT TETAP UP`, 'accent');
    });

  const latencyLabel = (value: number | null) => (value === null ? '-- ms' : `${value}ms`);

  return (
    <SimFrame
      fig="Fig 03 // Sim-Microservices"
      status={sim.running ? 'running' : 'idle'}
      log={sim.log}
      stats={[
        { label: 'Schedule Svc', value: `UP · ${latencyLabel(scheduleLatency)}` },
        { label: 'Seat Svc', value: `UP · ${latencyLabel(seatLatency)}` },
        { label: 'RabbitMQ', value: `Queue: ${queue}`, accent: queue > 0 },
        { label: 'Ticket Svc', value: `${issued} Terbit` },
      ]}
      controls={
        <>
          <SimButton label="Pesan Kursi" onClick={handleBooking} disabled={sim.running} />
          <SimButton
            label="Simulasi Lonjakan Trafik"
            onClick={handleSurge}
            disabled={sim.running}
            variant="secondary"
          />
        </>
      }
    >
      <svg
        viewBox="0 0 600 290"
        className="w-full h-auto block"
        role="img"
        aria-label="Simulator microservices: Client ke API Gateway di dalam Docker bridge network, bercabang ke Schedule Service via REST, Seat Service via gRPC, dan Ticket Service melalui antrean RabbitMQ"
      >
        <title>Simulator Topologi Microservices Shuttle Travel</title>
        <defs>
          <ArrowMarker id="shuttle-arrow" />
        </defs>

        <rect x={104} y={14} width={486} height={264} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="5 4" />
        <rect x={116} y={7} width={172} height={14} fill={INSET} />
        <text x={122} y={18} fontFamily={MONO} fontSize={10} fontWeight={600} letterSpacing="0.06em" fill={INK}>
          DOCKER BRIDGE NETWORK
        </text>

        <Wire points={[[88, 145], [122, 145]]} marker="shuttle-arrow" />
        <Wire points={[[218, 145], [244, 145]]} />
        <Wire points={[[244, 62], [244, 236]]} />
        <Wire points={[[244, 62], [420, 62]]} marker="shuttle-arrow" />
        <Wire points={[[244, 145], [420, 145]]} marker="shuttle-arrow" />
        <Wire points={[[244, 236], [286, 236]]} marker="shuttle-arrow" />
        <Wire points={[[414, 236], [440, 236]]} marker="shuttle-arrow" />

        <text x={256} y={55} fontFamily={MONO} fontSize={10} fontWeight={600} letterSpacing="0.06em" fill={INK}>REST</text>
        <text x={412} y={55} textAnchor="end" fontFamily={MONO} fontSize={10} letterSpacing="0.04em" fill={MUTED}>
          {latencyLabel(scheduleLatency)}
        </text>
        <text x={256} y={138} fontFamily={MONO} fontSize={10} fontWeight={600} letterSpacing="0.06em" fill={INK}>gRPC</text>
        <text x={412} y={138} textAnchor="end" fontFamily={MONO} fontSize={10} letterSpacing="0.04em" fill={MUTED}>
          {latencyLabel(seatLatency)}
        </text>
        <text x={250} y={229} fontFamily={MONO} fontSize={10} fontWeight={600} letterSpacing="0.06em" fill={INK}>AMQP</text>

        <SvgNode x={10} y={127} w={78} h={36} lines={['CLIENT']} lit={sim.isLit('client')} />
        <SvgNode x={122} y={121} w={96} h={48} lines={['API', 'GATEWAY']} lit={sim.isLit('gateway')} strong />
        <SvgNode x={420} y={40} w={152} h={44} lines={['SCHEDULE SVC', 'GET /schedule']} lit={sim.isLit('schedule')} />
        <SvgNode x={420} y={123} w={152} h={44} lines={['SEAT SVC', 'rpc CheckSeat']} lit={sim.isLit('seat')} />
        <SvgNode x={440} y={214} w={132} h={44} lines={['TICKET SVC', `TERBIT: ${issued}`]} lit={sim.isLit('ticket')} />

        <g>
          <rect
            x={286}
            y={206}
            width={128}
            height={60}
            fill={PAPER}
            stroke={sim.isLit('rabbit') ? SIGNAL : INK}
            strokeWidth={sim.isLit('rabbit') ? 2.25 : 1}
            style={{ transition: 'stroke 100ms linear' }}
          />
          <text
            x={350}
            y={224}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={11}
            fontWeight={600}
            letterSpacing="0.06em"
            fill={sim.isLit('rabbit') ? SIGNAL : INK}
          >
            RABBITMQ
          </text>
          {Array.from({ length: QUEUE_SLOTS }).map((_, i) => (
            <rect
              key={`slot-${i}`}
              x={302 + i * 20}
              y={230}
              width={16}
              height={12}
              fill={i < queue ? SIGNAL : PAPER}
              stroke={INK}
              strokeWidth={1}
              style={{ transition: 'fill 100ms linear' }}
            />
          ))}
          <text x={350} y={257} textAnchor="middle" fontFamily={MONO} fontSize={9.5} letterSpacing="0.04em" fill={MUTED}>
            QUEUE: {queue}
          </text>
        </g>

        <PulseLayer pulses={sim.pulses} />
      </svg>
    </SimFrame>
  );
}
