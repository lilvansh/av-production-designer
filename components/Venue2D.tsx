"use client";
import { useDesignerStore } from "@/lib/store";

export function Venue2D() {
  const { venue, devices, selectedId, setSelected, plannerMode } = useDesignerStore();
  const scale=6, ox=60, oy=40;
  return (
    <div className="canvasWrap">
      {plannerMode==="setup" && <div className="modeBanner">SETUP MODE — Stage → Rigging → Power → Audio → Video → Lighting → FOH → Cable → Test</div>}
      <svg className="venueSvg" viewBox={`0 0 ${venue.widthFt*scale+120} ${venue.lengthFt*scale+100}`}>
        <defs>
          <pattern id="grid" width={scale*5} height={scale*5} patternUnits="userSpaceOnUse">
            <path d={`M ${scale*5} 0 L 0 0 0 ${scale*5}`} fill="none" className="gridLine" />
          </pattern>
        </defs>
        <rect x={ox} y={oy} width={venue.widthFt*scale} height={venue.lengthFt*scale} fill="url(#grid)" />
        <rect className="room" x={ox} y={oy} width={venue.widthFt*scale} height={venue.lengthFt*scale} fillOpacity=".08" />
        <rect className="stage" x={ox+venue.stage.xFt*scale} y={oy+venue.stage.yFt*scale} width={venue.stage.widthFt*scale} height={venue.stage.depthFt*scale} />
        <text className="dimText" x={ox+venue.widthFt*scale/2-24} y={oy+venue.stage.yFt*scale+venue.stage.depthFt*scale/2}>STAGE</text>

        {devices.map(d=>{
          const x=ox+d.position.x*scale, y=oy+d.position.y*scale, selected=d.id===selectedId;
          return (
            <g key={d.id} className={"device "+(selected?"selected":"")} transform={`translate(${x},${y})`} onClick={(e)=>{e.stopPropagation();setSelected(d.id)}}>
              {d.kind==="photo" || d.kind==="screen" || d.kind==="backdrop" ? (
                <rect x={-d.size.x*scale/2} y={-12} width={d.size.x*scale} height={24} rx={2} fill="#454b55" stroke="#818b98"/>
              ) : d.kind==="table" ? (
                <rect x={-d.size.x*scale/2} y={-9} width={d.size.x*scale} height={18} rx={5} fill="#6d6f74" stroke="#9da4ad"/>
              ) : (
                <rect x={-10} y={-10} width={20} height={20} rx={4} fill="#252b34" stroke="#818b98"/>
              )}
              <text className="dimText" x={14} y={4}>{d.name}</text>
              {d.kind==="speaker" && <path d="M 0 0 L -75 150 L 75 150 Z" fill="#ffffff" opacity=".09"/>}
              {d.kind==="camera" && <path d="M 0 0 L -55 -120 L 55 -120 Z" fill="#ffffff" opacity=".08"/>}
            </g>
          )
        })}
        <text className="dimText" x={ox} y={25}>{venue.name} — {venue.widthFt}' × {venue.lengthFt}' × {venue.heightFt}'</text>
      </svg>
    </div>
  );
}
