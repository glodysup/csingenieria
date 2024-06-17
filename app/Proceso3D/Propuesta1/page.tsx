"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";
import { UI } from "./components/UI";
import { OrbitControls } from "@react-three/drei";

export default function Propuesta1() {
  return (
    <>
      <main className="relative h-screen">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <color attach="background" args={["#171720"]} />
          <fog attach="fog" args={["#171720", 10, 30]} />

          <Suspense>
            <Experience />
          </Suspense>

          <EffectComposer>
            <Bloom mipmapBlur intensity={1.2} />
          </EffectComposer>
        </Canvas>
        <UI />
      </main>
    </>
  );
}
