import React, { useRef, useState, useCallback, useEffect } from "react";

/**
 * BuyTPSLTrainer (responsive + procent pentru zona de BUY + axă de preț și delte față de baza zonei)
 *
 * Îmbunătățiri pentru interactivitate și claritate:
 *  - Ghid pas cu pas: un tutorial simplu cu pași afișați deasupra graficului.
 *  - Feedback vizual: săgeți și texte explicative care apar când muți liniile.
 *  - Calcul profit/risc: afișează potențialul profit și risc în timp real sub grafic.
 *  - Buton de ajutor: deschide un modal cu explicații detaliate.
 *  - Animații ușoare: când plasezi corect, linia pulsează ușor.
 *  - Mod SELL: un switch pentru a schimba între BUY și SELL, ajustând logica.
 */
export default function BuyTPSLTrainer({
  baseWidth = 720,
  aspect = 16 / 11,
  enableHaptics = true,
  entryZone = {
    mode: "pct",
    topPctDesktop: 0.40,
    heightPctDesktop: 0.01,
    topPctMobile: 0.46,
    heightPctMobile: 0.01,
  },
  basePrice = 3340,
  priceRange = 30,
}) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  // dimensiuni responsive
  const [width, setWidth] = useState(baseWidth);
  const height = Math.round(width / aspect);
  const isMobile = width < 560;

  // mod: BUY sau SELL
  const [mode, setMode] = useState("BUY"); // implicit BUY

  // linii TP/SL
  const [tpY, setTpY] = useState(0);
  const [slY, setSlY] = useState(0);
  const [dragging, setDragging] = useState(null); // 'tp' | 'sl' | null
  const [tpWasOk, setTpWasOk] = useState(false);
  const [slWasOk, setSlWasOk] = useState(false);

  // tutorial steps
  const [tutorialStep, setTutorialStep] = useState(0);

  // modal ajutor
  const [showHelp, setShowHelp] = useState(false);

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
    if (!ctm) return 0;
    const { y } = pt.matrixTransform(ctm.inverse());
    return clamp(y);
  };

  const onStart = useCallback((type) => (e) => {
    e.preventDefault();
    setDragging(type);
  }, []);
  const onMove = useCallback(
    (e) => {
      if (!dragging) return;
      const y = getSvgY(e);
      if (dragging === "tp") setTpY(y);
      if (dragging === "sl") setSlY(y);
    },
    [dragging]
  );
  const onEnd = useCallback(() => setDragging(null), []);

  // calcul zonă de intrare + padding orizontal
  const padX = Math.round(width * (isMobile ? 0.04 : 0.08));
  const axisW = isMobile ? 40 : 54;
  const zoneX = padX + axisW;
  const zoneW = width - padX * 2 - axisW;

  const getEntryZone = () => {
    const r = entryZone || {};
    if (r.mode === "pct" || !r.mode) {
      const topPct = isMobile ? r.topPctMobile ?? r.topPct : r.topPctDesktop ?? r.topPct;
      const heightPct = isMobile ? r.heightPctMobile ?? r.heightPct : r.heightPctDesktop ?? r.heightPct;
      const top = Math.round(height * (topPct ?? 0.40));
      const h = Math.round(height * (heightPct ?? 0.12));
      return { top, h };
    }
    return { top: r.topY ?? 200, h: r.height ?? 60 };
  };

  const zone = getEntryZone();
  const zoneMidY = zone.top + zone.h / 2;

  // mapare Y -> preț
  const unitsPerPixel = priceRange / height;
  const priceAtY = (y) => {
    const v = basePrice - (y - zoneMidY) * unitsPerPixel;
    return Math.round(v * 100) / 100;
  };
  const deltaFromBase = (y) => {
    const d = priceAtY(y) - basePrice;
    return Math.round(d * 100) / 100;
  };
  const fmt = (n) => n.toFixed(2);
  const fmtDelta = (d) => `${d > 0 ? "+" : ""}${fmt(d)}`;

  // poziții inițiale (în zona de intrare)
  useEffect(() => {
    const tpInit = clamp(zone.top + Math.round(zone.h / 4));
    const slInit = clamp(zone.top + Math.round(zone.h * 3 / 4));
    setTpY(tpInit);
    setSlY(slInit);
    setTpWasOk(false);
    setSlWasOk(false);
    setTutorialStep(0);
  }, [height, zone.top, zone.h, isMobile, mode]); // reset la schimbare mod

  // condiții corecte depind de mod (BUY/SELL)
  const isBuy = mode === "BUY";
  const tpOk = isBuy ? tpY < zone.top : tpY > zone.top + zone.h;
  const slOk = isBuy ? slY > zone.top + zone.h : slY < zone.top;
  const bothOk = tpOk && slOk;

  // avansează tutorial
  useEffect(() => {
    if (tpOk && tutorialStep === 0) setTutorialStep(1);
    if (slOk && tutorialStep === 1) setTutorialStep(2);
    if (bothOk && tutorialStep === 2) setTutorialStep(3);
  }, [tpOk, slOk, bothOk, tutorialStep]);

  // haptics
  useEffect(() => {
    if (!enableHaptics || !("vibrate" in navigator)) return;
    if (tpOk && !tpWasOk) navigator.vibrate?.(12);
    if (slOk && !slWasOk) navigator.vibrate?.([10, 40, 10]);
    setTpWasOk(tpOk);
    setSlWasOk(slOk);
  }, [tpOk, slOk, tpWasOk, slWasOk, enableHaptics]);

  // calcul profit/risc (simplu, asumând entry la basePrice, unități arbitrare)
  const entryPrice = basePrice;
  const tpPrice = priceAtY(tpY);
  const slPrice = priceAtY(slY);
  const profit = isBuy ? tpPrice - entryPrice : entryPrice - tpPrice;
  const risk = isBuy ? entryPrice - slPrice : slPrice - entryPrice;
  const rrRatio = risk !== 0 ? (profit / risk).toFixed(2) : "∞";

  // conversie în pips (1$ = 10 pips)
  const pipsPerDollar = 10;
  const profitPips = fmt((profit > 0 ? profit : 0) * pipsPerDollar);
  const riskPips = fmt((risk > 0 ? risk : 0) * pipsPerDollar);

  // lumânări demo (ajustate pentru a semăna cu graficul XAUUSD)
  const candles = [
   
    { xPct: 0.20, open: 0.60, close: 0.62, high: 0.63, low: 0.59, color: "red" }, // small green
    { xPct: 0.25, open: 0.62, close: 0.58, high: 0.62, low: 0.57, color: "green" }, // red down
    { xPct: 0.30, open: 0.58, close: 0.50, high: 0.58, low: 0.48, color: "green" }, // bigger red
    { xPct: 0.35, open: 0.50, close: 0.55, high: 0.56, low: 0.49, color: "red" }, // green up
    { xPct: 0.40, open: 0.55, close: 0.52, high: 0.55, low: 0.51, color: "green" }, // small red
    { xPct: 0.45, open: 0.52, close: 0.48, high: 0.52, low: 0.47, color: "green" }, // red down
    { xPct: 0.50, open: 0.48, close: 0.60, high: 0.62, low: 0.47, color: "red" }, // big green up
    { xPct: 0.55, open: 0.60, close: 0.55, high: 0.61, low: 0.54, color: "green" }, // red down
    { xPct: 0.60, open: 0.55, close: 0.55, high: 0.67, low: 0.54, color: "green" }, // big green up
    { xPct: 0.65, open: 0.65, close: 0.50, high: 0.66, low: 0.48, color: "red" }, // big red down
    { xPct: 0.70, open: 0.55, close: 0.52, high: 0.53, low: 0.49, color: "green" }, // small green
    { xPct: 0.75, open: 0.52, close: 0.45, high: 0.52, low: 0.44, color: "red" }, // red down
    { xPct: 0.80, open: 0.45, close: 0.55, high: 0.56, low: 0.44, color: "green" }, // green up
    { xPct: 0.85, open: 0.55, close: 0.50, high: 0.55, low: 0.49, color: "red" }, // red down
  ];

  const Candle = ({ xPct, open, close, high, low, color }) => {
    const w = Math.max(8, Math.round(width * 0.012)); // mai înguste pentru mai multe lumânări
    const x = Math.round(xPct * width) - w / 2;
    const yOpen = Math.round(open * height);
    const yClose = Math.round(close * height);
    const yHigh = Math.round(high * height);
    const yLow = Math.round(low * height);
    const bodyY = Math.min(yOpen, yClose);
    const bodyH = Math.max(4, Math.abs(yOpen - yClose));
    return (
      <g>
        <line x1={x + w / 2} x2={x + w / 2} y1={yHigh} y2={yLow} stroke="#111" />
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={color === "green" ? "#22c55e" : "#ef4444"} stroke="#111" />
      </g>
    );
  };

  // etichete
  const labelW = isMobile ? 130 : 168;
  const labelH = isMobile ? 24 : 32;
  const labelRx = isMobile ? 8 : 10;
  const fontTitle = isMobile ? 9 : 11;
  const fontPrice = isMobile ? 9 : 11;
  const titleY = isMobile ? -1 : -2;
  const priceY = isMobile ? 10 : 12;
  const labelInset = isMobile ? 70 : 90;

  const LabelChip = ({ x, y, title, price, delta, bg }) => (
    <g>
      <rect x={x - labelW / 2} y={y - labelH / 2} width={labelW} height={labelH} rx={labelRx} fill={bg} opacity={0.95} />
      <text x={x} y={y + titleY} textAnchor="middle" fontSize={fontTitle} fontWeight={800} fill="#fff">
        {title}
      </text>
      <text x={x} y={y + priceY} textAnchor="middle" fontSize={fontPrice} fontWeight={700} fill="#fff">
        {fmt(price)} ({fmtDelta(delta * pipsPerDollar)} pips)
      </text>
    </g>
  );

  // axa de preț
  const axisTicks = 8;
  const ticks = Array.from({ length: axisTicks + 1 }, (_, i) => {
    const y = Math.round((i / axisTicks) * height);
    const p = priceAtY(y);
    return { y, p };
  });

  // animație puls pentru linii corecte
  const pulseAnim = bothOk ? "pulse 1s infinite" : "none";
  const keyframes = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `;

  // tutorial steps dynamic based on mode
  const tutorialSteps = [
    `Pas 1: Pentru un ${mode}, plasează TP ${isBuy ? 'deasupra' : 'sub'} zonei de intrare (preț ${isBuy ? 'mai mare' : 'mai mic'}).`,
    `Pas 2: Plasează SL ${isBuy ? 'sub' : 'deasupra'} zona de intrare (preț ${isBuy ? 'mai mic' : 'mai mare'}).`,
    "Pas 3: Observă calculul de profit și risc în timp real.",
    `Felicitări! Ai plasat corect. Încearcă modul ${isBuy ? 'SELL' : 'BUY'}.`,
  ];

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "Inter, system-ui, Arial, sans-serif",
        position: "relative",
      }}
    >
      <style>{keyframes}</style>

      {/* Switch mod BUY/SELL */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <button
          onClick={() => setMode("BUY")}
          style={{
            padding: "6px 12px",
            borderRadius: "10px 0 0 10px",
            background: mode === "BUY" ? "#2563eb" : "#fff",
            color: mode === "BUY" ? "#fff" : "#2563eb",
            border: "1px solid #2563eb",
            cursor: "pointer",
          }}
        >
          BUY
        </button>
        <button
          onClick={() => setMode("SELL")}
          style={{
            padding: "6px 12px",
            borderRadius: "0 10px 10px 0",
            background: mode === "SELL" ? "#dc2626" : "#fff",
            color: mode === "SELL" ? "#fff" : "#dc2626",
            border: "1px solid #dc2626",
            cursor: "pointer",
          }}
        >
          SELL
        </button>
      </div>

      {/* Tutorial */}
      <div
        style={{
          background: "#f3f4f6",
          padding: 8,
          borderRadius: 8,
          marginBottom: 8,
          textAlign: "center",
          fontSize: "clamp(12px, 2vw, 14px)",
          color: "#333",
        }}
      >
        {tutorialSteps[tutorialStep]}
      </div>

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
        <div
          style={{
            display: "flex",
            flexDirection: isMobile && bothOk ? "column" : "row",
            alignItems: isMobile && bothOk ? "flex-start" : "center",
            gap: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "clamp(16px, 2.5vw, 20px)" }}>
            Plasează corect TP & SL (poziție {mode})
          </h3>
          {bothOk && (
            <div
              role="status"
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                background: "#16a34a",
                color: "#fff",
                fontWeight: 700,
                fontSize: "clamp(12px, 2.2vw, 14px)",
                whiteSpace: "nowrap",
              }}
            >
              ✅ TP și SL plasate corect!
            </div>
          )}
        </div>
        <button
          onClick={() => setShowHelp(true)}
          style={{
            padding: "4px 8px",
            borderRadius: 8,
            background: "#6b7280",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ?
        </button>
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
        {/* grid + axă preț */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padX + axisW} x2={width - padX} y1={t.y} y2={t.y} stroke="#eef2f7" />
            <text x={padX + axisW - (isMobile ? 4 : 6)} y={t.y + 4} textAnchor="end" fontSize={11} fill="#374151">
              {fmt(t.p)}
            </text>
          </g>
        ))}

        {/* Zonă intrare */}
        <rect
          x={zoneX}
          y={zone.top}
          width={zoneW}
          height={zone.h}
          fill="#dbeafe"
          stroke="#93c5fd"
          rx="6"
        />
        <text
          x={zoneX + 8}
          y={Math.max(14, zone.top - 8)}
          fontSize={Math.max(10, Math.round(width * 0.015))}
          fill="#2563eb"
          fontWeight={700}
        >
          ZONA DE {mode} · ref {fmt(basePrice)}
        </text>

        {/* lumânări */}
        {candles.map((c, i) => (
          <Candle key={i} {...c} />
        ))}

        {/* Feedback vizual: săgeți */}
        {!tpOk && (
          <g>
            <line x1={zoneX + zoneW / 2} y1={tpY} x2={zoneX + zoneW / 2} y2={isBuy ? zone.top - 20 : zone.top + zone.h + 20} stroke="#16a34a" strokeDasharray="4" />
            <text x={zoneX + zoneW / 2} y={isBuy ? zone.top - 25 : zone.top + zone.h + 25} textAnchor="middle" fontSize={12} fill="#16a34a">
              {isBuy ? "↑ TP sus" : "↓ TP jos"}
            </text>
          </g>
        )}
        {!slOk && (
          <g>
            <line x1={zoneX + zoneW / 2} y1={slY} x2={zoneX + zoneW / 2} y2={isBuy ? zone.top + zone.h + 20 : zone.top - 20} stroke="#dc2626" strokeDasharray="4" />
            <text x={zoneX + zoneW / 2} y={isBuy ? zone.top + zone.h + 25 : zone.top - 25} textAnchor="middle" fontSize={12} fill="#dc2626">
              {isBuy ? "↓ SL jos" : "↑ SL sus"}
            </text>
          </g>
        )}

        {/* TP line + hit-area */}
        <g style={{ animation: tpOk ? pulseAnim : "none" }}>
          <line
            x1={zoneX}
            x2={zoneX + zoneW}
            y1={tpY}
            y2={tpY}
            stroke="#16a34a"
            strokeWidth={2}
            style={{ cursor: "ns-resize" }}
            onMouseDown={onStart("tp")}
            onTouchStart={onStart("tp")}
          />
        </g>
        <rect
          x={zoneX}
          y={tpY - Math.max(12, height * 0.02)}
          width={zoneW}
          height={Math.max(24, height * 0.04)}
          fill="transparent"
          onMouseDown={onStart("tp")}
          onTouchStart={onStart("tp")}
          style={{ cursor: "ns-resize" }}
        />
        <LabelChip
          x={zoneX + zoneW - labelInset}
          y={tpY}
          title={"TP" + (tpOk ? " ✔" : "")}
          price={tpPrice}
          delta={deltaFromBase(tpY)}
          bg={tpOk ? "#16a34a" : "#6b7280"}
        />

        {/* SL line + hit-area */}
        <g style={{ animation: slOk ? pulseAnim : "none" }}>
          <line
            x1={zoneX}
            x2={zoneX + zoneW}
            y1={slY}
            y2={slY}
            stroke="#dc2626"
            strokeWidth={2}
            style={{ cursor: "ns-resize" }}
            onMouseDown={onStart("sl")}
            onTouchStart={onStart("sl")}
          />
        </g>
        <rect
          x={zoneX}
          y={slY - Math.max(12, height * 0.02)}
          width={zoneW}
          height={Math.max(24, height * 0.04)}
          fill="transparent"
          onMouseDown={onStart("sl")}
          onTouchStart={onStart("sl")}
          style={{ cursor: "ns-resize" }}
        />
        <LabelChip
          x={zoneX + zoneW - labelInset}
          y={slY}
          title={"SL" + (slOk ? " ✔" : "")}
          price={slPrice}
          delta={deltaFromBase(slY)}
          bg={slOk ? "#dc2626" : "#6b7280"}
        />
      </svg>

      {/* Calcul profit/risc */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 8,
          fontSize: "clamp(12px, 2vw, 14px)",
          color: "#b1b3b5",
        }}
      >
        <div>Profit potențial: {profitPips} pips</div>
        <div>Risc: {riskPips} pips</div>
        <div>Risk/Reward: {rrRatio}</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
          paddingInline: 4,
          fontSize: "clamp(12px, 2.2vw, 14px)",
          color: "#b1b3b5",
        }}
      >
        <div>
          Pentru un <b>{mode}</b>: <b>TP</b> {isBuy ? "deasupra" : "sub"} zonei; <b>SL</b> {isBuy ? "sub" : "deasupra"} zonei.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              const tpInit = clamp(zone.top + Math.round(zone.h / 4));
              const slInit = clamp(zone.top + Math.round(zone.h * 3 / 4));
              setTpY(tpInit);
              setSlY(slInit);
            }}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Modal ajutor */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              maxWidth: "80%",
              textAlign: "left",
              color: "#333",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: "#333" }}>Explicații TP & SL</h4>
            <p style={{ color: "#333" }}><b>Take Profit (TP):</b> Nivelul la care închizi trade-ul în profit. Pentru BUY: mai sus; pentru SELL: mai jos.</p>
            <p style={{ color: "#333" }}><b>Stop Loss (SL):</b> Nivelul la care închizi trade-ul în pierdere pentru a limita riscul. Pentru BUY: mai jos; pentru SELL: mai sus.</p>
            <p style={{ color: "#333" }}>Risk/Reward: Raportul dintre profit potențial și risc. Ideal mai mare ca 1.</p>
            <button onClick={() => setShowHelp(false)} style={{ marginTop: 10, background: "#eee", color: "#333", padding: "5px 10px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}>Închide</button>
          </div>
        </div>
      )}
    </div>
  );
}