import { SimFrame } from './SimFrame';
import { ArrowMarker, INSET, MONO, MUTED, SIGNAL, SvgNode, Wire, INK } from './svgKit';

const NODES: Array<{ x: number; step: string; label: string; lines: string[]; strong?: boolean }> = [
  { x: 12, step: 'S-01', label: 'INPUT', lines: ['DATA WILAYAH', '11 INDIKATOR'] },
  { x: 160, step: 'S-02', label: 'PROSES', lines: ['PREPROCESS', 'SCALER + RPK'] },
  { x: 308, step: 'S-03', label: 'MODEL', lines: ['RF · SVM', 'KLASIFIKASI'] },
  { x: 456, step: 'S-04', label: 'OUTPUT', lines: ['WEB PLATFORM', 'SURPLUS·DEFISIT'], strong: true },
];

const NODE_Y = 72;
const NODE_W = 118;
const NODE_H = 56;
const MID_Y = NODE_Y + NODE_H / 2;

export function SwasembadaDiagram() {
  return (
    <SimFrame
      fig="Fig 04 // Pipeline ML-Web"
      status="static"
      stats={[
        { label: 'Framework', value: 'CRISP-DM' },
        { label: 'Model', value: 'RF · SVM' },
        { label: 'Indikator', value: '11 Variabel' },
        { label: 'Wilayah', value: '4 Kab/Kota' },
      ]}
    >
      <svg
        viewBox="0 0 600 210"
        className="w-full h-auto block"
        role="img"
        aria-label="Diagram alur SWASEMBADAAI: Data wilayah 11 indikator menuju preprocessing scaler dan RPK, diklasifikasi model Random Forest dan SVM, lalu ditampilkan pada platform web regional"
      >
        <title>Diagram Pipeline SWASEMBADAAI</title>
        <defs>
          <ArrowMarker id="swasembada-arrow" />
        </defs>

        {NODES.slice(0, -1).map((node) => (
          <Wire
            key={`w-${node.step}`}
            points={[
              [node.x + NODE_W, MID_Y],
              [node.x + NODE_W + 30, MID_Y],
            ]}
            marker="swasembada-arrow"
          />
        ))}

        {NODES.map((node) => (
          <g key={node.step}>
            <text
              x={node.x}
              y={60}
              fontFamily={MONO}
              fontSize={10}
              fontWeight={600}
              letterSpacing="0.06em"
              fill={SIGNAL}
            >
              {node.step}
            </text>
            <text x={node.x + 36} y={60} fontFamily={MONO} fontSize={10} letterSpacing="0.06em" fill={INK}>
              {node.label}
            </text>
            <SvgNode
              x={node.x}
              y={NODE_Y}
              w={NODE_W}
              h={NODE_H}
              lines={node.lines}
              strong={node.strong}
            />
          </g>
        ))}

        <Wire
          points={[
            [515, NODE_Y + NODE_H],
            [515, 172],
            [71, 172],
            [71, NODE_Y + NODE_H],
          ]}
          marker="swasembada-arrow"
          dashed
          color={MUTED}
          width={1}
        />
        <rect x={153} y={164} width={280} height={16} fill={INSET} />
        <text x={293} y={176} textAnchor="middle" fontFamily={MONO} fontSize={10} letterSpacing="0.06em" fill={MUTED}>
          DASHBOARD · PETA REGIONAL · MODEL INSIGHT
        </text>
      </svg>
    </SimFrame>
  );
}
