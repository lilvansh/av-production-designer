"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import { useDesignerStore } from "@/lib/store";

export function Venue3D() {
  const { venue, devices, selectedId, setSelected } = useDesignerStore();

  return (
    <Canvas camera={{ position:[0,65,80], fov:48 }}>
      <ambientLight intensity={1.8}/>
      <directionalLight position={[30,50,20]} intensity={2.2}/>
      <Grid args={[venue.widthFt,venue.lengthFt]} cellSize={5} sectionSize={20} fadeDistance={220}/>
      <mesh position={[0,venue.stage.heightFt/2,-venue.lengthFt/2+venue.stage.yFt+venue.stage.depthFt/2]}>
        <boxGeometry args={[venue.stage.widthFt,venue.stage.heightFt,venue.stage.depthFt]}/>
        <meshStandardMaterial color="#888888"/>
      </mesh>
      {devices.map(d=>{
        const x=d.position.x-venue.widthFt/2, z=d.position.y-venue.lengthFt/2, y=Math.max(d.position.z,d.size.z/2);
        return (
          <group key={d.id} position={[x,y,z]} onClick={(e)=>{e.stopPropagation();setSelected(d.id)}}>
            <mesh>
              <boxGeometry args={[d.size.x,Math.max(.3,d.size.z),d.size.y]}/>
              <meshStandardMaterial color={d.id===selectedId?"#eeeeee":"#555b66"}/>
            </mesh>
            <Text position={[0,d.size.z/2+1.2,0]} fontSize={1.1}>{d.name}</Text>
          </group>
        )
      })}
      <OrbitControls makeDefault/>
    </Canvas>
  );
}
