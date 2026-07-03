import { toScorePercent } from '@/types/review.types';
import type { JobRelevanceStats } from '@/types/review.types';

const RADAR_AXES = [
  { key: 'planning_avg_score', label: '기획' },
  { key: 'development_avg_score', label: '개발' },
  { key: 'marketing_avg_score', label: '마케팅' },
  { key: 'ai_avg_score', label: 'AI' },
  { key: 'design_avg_score', label: '디자인' },
] as const;

/**
 * 리뷰 직무연관성 오각형 레이더 차트.
 * SVG가 viewBox 기반이라 wrapper 크기에 맞춰 스케일됨 → PC는 고정 크기, 모바일은 w-full fill로 재사용.
 */
const JobRadarChart = ({ stats, className = 'h-[345px] w-[390px]' }: { stats: JobRelevanceStats | null; className?: string }) => {
  const CX = 170;
  const CY = 150;
  const R = 88;
  const LEVELS = 4;

  const angleAt = (i: number) => ((-90 + i * 72) * Math.PI) / 180;
  const pointAt = (i: number, radius: number) => ({
    x: CX + radius * Math.cos(angleAt(i)),
    y: CY + radius * Math.sin(angleAt(i)),
  });
  const CORNER = 13.85; // 오각형 모서리 둥글기
  const pointsOf = (radius: number) => RADAR_AXES.map((_, i) => pointAt(i, radius));

  // 둥근 모서리 폴리곤 path (각 꼭짓점을 corner 만큼 깎아 Q 베지어로 연결)
  const roundedPath = (pts: { x: number; y: number }[], corner: number) => {
    const n = pts.length;
    const unit = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      return { x: dx / len, y: dy / len };
    };
    let d = '';
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const half =
        Math.min(Math.hypot(prev.x - curr.x, prev.y - curr.y), Math.hypot(next.x - curr.x, next.y - curr.y)) / 2;
      const c = Math.min(corner, half);
      const toPrev = unit(curr, prev);
      const toNext = unit(curr, next);
      const a = { x: curr.x + toPrev.x * c, y: curr.y + toPrev.y * c };
      const b = { x: curr.x + toNext.x * c, y: curr.y + toNext.y * c };
      d += `${i === 0 ? 'M' : 'L'} ${a.x.toFixed(2)} ${a.y.toFixed(2)} `;
      d += `Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)} `;
    }
    return `${d}Z`;
  };

  const scoreOf = (key: (typeof RADAR_AXES)[number]['key']) =>
    stats ? toScorePercent(stats[key]) : 0;
  const dataPts = RADAR_AXES.map((axis, i) => {
    const ratio = Math.max(0, Math.min(1, scoreOf(axis.key) / 100));
    return pointAt(i, R * ratio);
  });

  // 동심 그리드(바깥→안) 4겹, 배경색을 번갈아 적용
  const gridFills = ['#F9FAFB', '#F3F4F6', '#F9FAFB', '#F3F4F6'];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 340 300" className="h-full w-full">
        {/* 1. 그리드 음영(채움) — 데이터 아래 */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const radius = (R * (LEVELS - level)) / LEVELS;
          return (
            <path
              key={`grid-fill-${level}`}
              d={roundedPath(pointsOf(radius), (CORNER * radius) / R)}
              fill={gridFills[level]}
              stroke="none"
            />
          );
        })}
        {/* 3. 그리드 오각형 윤곽선 */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const radius = (R * (LEVELS - level)) / LEVELS;
          return (
            <path
              key={`grid-line-${level}`}
              d={roundedPath(pointsOf(radius), (CORNER * radius) / R)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}
        {/* 4. 점선 축 — 데이터 위로 비치게 */}
        {RADAR_AXES.map((axis, i) => {
          const p = pointAt(i, R);
          return (
            <line
              key={axis.label}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="#D1D5DB"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
        {/* 5. 데이터 폴리곤 (초록) — 그리드·축 위(제일 위)에 렌더 */}
        <path
          d={roundedPath(dataPts, CORNER)}
          fill="#00BC7D"
          fillOpacity="0.7"
          stroke="#00BC7D"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {RADAR_AXES.map((axis, i) => {
          const base = pointAt(i, R + 30);
          const labelFirst = i === 0; // 상단(기획)만 라벨 위·숫자 아래
          return (
            <g key={`label-${axis.label}`}>
              <text
                x={base.x}
                y={labelFirst ? base.y + 8 : base.y - 4}
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill="#101828"
              >
                {scoreOf(axis.key)}
              </text>
              <text
                x={base.x}
                y={labelFirst ? base.y - 14 : base.y + 14}
                textAnchor="middle"
                fontSize="13"
                fontWeight="500"
                fill="#98A2B3"
              >
                {axis.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default JobRadarChart;
