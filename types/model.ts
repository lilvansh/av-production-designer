export type DeviceKind =
  | "speaker" | "sub" | "front-fill" | "projector" | "screen"
  | "camera" | "light" | "truss" | "foh" | "power"
  | "table" | "chair" | "photo" | "backdrop";

export type PlannerMode = "design" | "setup";
export type AnalysisMode = "quick" | "professional";

export interface Vec3 { x: number; y: number; z: number; }

export interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  position: Vec3;
  rotation: Vec3;
  size: Vec3;
  asset?: {
    assetNumber?: string;
    caseNumber?: string;
    inventoryLocation?: string;
  };
  metadata?: {
    manufacturer?: string;
    model?: string;
    horizontalCoverage?: number;
    verticalCoverage?: number;
    watts?: number;
    connector?: string;
    weightLb?: number;
    notes?: string;
  };
}

export interface Venue {
  name: string;
  location: string;
  widthFt: number;
  lengthFt: number;
  heightFt: number;
  sourceType: "dimensions" | "drawn" | "floorplan";
  stage: {
    widthFt: number;
    depthFt: number;
    heightFt: number;
    xFt: number;
    yFt: number;
  };
}

export interface Project {
  id: string;
  name: string;
  location: string;
  eventDate?: string;
  venueName?: string;
}
