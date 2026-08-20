"use client";

import { useDesignerStore } from "@/lib/store";
import type { DeviceKind } from "@/types/model";

const groups = [
  ["Audio", [["Main Speaker","🔊","speaker"],["Subwoofer","◼️","sub"],["Front Fill","🔉","front-fill"]]],
  ["Video", [["Projector","📽️","projector"],["LED / Screen","🖥️","screen"],["Camera","📷","camera"]]],
  ["Lighting / Rigging", [["Light","💡","light"],["Truss","🏗️","truss"]]],
  ["Stage / Decor", [["Table","🪑","table"],["Chair","💺","chair"],["Photo","🖼️","photo"],["Backdrop","🎨","backdrop"]]],
  ["Production", [["FOH","🎛️","foh"],["Power","⚡","power"]]]
] as const;

export function EquipmentLibrary() {
  const addDevice = useDesignerStore(s => s.addDevice);

  function add(kind: DeviceKind, label: string) {
    addDevice({
      id: `${kind}-${Date.now()}`,
      name: label,
      kind,
      position: { x: 45, y: 55, z: kind === "projector" ? 12 : 0 },
      rotation: { x: 0, y: 0, z: 0 },
      size: kind === "screen"
        ? { x: 16, y: 0.5, z: 9 }
        : kind === "projector"
          ? { x: 2.2, y: 1.8, z: 0.8 }
          : { x: 3, y: 3, z: 3 },
      metadata: kind === "projector"
        ? { throwRatioMin: 1.2, throwRatioMax: 1.6, nativeAspectRatio: 16 / 9, brightnessLumens: 7000 }
        : undefined
    });
  }

  return (
    <>
      <div className="panelTitle">My Equipment + Library</div>
      {groups.map(([name, items]) => (
        <div className="category" key={name}>
          <h3>{name}</h3>
          <div className="itemGrid">
            {items.map(([label, icon, kind]) => (
              <button key={label} className="paletteItem" onClick={()=>add(kind as DeviceKind,label)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="category">
        <button className="wideBtn">+ Add Custom Equipment</button>
        <div className="small">Custom equipment will support dimensions, weight, power, connectors, coverage, photos, back-panel image, 3D model and inventory asset/case data.</div>
      </div>
    </>
  );
}
