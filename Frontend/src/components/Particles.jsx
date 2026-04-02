import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Particles({ emotion }) {
  const mesh = useRef();

  useFrame(({ mouse }) => {
    mesh.current.rotation.x = mouse.y;
    mesh.current.rotation.y = mouse.x;

    // Emotion effect
    if (emotion === "angry") {
      mesh.current.scale.set(2, 2, 2);
    } else {
      mesh.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial wireframe />
    </mesh>
  );
}