"use client";

import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { EquipmentLibrary } from "@/components/EquipmentLibrary";
import { Venue2D } from "@/components/Venue2D";
import { Venue3D } from "@/components/Venue3D";
import { Inspector } from "@/components/Inspector";
import { TopBar } from "@/components/TopBar";
import { useDesignerStore } from "@/lib/store";

export default function Home() {
  const screen = useDesignerStore(s => s.screen);
  const [view, setView] = useState<"2d"|"3d">("2d");

  if (screen === "dashboard") return <Dashboard />;

  return (
    <main className="appShell">
      <TopBar view={view} setView={setView} />
      <aside className="leftPanel"><EquipmentLibrary /></aside>
      <section className="workspace">{view === "2d" ? <Venue2D /> : <Venue3D />}</section>
      <aside className="rightPanel"><Inspector /></aside>
    </main>
  );
}
