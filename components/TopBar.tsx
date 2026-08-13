"use client";
import { useDesignerStore } from "@/lib/store";

export function TopBar({ view, setView }: { view:"2d"|"3d"; setView:(v:"2d"|"3d")=>void }) {
  const { goDashboard, plannerMode, setPlannerMode, analysisMode, setAnalysisMode, loadDadaStagePreset } = useDesignerStore();

  return (
    <header className="topBar">
      <button className="toolbarBtn" onClick={goDashboard}>← Projects</button>
      <div className="brand">AV Production Designer</div>

      <button className={"toolbarBtn "+(view==="2d"?"active":"")} onClick={()=>setView("2d")}>2D Plan</button>
      <button className={"toolbarBtn "+(view==="3d"?"active":"")} onClick={()=>setView("3d")}>3D Venue</button>

      <span className="divider" />
      <button className={"toolbarBtn "+(plannerMode==="design"?"active":"")} onClick={()=>setPlannerMode("design")}>Design</button>
      <button className={"toolbarBtn "+(plannerMode==="setup"?"active":"")} onClick={()=>setPlannerMode("setup")}>Setup</button>

      <select className="toolbarSelect" value={analysisMode} onChange={e=>setAnalysisMode(e.target.value as any)}>
        <option value="quick">Quick Coverage</option>
        <option value="professional">Professional Prediction</option>
      </select>

      <button className="toolbarBtn" onClick={loadDadaStagePreset}>Dada Stage Preset</button>
    </header>
  );
}
