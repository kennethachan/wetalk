import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";

function AIModel({ isSpeaking }) {
  const { scene } = useGLTF("/assets/avatar.glb"); // Load 3D AI model

  // Small movement while talking
  useEffect(() => {
    if (isSpeaking) {
      scene.rotation.y += 0.05; // Slight head movement
    }
  }, [isSpeaking]);

  return <primitive object={scene} scale={1.5} />;
}

function TalkingAvatar({ isSpeaking }) {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <AIModel isSpeaking={isSpeaking} />
      <OrbitControls />
    </Canvas>
  );
}

export default TalkingAvatar;
