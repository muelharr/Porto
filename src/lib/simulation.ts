import { useCallback, useEffect, useRef, useState } from 'react';

export interface Waypoint {
  x: number;
  y: number;
  /** Fired once when the pulse reaches this waypoint. */
  event?: string;
}

export interface Pulse {
  id: number;
  x: number;
  y: number;
}

export type LogTone = 'default' | 'accent' | 'muted';

export interface LogLine {
  id: number;
  time: string;
  text: string;
  tone: LogTone;
}

interface Signal {
  cancelled: boolean;
}

/** Pulse travel speed in SVG viewBox units per millisecond. */
const BASE_SPEED = 0.36;

function animateRoute(
  route: Waypoint[],
  speed: number,
  signal: Signal,
  onMove: (x: number, y: number) => void,
  onEvent?: (event: string) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (route.length === 0 || signal.cancelled) {
      resolve();
      return;
    }

    if (route.length === 1) {
      onMove(route[0].x, route[0].y);
      if (route[0].event) onEvent?.(route[0].event);
      resolve();
      return;
    }

    const cumulative: number[] = [0];
    for (let i = 1; i < route.length; i++) {
      const dx = route[i].x - route[i - 1].x;
      const dy = route[i].y - route[i - 1].y;
      cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy));
    }
    const total = cumulative[cumulative.length - 1];

    let nextEvent = 0;
    let start: number | null = null;

    const step = (now: number) => {
      if (signal.cancelled) {
        resolve();
        return;
      }
      if (start === null) start = now;

      const distance = Math.min((now - start) * speed, total);

      let seg = 1;
      while (seg < route.length - 1 && cumulative[seg] < distance) seg++;

      const a = route[seg - 1];
      const b = route[seg];
      const segStart = cumulative[seg - 1];
      const segLen = cumulative[seg] - segStart;
      const t = segLen > 0 ? Math.min(Math.max((distance - segStart) / segLen, 0), 1) : 1;

      onMove(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

      while (nextEvent < route.length && cumulative[nextEvent] <= distance) {
        const ev = route[nextEvent].event;
        if (ev) onEvent?.(ev);
        nextEvent++;
      }

      if (distance >= total) {
        resolve();
      } else {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
}

/**
 * Small simulation engine: animated pulses along SVG routes, node highlight
 * ("lit") counters, a telemetry log, and a run-lock so repeated clicks can
 * never start overlapping runs.
 */
export function useSimulation(maxLog = 40) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [lit, setLit] = useState<Record<string, number>>({});
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);

  const runningRef = useRef(false);
  const signalRef = useRef<Signal>({ cancelled: false });
  const timersRef = useRef<Set<number>>(new Set());
  const pulseIdRef = useRef(0);
  const logIdRef = useRef(0);
  const runStartRef = useRef(0);

  useEffect(() => {
    const signal: Signal = { cancelled: false };
    signalRef.current = signal;
    const timers = timersRef.current;
    return () => {
      signal.cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      runningRef.current = false;
    };
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  }, []);

  const wait = useCallback(
    (ms: number) => new Promise<void>((resolve) => schedule(resolve, ms)),
    [schedule]
  );

  const flash = useCallback(
    (node: string, ms = 450) => {
      setLit((prev) => ({ ...prev, [node]: (prev[node] ?? 0) + 1 }));
      schedule(() => {
        setLit((prev) => {
          const next = { ...prev };
          const count = (next[node] ?? 1) - 1;
          if (count <= 0) delete next[node];
          else next[node] = count;
          return next;
        });
      }, ms);
    },
    [schedule]
  );

  const pushLog = useCallback(
    (text: string, tone: LogTone = 'default') => {
      const elapsed = (performance.now() - runStartRef.current) / 1000;
      const line: LogLine = {
        id: ++logIdRef.current,
        time: `+${elapsed.toFixed(2)}s`,
        text,
        tone,
      };
      setLog((prev) => [...prev, line].slice(-maxLog));
    },
    [maxLog]
  );

  const spawn = useCallback(async (route: Waypoint[], onEvent?: (event: string) => void) => {
    if (route.length === 0) return;
    const id = ++pulseIdRef.current;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setPulses((prev) => [...prev, { id, x: route[0].x, y: route[0].y }]);

    await animateRoute(
      route,
      reduced ? BASE_SPEED * 3 : BASE_SPEED,
      signalRef.current,
      (x, y) => setPulses((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p))),
      onEvent
    );

    setPulses((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const run = useCallback(async (task: () => Promise<void>) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    runStartRef.current = performance.now();
    setLog([]);
    const signal = signalRef.current;
    try {
      await task();
    } finally {
      if (!signal.cancelled) {
        runningRef.current = false;
        setRunning(false);
      }
    }
  }, []);

  const isAlive = useCallback(() => !signalRef.current.cancelled, []);
  const isLit = useCallback((node: string) => (lit[node] ?? 0) > 0, [lit]);

  return { pulses, log, running, run, spawn, flash, wait, pushLog, isAlive, isLit };
}

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1));
}

const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function randomToken(length: number) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];
  }
  return out;
}

/** Joins routes, dropping a duplicated junction point between consecutive routes. */
export function concatRoutes(...routes: Waypoint[][]): Waypoint[] {
  const out: Waypoint[] = [];
  for (const route of routes) {
    for (const point of route) {
      const last = out[out.length - 1];
      if (last && last.x === point.x && last.y === point.y && !point.event) continue;
      out.push(point);
    }
  }
  return out;
}
