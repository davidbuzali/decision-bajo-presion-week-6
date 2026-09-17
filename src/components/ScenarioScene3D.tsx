import { Canvas } from "@react-three/fiber";
import type { MotionPreference } from "../app/sessionReducer";

type ScenarioScene3DProps = Readonly<{
  decisionIndex: number;
  motion: MotionPreference;
}>;

function DirectionMarker({ position }: Readonly<{ position: [number, number, number] }>) {
  return (
    <group position={position} rotation={[0, 0, -Math.PI / 2]}>
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.65, 0.18, 0.08]} />
        <meshStandardMaterial color="#e8fff9" />
      </mesh>
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.42, 0.18, 0.08]} />
        <meshStandardMaterial color="#e8fff9" />
      </mesh>
    </group>
  );
}

function Corridor({ decisionIndex }: Readonly<{ decisionIndex: number }>) {
  const routeBlocked = decisionIndex >= 1;
  const countActive = decisionIndex >= 2;

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} />

      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.22, 8]} />
        <meshStandardMaterial color="#d9ded9" />
      </mesh>
      <mesh position={[-2.65, 1.6, 0]}>
        <boxGeometry args={[0.18, 3.4, 8]} />
        <meshStandardMaterial color="#e9e3d7" />
      </mesh>
      <mesh position={[2.65, 1.6, 0]}>
        <boxGeometry args={[0.18, 3.4, 8]} />
        <meshStandardMaterial color="#e9e3d7" />
      </mesh>

      <mesh position={[0, 1.4, -3.55]}>
        <boxGeometry args={[1.7, 2.8, 0.18]} />
        <meshStandardMaterial color={routeBlocked ? "#8f3439" : "#087f78"} />
      </mesh>
      <mesh position={[0, 2.65, -3.42]}>
        <boxGeometry args={[2.1, 0.45, 0.12]} />
        <meshStandardMaterial color="#14213d" />
      </mesh>

      {routeBlocked ? (
        <group position={[0, 0.55, -2.75]}>
          <mesh position={[-0.75, 0, 0]} rotation={[0, 0, 0.32]}>
            <boxGeometry args={[1.7, 0.3, 0.35]} />
            <meshStandardMaterial color="#d89222" />
          </mesh>
          <mesh position={[0.75, 0, 0]} rotation={[0, 0, -0.32]}>
            <boxGeometry args={[1.7, 0.3, 0.35]} />
            <meshStandardMaterial color="#d89222" />
          </mesh>
        </group>
      ) : null}

      <group position={[-1.9, 1.8, -0.8]}>
        <mesh>
          <boxGeometry args={[0.78, 0.78, 0.08]} />
          <meshStandardMaterial color="#087f78" />
        </mesh>
        <DirectionMarker position={[0, 0, 0.08]} />
      </group>

      {[[-0.85, 0.42, 1.2], [0, 0.42, 1.05], [0.85, 0.42, 1.2]].map(
        ([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]}>
            <capsuleGeometry args={[0.2, 0.45, 5, 10]} />
            <meshStandardMaterial
              color={countActive && index === 2 ? "#d89222" : "#335e73"}
            />
          </mesh>
        ),
      )}
    </>
  );
}

export function ScenarioScene3D({ decisionIndex, motion }: ScenarioScene3DProps) {
  return (
    <div
      className="scene-canvas"
      role="img"
      aria-label="Corredor escolar ficticio representado con geometría simple"
    >
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 2.8, 7], fov: 48 }}
        dpr={[1, 1.5]}
        frameloop={motion === "reduced" ? "demand" : "always"}
        fallback={<p>La vista 3D no está disponible. Usa la vista plana.</p>}
      >
        <Corridor decisionIndex={decisionIndex} />
      </Canvas>
    </div>
  );
}
