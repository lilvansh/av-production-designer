"use client";

import { useState } from "react";
import { useDesignerStore } from "@/lib/store";

export function Dashboard() {
  const { projects, openProject, createProject } = useDesignerStore();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("New AV Event");
  const [location, setLocation] = useState("");
  const [venueName, setVenueName] = useState("");

  function submit() {
    createProject({
      id: `project-${Date.now()}`,
      name,
      location: location || "Location TBD",
      venueName: venueName || "Venue TBD"
    });
  }

  return (
    <div className="dashboard">
      <div className="dashHeader">
        <div>
          <h1>AV Production Designer</h1>
          <p>Projects, venues, stage design, audio, video, lighting, rigging, power and cabling.</p>
        </div>
        <button className="primaryBtn" onClick={() => setShowNew(true)}>+ New Project</button>
      </div>

      <div className="dashGrid">
        {projects.map(p => (
          <button className="projectCard" key={p.id} onClick={() => openProject(p.id)}>
            <div className="projectIcon">🎚️</div>
            <h3>{p.name}</h3>
            <p>{p.venueName}</p>
            <p>{p.location}</p>
          </button>
        ))}
      </div>

      {showNew && (
        <div className="modalBackdrop">
          <div className="modal">
            <h2>Create Project</h2>
            <label>Project name<input value={name} onChange={e=>setName(e.target.value)} /></label>
            <label>Location<input placeholder="City, State / venue location" value={location} onChange={e=>setLocation(e.target.value)} /></label>
            <label>Venue name<input placeholder="Hotel ballroom, convention center..." value={venueName} onChange={e=>setVenueName(e.target.value)} /></label>

            <h3>How do you want to create the room?</h3>
            <div className="creationOptions">
              <div><b>📐 Dimensions</b><span>Enter room width, length and ceiling height.</span></div>
              <div><b>✏️ Draw</b><span>Draw custom/irregular walls and rooms.</span></div>
              <div><b>📄 Floorplan</b><span>Upload PDF/image/CAD later and calibrate a known measurement.</span></div>
            </div>

            <div className="modalActions">
              <button className="toolbarBtn" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="primaryBtn" onClick={submit}>Create & Open</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
