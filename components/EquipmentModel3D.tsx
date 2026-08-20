"use client";

import * as THREE from "three";
import type { Device } from "@/types/model";

function SpeakerModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const w = Math.max(device.size.x, 1.3);
  const h = Math.max(device.size.z, 2.5);
  const d = Math.max(device.size.y, 1.2);

  return (
    <group>
      {/* cabinet */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={selected ? "#2b2f34" : "#17191c"}
          roughness={0.68}
        />
      </mesh>

      {/* front grille */}
      <mesh position={[0, 0, d / 2 + 0.02]}>
        <boxGeometry args={[w * 0.92, h * 0.92, 0.05]} />
        <meshStandardMaterial
          color="#08090a"
          roughness={0.95}
        />
      </mesh>

      {/* LF driver */}
      <mesh
        position={[0, -h * 0.18, d / 2 + 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[w * 0.3, w * 0.3, 0.05, 32]}
        />
        <meshStandardMaterial color="#111315" />
      </mesh>

      {/* HF horn */}
      <mesh position={[0, h * 0.23, d / 2 + 0.07]}>
        <boxGeometry args={[w * 0.48, h * 0.18, 0.08]} />
        <meshStandardMaterial color="#090a0b" />
      </mesh>

      {/* handles */}
      <mesh position={[-w / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.05, h * 0.18, d * 0.36]} />
        <meshStandardMaterial color="#090a0b" />
      </mesh>

      <mesh position={[w / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.05, h * 0.18, d * 0.36]} />
        <meshStandardMaterial color="#090a0b" />
      </mesh>
    </group>
  );
}

function SubwooferModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const w = Math.max(device.size.x, 2.3);
  const h = Math.max(device.size.z, 2);
  const d = Math.max(device.size.y, 2.2);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={selected ? "#24282d" : "#131517"}
          roughness={0.72}
        />
      </mesh>

      <mesh position={[0, 0, d / 2 + 0.04]}>
        <boxGeometry args={[w * 0.94, h * 0.9, 0.07]} />
        <meshStandardMaterial color="#08090a" />
      </mesh>

      <mesh
        position={[0, 0, d / 2 + 0.08]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[Math.min(w, h) * 0.34, Math.min(w, h) * 0.34, 0.04, 32]}
        />
        <meshStandardMaterial color="#101214" />
      </mesh>
    </group>
  );
}

function CinemaCameraModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const s = Math.max(device.size.x, 1.5);

  return (
    <group>
      {/* camera body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[s * 1.25, s * 0.85, s * 0.8]} />
        <meshStandardMaterial
          color={selected ? "#2a2f35" : "#171a1d"}
          roughness={0.55}
        />
      </mesh>

      {/* lens */}
      <mesh
        position={[0, 0, s * 0.62]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[s * 0.29, s * 0.34, s * 0.55, 32]}
        />
        <meshStandardMaterial color="#111316" />
      </mesh>

      {/* lens glass */}
      <mesh
        position={[0, 0, s * 0.91]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[s * 0.23, s * 0.23, 0.03, 32]}
        />
        <meshStandardMaterial
          color="#192532"
          metalness={0.25}
          roughness={0.2}
        />
      </mesh>

      {/* top handle */}
      <mesh position={[0, s * 0.62, -s * 0.08]}>
        <boxGeometry args={[s * 0.65, s * 0.12, s * 0.15]} />
        <meshStandardMaterial color="#111316" />
      </mesh>

      <mesh position={[-s * 0.28, s * 0.48, -s * 0.08]}>
        <boxGeometry args={[s * 0.1, s * 0.35, s * 0.1]} />
        <meshStandardMaterial color="#111316" />
      </mesh>

      <mesh position={[s * 0.28, s * 0.48, -s * 0.08]}>
        <boxGeometry args={[s * 0.1, s * 0.35, s * 0.1]} />
        <meshStandardMaterial color="#111316" />
      </mesh>

      {/* rear battery */}
      <mesh position={[0, 0, -s * 0.55]}>
        <boxGeometry args={[s * 0.75, s * 0.65, s * 0.25]} />
        <meshStandardMaterial color="#0e1012" />
      </mesh>
    </group>
  );
}

function MirrorlessCameraModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const s = Math.max(device.size.x, 1);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[s * 1.15, s * 0.78, s * 0.5]} />
        <meshStandardMaterial
          color={selected ? "#272c31" : "#151719"}
        />
      </mesh>

      <mesh
        position={[0, 0, s * 0.47]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[s * 0.28, s * 0.32, s * 0.48, 32]} />
        <meshStandardMaterial color="#101214" />
      </mesh>

      <mesh position={[0, s * 0.48, 0]}>
        <boxGeometry args={[s * 0.42, s * 0.2, s * 0.25]} />
        <meshStandardMaterial color="#121416" />
      </mesh>
    </group>
  );
}

function ProjectorModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const w = Math.max(device.size.x, 1.7);
  const h = Math.max(device.size.z, 0.7);
  const d = Math.max(device.size.y, 1.5);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={selected ? "#d6d8da" : "#aeb2b6"}
          roughness={0.45}
        />
      </mesh>

      <mesh
        position={[w * 0.25, 0, d / 2 + 0.08]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[h * 0.25, h * 0.3, 0.18, 32]} />
        <meshStandardMaterial color="#20262d" />
      </mesh>
    </group>
  );
}

function TrussModel({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const w = Math.max(device.size.x, 8);
  const h = Math.max(device.size.z, 1);
  const d = Math.max(device.size.y, 1);

  const tube = 0.08;

  return (
    <group>
      {[
        [-h / 2, -d / 2],
        [h / 2, -d / 2],
        [-h / 2, d / 2],
        [h / 2, d / 2]
      ].map(([y, z], i) => (
        <mesh key={i} position={[0, y, z]}>
          <boxGeometry args={[w, tube, tube]} />
          <meshStandardMaterial
            color={selected ? "#d8dadd" : "#9ca1a6"}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ))}

      {Array.from({ length: Math.max(2, Math.floor(w / 2)) }).map((_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / Math.max(2, Math.floor(w / 2)));

        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[tube, h * 1.25, tube]} />
              <meshStandardMaterial color="#9ca1a6" metalness={0.7} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[tube, h * 1.25, tube]} />
              <meshStandardMaterial color="#9ca1a6" metalness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}


function ScreenModel({ device, selected }: { device: Device; selected: boolean }) {
  const w = Math.max(device.size.x, 4);
  const h = Math.max(device.size.z, 2.25);
  const d = Math.max(device.size.y, 0.18);
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w + 0.22, h + 0.22, d]} />
        <meshStandardMaterial color={selected ? "#343b44" : "#171a1e"} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, d / 2 + 0.015]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#e9edf1" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SimpleBox({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry
        args={[
          Math.max(0.3, device.size.x),
          Math.max(0.3, device.size.z),
          Math.max(0.3, device.size.y)
        ]}
      />
      <meshStandardMaterial
        color={selected ? "#e7eaee" : "#59616d"}
      />
    </mesh>
  );
}

export function EquipmentModel3D({
  device,
  selected
}: {
  device: Device;
  selected: boolean;
}) {
  const modelName = `${device.metadata?.manufacturer ?? ""} ${device.metadata?.model ?? ""}`.toLowerCase();

  if (device.kind === "speaker" || device.kind === "front-fill") {
    return <SpeakerModel device={device} selected={selected} />;
  }

  if (device.kind === "sub") {
    return <SubwooferModel device={device} selected={selected} />;
  }

  if (device.kind === "camera") {
    if (
      modelName.includes("a7") ||
      modelName.includes("mirrorless") ||
      modelName.includes("sony")
    ) {
      return <MirrorlessCameraModel device={device} selected={selected} />;
    }

    return <CinemaCameraModel device={device} selected={selected} />;
  }

  if (device.kind === "projector") {
    return <ProjectorModel device={device} selected={selected} />;
  }

  if (device.kind === "screen") {
    return <ScreenModel device={device} selected={selected} />;
  }

  if (device.kind === "truss") {
    return <TrussModel device={device} selected={selected} />;
  }

  return <SimpleBox device={device} selected={selected} />;
}
