"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Device, Venue } from "@/types/model";

function centerOf(device: Device, venue: Venue) {
  return new THREE.Vector3(
    device.position.x - venue.widthFt / 2,
    device.position.z + device.size.z / 2,
    device.position.y - venue.lengthFt / 2
  );
}

function screenBasis(screen: Device) {
  const e = new THREE.Euler(screen.rotation.x, screen.rotation.y, screen.rotation.z);
  return {
    right: new THREE.Vector3(1, 0, 0).applyEuler(e).normalize(),
    up: new THREE.Vector3(0, 1, 0).applyEuler(e).normalize(),
    normal: new THREE.Vector3(0, 0, 1).applyEuler(e).normalize()
  };
}

export function ProjectorPlanning3D({ projector, screen, venue }: { projector: Device; screen: Device; venue: Venue }) {
  const plan = useMemo(() => {
    const ratioMin = projector.metadata?.throwRatioMin ?? 1.2;
    const ratioMax = projector.metadata?.throwRatioMax ?? 1.6;
    const width = Math.max(screen.size.x, 1);
    const minThrow = width * ratioMin;
    const maxThrow = width * ratioMax;
    const screenCenter = centerOf(screen, venue);
    const projectorCenter = centerOf(projector, venue);
    const basis = screenBasis(screen);

    // Screens face +Z in our model, so projectors sit in front along +Z.
    const delta = projectorCenter.clone().sub(screenCenter);
    const perpendicularThrow = delta.dot(basis.normal);
    const currentThrow = Math.abs(perpendicularThrow);
    const valid = currentThrow >= minThrow && currentThrow <= maxThrow;
    const zoneDepth = Math.max(0.25, maxThrow - minThrow);
    const zoneCenter = screenCenter.clone().add(basis.normal.clone().multiplyScalar(minThrow + zoneDepth / 2));

    const corners = [
      screenCenter.clone().add(basis.right.clone().multiplyScalar(-width / 2)).add(basis.up.clone().multiplyScalar(screen.size.z / 2)),
      screenCenter.clone().add(basis.right.clone().multiplyScalar(width / 2)).add(basis.up.clone().multiplyScalar(screen.size.z / 2)),
      screenCenter.clone().add(basis.right.clone().multiplyScalar(width / 2)).add(basis.up.clone().multiplyScalar(-screen.size.z / 2)),
      screenCenter.clone().add(basis.right.clone().multiplyScalar(-width / 2)).add(basis.up.clone().multiplyScalar(-screen.size.z / 2))
    ];

    const vertices = new Float32Array([
      ...projectorCenter.toArray(), ...corners[0].toArray(), ...corners[1].toArray(),
      ...projectorCenter.toArray(), ...corners[1].toArray(), ...corners[2].toArray(),
      ...projectorCenter.toArray(), ...corners[2].toArray(), ...corners[3].toArray(),
      ...projectorCenter.toArray(), ...corners[3].toArray(), ...corners[0].toArray()
    ]);
    const beam = new THREE.BufferGeometry();
    beam.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    beam.computeVertexNormals();

    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), basis.normal);
    return { minThrow, maxThrow, currentThrow, valid, zoneDepth, zoneCenter, q, beam };
  }, [projector, screen, venue]);

  return (
    <group>
      <mesh position={plan.zoneCenter} quaternion={plan.q}>
        <boxGeometry args={[Math.max(screen.size.x * 0.75, 5), Math.max(screen.size.z * 1.5, 5), plan.zoneDepth]} />
        <meshBasicMaterial color={plan.valid ? "#59d98e" : "#e5b65b"} transparent opacity={0.10} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={plan.beam}>
        <meshBasicMaterial color={plan.valid ? "#9ed8ff" : "#ffb86b"} transparent opacity={0.10} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
