import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

function AIModel({ isSpeaking }) {
  const { scene } = useGLTF(process.env.PUBLIC_URL + "/assets/avatar.glb");

  // Scale and position adjustments
  scene.scale.set(2.5, 2.5, 2.5);
  scene.position.set(0, -3.0, 0);

  // Find facial parts (Names may vary per model)
  const head = scene.getObjectByName("Head") || scene;
  const mouth = scene.getObjectByName("Mouth") || scene.getObjectByName("Jaw") || null; // Adjust if needed
  const eyebrows = scene.getObjectByName("Eyebrows") || null;
  const chest = scene.getObjectByName("Chest") || null;

  const animationRef = useRef(null);
  let frame = 0;

  useEffect(() => {
    if (isSpeaking) {
      animationRef.current = setInterval(() => {
        frame++;

        // Exaggerated head movement
        if (head) {
          head.rotation.y = Math.sin(frame * 0.15) * 0.15;
          head.rotation.x = Math.cos(frame * 0.1) * 0.08;
        }

        // ✅ Fix Mouth Movement (open & close naturally)
        if (mouth) {
          mouth.position.y = Math.sin(frame * 0.2) * 0.05; // Move mouth up & down slightly
        }

        // Eyebrow movement for expression
        if (eyebrows) {
          eyebrows.position.y = Math.sin(frame * 0.2) * 0.05;
        }
      }, 100);
    } else {
      clearInterval(animationRef.current);

      // Reset positions when AI stops talking
      if (mouth) mouth.position.y = 0;
      if (head) {
        head.rotation.y = 0;
        head.rotation.x = 0;
      }
      if (eyebrows) eyebrows.position.y = 0;
    }

    return () => clearInterval(animationRef.current);
  }, [isSpeaking, mouth, head, eyebrows]);

  // Idle breathing effect
  useEffect(() => {
    const idleAnimation = setInterval(() => {
      if (chest) {
        chest.scale.y = 1 + Math.sin(frame * 0.05) * 0.02;
      }
      frame++;
    }, 100);
    return () => clearInterval(idleAnimation);
  }, [chest]);

  return <primitive object={scene} />;
}

function TalkingAvatar({ isSpeaking }) {
  return (
    <Canvas
      style={{ height: "50vh", width: "100%" }}
      camera={{ position: [0, 1.5, 3.5], fov: 40 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} />
      <AIModel isSpeaking={isSpeaking} />
      <OrbitControls />
    </Canvas>
  );
}

export default TalkingAvatar;
