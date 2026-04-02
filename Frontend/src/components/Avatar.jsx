import { useGLTF, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function Avatar({ emotion = "neutral", isTalking = false }) {
  const groupRef = useRef();

  let scene;
  try {
    const gltf = useGLTF("/avatar.glb");
    scene = gltf.scene;
  } catch (error) {
    console.error("GLB load error:", error);
    return null;
  }

  const clonedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(t * 1.5) * 0.03 - 1.15;
    groupRef.current.rotation.y = state.mouse.x * 0.35;
    groupRef.current.rotation.x = -state.mouse.y * 0.12;

    if (isTalking) {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.02;
      groupRef.current.scale.setScalar(1.52 + Math.sin(t * 10) * 0.01);
    } else {
      groupRef.current.rotation.z = 0;
      groupRef.current.scale.setScalar(1.5);
    }

    if (emotion === "happy") {
      groupRef.current.rotation.y += 0.002;
    } else if (emotion === "angry") {
      groupRef.current.rotation.y += 0.004;
    }
  });

  if (!clonedScene) return null;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
      <primitive ref={groupRef} object={clonedScene} scale={1.5} position={[0, -1.15, 0]} />
    </Float>
  );
}