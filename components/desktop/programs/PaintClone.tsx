"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";

const COLORS = [
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
  "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",
  "#ff8000", "#80ff00", "#00ff80", "#0080ff", "#8000ff", "#ff0080", "#804000", "#408060",
];

const TOOL_SIZES = [2, 4, 8, 12];

export default function PaintClone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(2);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    lastPos.current = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [color, size]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
    } else {
      ctx.moveTo(pos.x, pos.y);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }, [color, size]);

  const handleMouseUp = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}>
      <div style={{ width: 48, background: "#c0c0c0", borderRight: "2px solid #808080", padding: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {COLORS.map((c) => (
          <button
            key={c}
            style={{
              width: 20, height: 20, background: c, border: color === c ? "2px solid #000" : "1px solid #808080",
              cursor: "pointer", padding: 0,
            }}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#c0c0c0", borderBottom: "2px solid #808080", padding: "2px 4px", display: "flex", gap: 4, alignItems: "center" }}>
          {TOOL_SIZES.map((s) => (
            <button
              key={s}
              style={{
                width: 20, height: 20, background: "#fff", border: size === s ? "2px solid #000" : "1px solid #808080",
                cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onClick={() => setSize(s)}
              aria-label={`Size ${s}`}
            >
              <div style={{ width: s, height: s, borderRadius: "50%", background: "#000" }} />
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            style={{
              background: "#c0c0c0", borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
              borderRight: "2px solid #808080", borderBottom: "2px solid #808080", outline: "1px solid #000",
              padding: "2px 8px", fontSize: 11, cursor: "pointer", color: "#000",
            }}
            onClick={clearCanvas}
          >
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{ width: "100%", height: "100%", cursor: "crosshair", background: "#fff" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
}
