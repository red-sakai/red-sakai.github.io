'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";

type Vec3 = [number, number, number];

type HouseScene3DProps = {
  className?: string;
  heightClassName?: string;
  housePosition?: Vec3;
  houseRotation?: Vec3;
  houseScale?: number;
  cameraPosition?: Vec3;
  debug?: boolean;
};

function vecToFixed(v: Vec3, digits = 2): Vec3 {
  return [
    Number(v[0].toFixed(digits)),
    Number(v[1].toFixed(digits)),
    Number(v[2].toFixed(digits)),
  ];
}

function DebugHUD({
  cameraPosition,
  houseRotation,
}: {
  cameraPosition: Vec3;
  houseRotation: Vec3;
}) {
  const cameraDisplay = useMemo(() => vecToFixed(cameraPosition, 2), [cameraPosition]);
  const rotationDisplay = useMemo(() => vecToFixed(houseRotation, 3), [houseRotation]);

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-foreground/15 bg-background/55 p-3 text-xs text-foreground/80 backdrop-blur-md">
      <div className="font-mono">camera: [{cameraDisplay[0]}, {cameraDisplay[1]}, {cameraDisplay[2]}]</div>
      <div className="font-mono">house rot: [{rotationDisplay[0]}, {rotationDisplay[1]}, {rotationDisplay[2]}]</div>
    </div>
  );
}

function SceneTelemetry({
  onCameraPosition,
}: {
  onCameraPosition: (pos: Vec3) => void;
}) {
  const { camera } = useThree();
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (elapsedRef.current < 0.12) return;
    elapsedRef.current = 0;

    onCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  return null;
}

function SceneControls({ houseRotation }: { houseRotation: Vec3 }) {
  const { camera } = useThree();

  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      onEnd={() => {
        const p = [
          Number(camera.position.x.toFixed(3)),
          Number(camera.position.y.toFixed(3)),
          Number(camera.position.z.toFixed(3)),
        ] as const;
        console.log("cameraPosition=", p);
        console.log("houseRotation=", houseRotation);
      }}
    />
  );
}

function LowPolyHouse({
  position,
  rotation,
  scale,
}: {
  position: Vec3;
  rotation: Vec3;
  scale: number;
}) {
  const gltf = useGLTF("/3d-models/low_poly_house.glb");
  return <primitive object={gltf.scene} position={position} rotation={rotation} scale={scale} />;
}

useGLTF.preload("/3d-models/low_poly_house.glb");

export function HouseScene3D({
  className,
  heightClassName = "h-[420px]",
  housePosition = [0, 0, 0],
  houseRotation = [0, 0, 0],
  houseScale = 1,
  cameraPosition = [3.5, 2.2, 5],
  debug = true,
}: HouseScene3DProps) {
  const [cameraPos, setCameraPos] = useState<Vec3>(cameraPosition);

  return (
    <section className={className}>
      <div className={"relative w-full " + heightClassName}>
        {debug && <DebugHUD cameraPosition={cameraPos} houseRotation={houseRotation} />}
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          dpr={[1, 2]}
          shadows
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#87CEEB"]} />
            <Sky distance={450000} sunPosition={[6, 10, 3]} turbidity={8} rayleigh={1.2} mieCoefficient={0.005} mieDirectionalG={0.85} />
            <SceneTelemetry onCameraPosition={setCameraPos} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[6, 10, 3]} intensity={1.15} castShadow />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#2f8f2f" roughness={1} metalness={0} />
            </mesh>

            <LowPolyHouse position={housePosition} rotation={houseRotation} scale={houseScale} />
            <Environment preset="city" />
            <SceneControls houseRotation={houseRotation} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
