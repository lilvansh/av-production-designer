"use client";

import { useDesignerStore } from "@/lib/store";

export function Inspector() {
  const { devices, selectedId, updateDevice, venue, setVenue, analysisMode } = useDesignerStore();
  const d=devices.find(x=>x.id===selectedId);

  return (
    <div className="inspector">
      <h2>Venue</h2>
      <div className="field"><label>Room width</label><input type="number" value={venue.widthFt} onChange={e=>setVenue({widthFt:Number(e.target.value)})}/></div>
      <div className="field"><label>Room length</label><input type="number" value={venue.lengthFt} onChange={e=>setVenue({lengthFt:Number(e.target.value)})}/></div>
      <div className="field"><label>Ceiling height</label><input type="number" value={venue.heightFt} onChange={e=>setVenue({heightFt:Number(e.target.value)})}/></div>

      <div className="section">
        <h2>Stage</h2>
        <div className="field"><label>Width</label><input type="number" value={venue.stage.widthFt} readOnly/></div>
        <div className="field"><label>Depth</label><input type="number" value={venue.stage.depthFt} readOnly/></div>
        <div className="field"><label>Height</label><input type="number" value={venue.stage.heightFt} readOnly/></div>
        <div className="small">Parametric stage controls and resize handles are the next editor milestone.</div>
      </div>

      {d && <>
        <div className="section">
          <h2>{d.name}</h2>
          {(["x","y","z"] as const).map(axis=>(
            <div className="field" key={axis}>
              <label>
                {axis === "z"
                  ? d.kind === "speaker" ||
                    d.kind === "light" ||
                    d.kind === "truss"
                    ? "Trim Height"
                    : d.kind === "projector"
                    ? "Lens Height"
                    : d.kind === "camera"
                    ? "Camera Height"
                    : d.kind === "screen" ||
                      d.kind === "backdrop"
                    ? "Bottom Elevation"
                    : "Bottom Height"
                  : axis === "x"
                  ? "X position"
                  : "Y position"}
              </label>
              <input type="number" step=".5" value={d.position[axis]} onChange={e=>updateDevice(d.id,{position:{...d.position,[axis]:Number(e.target.value)}})}/>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Inventory Link</h2>
          <div className="field"><label>Asset #</label><input value={d.asset?.assetNumber??""} onChange={e=>updateDevice(d.id,{asset:{...d.asset,assetNumber:e.target.value}})}/></div>
          <div className="field"><label>Case #</label><input value={d.asset?.caseNumber??""} onChange={e=>updateDevice(d.id,{asset:{...d.asset,caseNumber:e.target.value}})}/></div>
          <div className="field"><label>Location</label><input value={d.asset?.inventoryLocation??""} onChange={e=>updateDevice(d.id,{asset:{...d.asset,inventoryLocation:e.target.value}})}/></div>
        </div>

        <div className="section">
          <h2>Equipment</h2>
          <div className="field"><label>Manufacturer</label><input value={d.metadata?.manufacturer??""} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,manufacturer:e.target.value}})}/></div>
          <div className="field"><label>Model</label><input value={d.metadata?.model??""} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,model:e.target.value}})}/></div>
          {d.kind==="speaker" && <>
            <div className="field"><label>Horiz coverage °</label><input type="number" value={d.metadata?.horizontalCoverage??90} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,horizontalCoverage:Number(e.target.value)}})}/></div>
            <div className="field"><label>Vert coverage °</label><input type="number" value={d.metadata?.verticalCoverage??50} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,verticalCoverage:Number(e.target.value)}})}/></div>
            <div className="small">Analysis mode: <b>{analysisMode==="quick"?"Quick Planning":"Professional Prediction"}</b></div>
          </>}
          {d.kind==="projector" && (() => {
            const screens = devices.filter(x => x.kind === "screen");
            const target = screens.find(x => x.id === d.metadata?.targetScreenId) ?? screens[0];
            const min = d.metadata?.throwRatioMin ?? 1.2;
            const max = d.metadata?.throwRatioMax ?? 1.6;
            return <>
              <div className="field"><label>Target screen</label><select value={d.metadata?.targetScreenId ?? target?.id ?? ""} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,targetScreenId:e.target.value}})}><option value="">Auto / nearest</option>{screens.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div className="field"><label>Min throw ratio</label><input type="number" step=".01" value={min} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,throwRatioMin:Number(e.target.value)}})}/></div>
              <div className="field"><label>Max throw ratio</label><input type="number" step=".01" value={max} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,throwRatioMax:Number(e.target.value)}})}/></div>
              <div className="field"><label>Brightness (lm)</label><input type="number" step="100" value={d.metadata?.brightnessLumens ?? 7000} onChange={e=>updateDevice(d.id,{metadata:{...d.metadata,brightnessLumens:Number(e.target.value)}})}/></div>
              {target && <div className="small">Suggested lens distance for {target.size.x.toFixed(1)}' screen: <b>{(target.size.x*min).toFixed(1)}'–{(target.size.x*max).toFixed(1)}'</b>. The 3D viewport shows this mounting zone and live projection beam.</div>}
            </>;
          })()}
        </div>
      </>}
    </div>
  );
}
