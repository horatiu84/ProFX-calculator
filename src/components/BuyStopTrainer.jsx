import React, { useRef, useState, useCallback, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * BuyStopTrainer (responsive + procent pentru rezistență)
 *
 * Props utile:
 *  - aspect: raport lățime/înălțime (ex: 16/11)
 *  - enableHaptics: vibrează când treci corect de rezistență (mobile)
 *  - resistance.mode = 'pct' | 'px'
 *    • pct:   folosește topPct/heightPct (0..1), cu override Mobile/Desktop
 *    • px:    folosește topY/height în pixeli (fallback la modul vechi)
 *
 *  Exemplu:
 *  <BuyStopTrainer
 *    resistance={{
 *      mode: 'pct',
 *      topPctDesktop: 0.18,
 *      heightPctDesktop: 0.12,
 *      topPctMobile: 0.26,
 *      heightPctMobile: 0.13,
 *    }}
 *  />
 */
export default function BuyStopTrainer({
  baseWidth = 720,              // fallback, lățimea reală vine din container
  aspect = 16 / 11,             // ajută pe mobile
  enableHaptics = true,
  resistance = {
    mode: "pct",
    topPctDesktop: 0.18,
    heightPctDesktop: 0.12,
    topPctMobile: 0.26,
    heightPctMobile: 0.13,
  },
}) {
  const { translations } = useLanguage();
  const t = translations;
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  // dimensiuni responsive
  const [width, setWidth] = useState(baseWidth);
  const height = Math.round(width / aspect);
  const isMobile = width < 560;

  // linia roșie
  const [lineY, setLineY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  // urmărește lățimea containerului
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(300, Math.floor(entry.contentRect.width));
        setWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = (y) => Math.max(20, Math.min(height - 20, y));

  const getSvgY = (evt) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    const touch = evt.touches?.[0];
    pt.x = (touch ? touch.clientX : evt.clientX) ?? 0;
    pt.y = (touch ? touch.clientY : evt.clientY) ?? 0;
    const ctm = svg.getScreenCTM();
    if (!ctm) return lineY;
    const { y } = pt.matrixTransform(ctm.inverse());
    return clamp(y);
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const onMove = useCallback(
    (e) => {
      if (!dragging) return;
      setLineY(getSvgY(e));
    },
    [dragging]
  );
  const onEnd = useCallback(() => setDragging(false), []);

  // calcul bandă rezistență (pct sau px) + padding orizontal
  const padX = Math.round(width * 0.08);
  const bandX = padX;
  const bandW = width - padX * 2;

  const getResistanceBand = () => {
    const r = resistance || {};
    if (r.mode === "pct") {
      const topPct =
        isMobile ? r.topPctMobile ?? r.topPct : r.topPctDesktop ?? r.topPct;
      const heightPct =
        isMobile ? r.heightPctMobile ?? r.heightPct : r.heightPctDesktop ?? r.heightPct;

      const top = Math.round(height * (topPct ?? 0.22));
      const h = Math.round(height * (heightPct ?? 0.12));
      return { top, h };
    }
    // modul vechi pe pixeli
    return { top: r.topY ?? 50, h: r.height ?? 60 };
  };

  const band = getResistanceBand();

  // setează linia inițial sub bandă (se recalculează la resize / breakpoint)
  useEffect(() => {
    const below = band.top + band.h + Math.round(height * 0.12);
    setLineY(Math.min(height - 40, below));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, band.top, band.h, isMobile]);

  const isCorrect = lineY < band.top;

  // haptics când devine corect
  useEffect(() => {
    if (!enableHaptics) return;
    if (isCorrect && !wasCorrect && "vibrate" in navigator) {
      navigator.vibrate?.(15);
    }
    setWasCorrect(isCorrect);
  }, [isCorrect, wasCorrect, enableHaptics]);

  // câteva lumânări demo (în procente din înălțime)
  const candles = [
    { xPct: 0.36, open: 0.72, close: 0.42, high: 0.30, low: 0.86, color: "green" },
    { xPct: 0.44, open: 0.76, close: 0.40, high: 0.28, low: 0.90, color: "red" },
    { xPct: 0.52, open: 0.65, close: 0.38, high: 0.25, low: 0.72, color: "green" },
    { xPct: 0.60, open: 0.58, close: 0.40, high: 0.24, low: 0.82, color: "red" },
    { xPct: 0.68, open: 0.56, close: 0.28, high: 0.19, low: 0.62, color: "green" },
  ];

  const Candle = ({ xPct, open, close, high, low, color }) => {
    const w = Math.max(12, Math.round(width * 0.025));
    const x = Math.round(xPct * width) - w / 2;
    const yOpen = Math.round(open * height);
    const yClose = Math.round(close * height);
    const yHigh = Math.round(high * height);
    const yLow = Math.round(low * height);
    const bodyY = Math.min(yOpen, yClose);
    const bodyH = Math.max(8, Math.abs(yOpen - yClose));
    return (
      <g>
        <line x1={x + w / 2} x2={x + w / 2} y1={yHigh} y2={yLow} stroke="#111" />
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={color} stroke="#111" />
      </g>
    );
  };

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "Inter, system-ui, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          paddingInline: 4,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "clamp(16px, 2.5vw, 20px)" }}>
          {t.buyStopTitle} : 
        </h3>
        {isCorrect && (
          <div
            role="status"
            style={{
              padding: "6px 10px",
              borderRadius: 12,
              background: "#16a34a",
              color: "white",
              fontWeight: 700,
              fontSize: "clamp(12px, 2.2vw, 14px)",
              whiteSpace: "nowrap",
            }}
          >
            {t.buyStopCorrect}
          </div>
        )}
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        {/* Bandă rezistență */}
        <rect
          x={bandX}
          y={band.top}
          width={bandW}
          height={band.h}
          fill="#f8c9c9"
          stroke="#caa"
          rx="6"
        />

        {/* lumânări demo */}
        {candles.map((c, i) => (
          <Candle key={i} {...c} />
        ))}

        {/* linia roșie (draggable) */}
        <line
          x1={bandX}
          x2={bandX + bandW}
          y1={lineY}
          y2={lineY}
          stroke="red"
          strokeWidth={2}
          style={{ cursor: "ns-resize" }}
          onMouseDown={onStart}
          onTouchStart={onStart}
        />
        {/* handler lat pentru touch */}
        <rect
          x={bandX}
          y={lineY - Math.max(12, height * 0.02)}
          width={bandW}
          height={Math.max(24, height * 0.04)}
          fill="transparent"
          onMouseDown={onStart}
          onTouchStart={onStart}
          style={{ cursor: "ns-resize" }}
        />

        {/* hint */}
        <text
          x={bandX + bandW - 4}
          y={Math.max(18, lineY - 10)}
          textAnchor="end"
          fontSize={Math.max(10, Math.round(width * 0.016))}
          fill="#333"
        >
          {t.buyStopDragHint}
        </text>
      </svg>

      <div
        style={{
          marginTop: 8,
          fontSize: "clamp(12px, 2.2vw, 14px)",
          color: "#969696",
          paddingInline: 4,
        }}
      >
        {t.buyStopDescription}
      </div>
    </div>
  );
}
