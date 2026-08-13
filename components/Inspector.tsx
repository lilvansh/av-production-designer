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
              <label>{axis.toUpperCase()} position</label>
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
        </div>
      </>}
    </div>
  );
}
