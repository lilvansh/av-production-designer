"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { useDesignerStore } from "@/lib/store";
import { EquipmentModel3D } from "@/components/EquipmentModel3D";
import { ProjectorPlanning3D } from "@/components/ProjectorPlanning3D";

type TransformMode = "translate" | "rotate" | "scale";

function CameraControls({
  enabled
}: {
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = true;
    controls.minDistance = 8;
    controls.maxDistance = 400;
    controls.maxPolarAngle = Math.PI / 2.01;
    controls.enabled = enabled;

    controlsRef.current = controls;

    let frame = 0;

    const animate = () => {
      controls.update();
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      controls.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = enabled;
    }
  }, [enabled]);

  return null;
}

function DeviceObject({
  id,
  selected,
  objectRef
}: {
  id: string;
  selected: boolean;
  objectRef?: (object: THREE.Group | null) => void;
}) {
  const {
    venue,
    devices,
    setSelected
  } = useDesignerStore();

  const device = devices.find((item) => item.id === id);

  if (!device) return null;

  const x =
    device.position.x - venue.widthFt / 2;

  const depth =
    device.position.y - venue.lengthFt / 2;

  // position.z is treated as BOTTOM ELEVATION.
  const centerHeight =
    device.position.z + device.size.z / 2;

  return (
    <group
      ref={objectRef}
      position={[x, centerHeight, depth]}
      rotation={[
        device.rotation.x,
        device.rotation.y,
        device.rotation.z
      ]}
      onPointerDown={(event) => {
        event.stopPropagation();
        setSelected(device.id);
      }}
    >
      <EquipmentModel3D
        device={device}
        selected={selected}
      />

      {selected && (
        <mesh scale={1.04}>
          <boxGeometry
            args={[
              Math.max(0.25, device.size.x),
              Math.max(0.25, device.size.z),
              Math.max(0.25, device.size.y)
            ]}
          />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      )}
    </group>
  );
}

function TransformGizmo({
  target,
  mode,
  setDragging
}: {
  target: THREE.Object3D | null;
  mode: TransformMode;
  setDragging: (dragging: boolean) => void;
}) {
  const { camera, gl, scene } = useThree();
  const gizmoRef =
    useRef<TransformControls | null>(null);

  const {
    venue,
    devices,
    selectedId,
    updateDevice
  } = useDesignerStore();

  useEffect(() => {
    const gizmo = new TransformControls(
      camera,
      gl.domElement
    );

    gizmo.setMode(mode);
    gizmo.setSpace("world");
    gizmo.setTranslationSnap(0.5);
    gizmo.setRotationSnap(
      THREE.MathUtils.degToRad(1)
    );

    scene.add(gizmo.getHelper());

    gizmoRef.current = gizmo;

    const onDraggingChanged = (
      event: THREE.Event & {
        value?: unknown;
      }
    ) => {
      setDragging(Boolean(event.value));
    };

    const onObjectChange = () => {
      if (
        !selectedId ||
        !target
      ) {
        return;
      }

      const device = devices.find(
        (item) => item.id === selectedId
      );

      if (!device) return;

      const position = target.position;

      const floorX =
        position.x + venue.widthFt / 2;

      const floorY =
        position.z + venue.lengthFt / 2;

      const bottomHeight = Math.max(
        0,
        position.y - device.size.z / 2
      );

      const rotation = target.rotation;

      updateDevice(selectedId, {
        position: {
          x:
            Math.round(floorX * 2) /
            2,
          y:
            Math.round(floorY * 2) /
            2,
          z:
            Math.round(bottomHeight * 2) /
            2
        },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        }
      });
    };

    gizmo.addEventListener(
      "dragging-changed",
      onDraggingChanged as any
    );

    gizmo.addEventListener(
      "objectChange",
      onObjectChange
    );

    return () => {
      gizmo.detach();

      gizmo.removeEventListener(
        "dragging-changed",
        onDraggingChanged as any
      );

      gizmo.removeEventListener(
        "objectChange",
        onObjectChange
      );

      scene.remove(gizmo.getHelper());
      gizmo.dispose();
    };
  }, [
    camera,
    gl,
    scene,
    selectedId,
    target,
    venue.widthFt,
    venue.lengthFt,
    devices,
    updateDevice,
    setDragging
  ]);

  useEffect(() => {
    if (!gizmoRef.current) return;

    gizmoRef.current.setMode(mode);
  }, [mode]);

  useEffect(() => {
    const gizmo = gizmoRef.current;

    if (!gizmo) return;

    if (target) {
      gizmo.attach(target);
    } else {
      gizmo.detach();
    }
  }, [target]);

  return null;
}

function VenueScene({
  mode
}: {
  mode: TransformMode;
}) {
  const {
    venue,
    devices,
    selectedId,
    setSelected
  } = useDesignerStore();

  const [
    transformDragging,
    setTransformDragging
  ] = useState(false);

  const [selectedObject, setSelectedObject] =
    useState<THREE.Group | null>(null);

  const roomWidth = venue.widthFt;
  const roomLength = venue.lengthFt;

  const stageCenterX =
    venue.stage.xFt +
    venue.stage.widthFt / 2 -
    roomWidth / 2;

  const stageCenterDepth =
    venue.stage.yFt +
    venue.stage.depthFt / 2 -
    roomLength / 2;

  const screens = devices.filter((device) => device.kind === "screen");
  const projectors = devices.filter((device) => device.kind === "projector");

  return (
    <>
      <color
        attach="background"
        args={["#0d1014"]}
      />

      <ambientLight intensity={1.25} />

      <directionalLight
        position={[35, 55, 25]}
        intensity={2}
        castShadow
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
        onPointerDown={(event) => {
          event.stopPropagation();
          setSelected(undefined);
        }}
      >
        <planeGeometry
          args={[roomWidth, roomLength]}
        />

        <meshStandardMaterial
          color="#191d23"
          roughness={0.9}
        />
      </mesh>

      <gridHelper
        args={[
          Math.max(
            roomWidth,
            roomLength
          ) * 1.5,
          Math.ceil(
            Math.max(
              roomWidth,
              roomLength
            ) / 5
          )
        ]}
        position={[0, 0.01, 0]}
      />

      <mesh
        position={[
          stageCenterX,
          venue.stage.heightFt / 2,
          stageCenterDepth
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            venue.stage.widthFt,
            venue.stage.heightFt,
            venue.stage.depthFt
          ]}
        />

        <meshStandardMaterial
          color="#858b94"
          roughness={0.7}
        />
      </mesh>

      {devices.map((device) => (
        <DeviceObject
          key={device.id}
          id={device.id}
          selected={
            device.id === selectedId
          }
          objectRef={
            device.id === selectedId
              ? setSelectedObject
              : undefined
          }
        />
      ))}

      {projectors.map((projector) => {
        if (!screens.length) return null;
        const explicit = projector.metadata?.targetScreenId
          ? screens.find((screen) => screen.id === projector.metadata?.targetScreenId)
          : undefined;
        const targetScreen = explicit ?? screens.reduce((best, screen) => {
          const d = Math.hypot(screen.position.x - projector.position.x, screen.position.y - projector.position.y);
          const bd = Math.hypot(best.position.x - projector.position.x, best.position.y - projector.position.y);
          return d < bd ? screen : best;
        });
        return <ProjectorPlanning3D key={`${projector.id}-${targetScreen.id}`} projector={projector} screen={targetScreen} venue={venue} />;
      })}

      <TransformGizmo
        target={selectedId ? selectedObject : null}
        mode={mode}
        setDragging={setTransformDragging}
      />

      <CameraControls
        enabled={!transformDragging}
      />
    </>
  );
}

export function Venue3D() {
  const [
    mode,
    setMode
  ] = useState<TransformMode>(
    "translate"
  );

  const {
    selectedId,
    devices,
    updateDevice
  } = useDesignerStore();

  const selected = useMemo(
    () =>
      devices.find(
        (device) =>
          device.id === selectedId
      ),
    [devices, selectedId]
  );

  const heightLabel = useMemo(() => {
    if (!selected) return "Height";

    switch (selected.kind) {
      case "speaker":
      case "light":
      case "truss":
        return "Trim Height";

      case "projector":
        return "Lens Height";

      case "camera":
        return "Camera Height";

      case "screen":
      case "backdrop":
        return "Bottom Elevation";

      default:
        return "Bottom Height";
    }
  }, [selected]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [55, 55, 80],
          fov: 44,
          near: 0.1,
          far: 1200
        }}
      >
        <VenueScene mode={mode} />
      </Canvas>

      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          display: "flex",
          gap: 8,
          padding: 8,
          borderRadius: 10,
          background:
            "rgba(15,17,21,.86)",
          border:
            "1px solid rgba(255,255,255,.12)",
          backdropFilter: "blur(16px)"
        }}
      >
        <button
          className={
            "toolbarBtn " +
            (mode === "translate"
              ? "active"
              : "")
          }
          onClick={() =>
            setMode("translate")
          }
        >
          Move
        </button>

        <button
          className={
            "toolbarBtn " +
            (mode === "rotate"
              ? "active"
              : "")
          }
          onClick={() =>
            setMode("rotate")
          }
        >
          Rotate
        </button>

        <button
          className={
            "toolbarBtn " +
            (mode === "scale"
              ? "active"
              : "")
          }
          onClick={() =>
            setMode("scale")
          }
        >
          Resize
        </button>
      </div>

      {selected && (
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,
            minWidth: 230,
            padding: 14,
            borderRadius: 12,
            background:
              "rgba(15,17,21,.9)",
            border:
              "1px solid rgba(255,255,255,.12)",
            backdropFilter:
              "blur(18px)"
          }}
        >
          <div
            style={{
              fontSize: 12,
              opacity: 0.55,
              marginBottom: 5
            }}
          >
            SELECTED
          </div>

          <div
            style={{
              fontWeight: 700,
              marginBottom: 12
            }}
          >
            {selected.name}
          </div>

          <label
            style={{
              display: "block",
              fontSize: 12,
              opacity: 0.72,
              marginBottom: 5
            }}
          >
            {heightLabel}
          </label>

          <div
            style={{
              display: "flex",
              gap: 6
            }}
          >
            <input
              type="number"
              step="0.5"
              value={
                selected.position.z
              }
              onChange={(event) =>
                updateDevice(
                  selected.id,
                  {
                    position: {
                      ...selected.position,
                      z: Math.max(
                        0,
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                  }
                )
              }
              style={{
                width: 105,
                borderRadius: 7,
                border:
                  "1px solid rgba(255,255,255,.15)",
                background:
                  "#101216",
                color: "#fff",
                padding: "7px 8px"
              }}
            />

            <span
              style={{
                alignSelf: "center",
                fontSize: 12,
                opacity: 0.6
              }}
            >
              ft
            </span>
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              opacity: 0.5
            }}
          >
            Drag the vertical gizmo
            or enter an exact value.
          </div>
        </div>
      )}
    </div>
  );
}
