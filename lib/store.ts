"use client";

import { create } from "zustand";
import type { AnalysisMode, Device, PlannerMode, Project, Venue } from "@/types/model";

type State = {
  screen: "dashboard" | "designer";
  projects: Project[];
  activeProjectId?: string;
  venue: Venue;
  devices: Device[];
  selectedId?: string;
  plannerMode: PlannerMode;
  analysisMode: AnalysisMode;

  openProject: (id: string) => void;
  createProject: (project: Project) => void;
  goDashboard: () => void;

  setSelected: (id?: string) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  setVenue: (patch: Partial<Venue>) => void;
  setPlannerMode: (mode: PlannerMode) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  loadDadaStagePreset: () => void;
};

const dadaPreset: Device[] = [
  ...[0,1,2].map((i) => ({
    id: `left-photo-${i}`,
    name: `Left Photo ${i+1}`,
    kind: "photo" as const,
    position: { x: 25 + i*5, y: 12, z: 4 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 3, y: .5, z: 4 }
  })),
  ...[0,1,2].map((i) => ({
    id: `right-photo-${i}`,
    name: `Right Photo ${i+1}`,
    kind: "photo" as const,
    position: { x: 55 + i*5, y: 12, z: 4 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 3, y: .5, z: 4 }
  })),
  {
    id: "dada-chair",
    name: "Center Chair",
    kind: "chair" as const,
    position: { x: 45, y: 15, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 3, y: 3, z: 4 }
  },
  {
    id: "left-table",
    name: "Left Devotional Table",
    kind: "table" as const,
    position: { x: 31, y: 17, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 14, y: 3, z: 3 }
  },
  {
    id: "right-table",
    name: "Right Devotional Table",
    kind: "table" as const,
    position: { x: 59, y: 17, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 14, y: 3, z: 3 }
  },
  {
    id: "backdrop",
    name: "Backdrop",
    kind: "backdrop" as const,
    position: { x: 45, y: 8, z: 6 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 28, y: .5, z: 12 }
  }
];

export const useDesignerStore = create<State>((set, get) => ({
  screen: "dashboard",
  projects: [
    { id: "demo-dallas", name: "Dallas Satsang", location: "Dallas, TX", venueName: "Ballroom Concept" },
    { id: "demo-convention", name: "Large Convention Layout", location: "New Project", venueName: "Convention Hall" }
  ],
  venue: {
    name: "Ballroom",
    location: "Dallas, TX",
    widthFt: 90,
    lengthFt: 120,
    heightFt: 24,
    sourceType: "dimensions",
    stage: { widthFt: 48, depthFt: 20, heightFt: 3, xFt: 21, yFt: 5 }
  },
  devices: [
    {
      id: "pa-left", name: "Main PA L", kind: "speaker",
      position: { x: 17, y: 27, z: 16 }, rotation: { x: 0, y: 0, z: 0 },
      size: { x: 2, y: 2, z: 5 },
      asset: { assetNumber: "AUD-PA-001" },
      metadata: { horizontalCoverage: 90, verticalCoverage: 50, watts: 1400 }
    },
    {
      id: "pa-right", name: "Main PA R", kind: "speaker",
      position: { x: 73, y: 27, z: 16 }, rotation: { x: 0, y: 0, z: 0 },
      size: { x: 2, y: 2, z: 5 },
      asset: { assetNumber: "AUD-PA-002" },
      metadata: { horizontalCoverage: 90, verticalCoverage: 50, watts: 1400 }
    }
  ],
  selectedId: "pa-left",
  plannerMode: "design",
  analysisMode: "quick",

  openProject: (id) => set({ activeProjectId: id, screen: "designer" }),
  createProject: (project) => set((s) => ({
    projects: [project, ...s.projects],
    activeProjectId: project.id,
    screen: "designer",
    venue: { ...s.venue, name: project.venueName || "New Venue", location: project.location }
  })),
  goDashboard: () => set({ screen: "dashboard" }),

  setSelected: (id) => set({ selectedId: id }),
  addDevice: (device) => set((s) => ({ devices: [...s.devices, device], selectedId: device.id })),
  updateDevice: (id, patch) => set((s) => ({
    devices: s.devices.map((d) => d.id === id ? { ...d, ...patch } : d)
  })),
  setVenue: (patch) => set((s) => ({ venue: { ...s.venue, ...patch } })),
  setPlannerMode: (plannerMode) => set({ plannerMode }),
  setAnalysisMode: (analysisMode) => set({ analysisMode }),
  loadDadaStagePreset: () => {
    const existing = get().devices.filter(d =>
      !["photo","table","chair","backdrop"].includes(d.kind)
    );
    set({ devices: [...existing, ...dadaPreset], selectedId: "dada-chair" });
  }
}));
