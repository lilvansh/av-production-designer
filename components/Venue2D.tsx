"use client";

import {
  PointerEvent as ReactPointerEvent,
  useRef,
  useState
} from "react";
import { useDesignerStore } from "@/lib/store";

export function Venue2D() {
  const {
    venue,
    devices,
    selectedId,
    setSelected,
    updateDevice,
    plannerMode
  } = useDesignerStore();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingId, setDraggingId] =
    useState<string | null>(null);

  const scale = 6;
  const ox = 60;
  const oy = 40;

  function pointerToFeet(
    e: ReactPointerEvent<SVGSVGElement>
  ) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };

    const p = point.matrixTransform(matrix.inverse());

    return {
      x: (p.x - ox) / scale,
      y: (p.y - oy) / scale
    };
  }

  function snap(value: number) {
    return Math.round(value * 2) / 2;
  }

  function handlePointerMove(
    e: ReactPointerEvent<SVGSVGElement>
  ) {
    if (!draggingId) return;

    const device = devices.find(
      (d) => d.id === draggingId
    );

    if (!device) return;

    const p = pointerToFeet(e);

    updateDevice(draggingId, {
      position: {
        ...device.position,
        x: Math.max(
          0,
          Math.min(venue.widthFt, snap(p.x))
        ),
        y: Math.max(
          0,
          Math.min(venue.lengthFt, snap(p.y))
        )
      }
    });
  }

  function stopDrag() {
    setDraggingId(null);
  }

  return (
    <div className="canvasWrap">
      {plannerMode === "setup" && (
        <div className="modeBanner">
          SETUP MODE — Stage → Rigging → Power →
          Audio → Video → Lighting → FOH → Cable →
          Test
        </div>
      )}

      <svg
        ref={svgRef}
        className="venueSvg"
        viewBox={`0 0 ${
          venue.widthFt * scale + 120
        } ${venue.lengthFt * scale + 100}`}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelected(undefined);
          }
        }}
      >
        <defs>
          <pattern
            id="grid"
            width={scale * 5}
            height={scale * 5}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${scale * 5} 0 L 0 0 0 ${
                scale * 5
              }`}
              fill="none"
              className="gridLine"
            />
          </pattern>
        </defs>

        <rect
          x={ox}
          y={oy}
          width={venue.widthFt * scale}
          height={venue.lengthFt * scale}
          fill="url(#grid)"
        />

        <rect
          className="room"
          x={ox}
          y={oy}
          width={venue.widthFt * scale}
          height={venue.lengthFt * scale}
          fillOpacity=".08"
        />

        <rect
          className="stage"
          x={ox + venue.stage.xFt * scale}
          y={oy + venue.stage.yFt * scale}
          width={venue.stage.widthFt * scale}
          height={venue.stage.depthFt * scale}
        />

        <text
          className="dimText"
          x={
            ox +
            venue.stage.xFt * scale +
            venue.stage.widthFt * scale / 2 -
            20
          }
          y={
            oy +
            venue.stage.yFt * scale +
            venue.stage.depthFt * scale / 2
          }
        >
          STAGE
        </text>

        {devices.map((d) => {
          const x = ox + d.position.x * scale;
          const y = oy + d.position.y * scale;
          const selected = d.id === selectedId;

          return (
            <g
              key={d.id}
              className={
                "device " +
                (selected ? "selected" : "")
              }
              transform={`translate(${x},${y})`}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(
                  e.pointerId
                );
                setSelected(d.id);
                setDraggingId(d.id);
              }}
            >
              {d.kind === "table" ? (
                <rect
                  x={-d.size.x * scale / 2}
                  y={-10}
                  width={d.size.x * scale}
                  height={20}
                  rx={5}
                  fill="#656b75"
                  stroke="#9da4ad"
                />
              ) : d.kind === "photo" ||
                d.kind === "screen" ||
                d.kind === "backdrop" ? (
                <rect
                  x={-d.size.x * scale / 2}
                  y={-12}
                  width={d.size.x * scale}
                  height={24}
                  rx={3}
                  fill="#454b55"
                  stroke="#818b98"
                />
              ) : (
                <rect
                  x={-11}
                  y={-11}
                  width={22}
                  height={22}
                  rx={5}
                  fill="#252b34"
                  stroke="#818b98"
                />
              )}

              {d.kind === "speaker" && (
                <path
                  d="M 0 0 L -75 150 L 75 150 Z"
                  fill="#ffffff"
                  opacity=".075"
                  pointerEvents="none"
                />
              )}

              {d.kind === "camera" && (
                <path
                  d="M 0 0 L -55 -120 L 55 -120 Z"
                  fill="#ffffff"
                  opacity=".075"
                  pointerEvents="none"
                />
              )}

              <text
                className="dimText"
                x={16}
                y={4}
                pointerEvents="none"
              >
                {d.name}
              </text>
            </g>
          );
        })}

        <text className="dimText" x={ox} y={25}>
          {venue.name} — {venue.widthFt}' ×{" "}
          {venue.lengthFt}' × {venue.heightFt}'
        </text>
      </svg>
    </div>
  );
}
