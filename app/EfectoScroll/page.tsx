"use client";

import Link from "next/link";
import dynamic from "next/dynamic.js";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const Scene = dynamic(() => import("../components/ScrollEffect"), {
  //Importación asincrona
  ssr: false,
});

export default function EfectoScroll() {
  return (
    <>
      <main className="relative h-screen m-0 p-0">
        <div className="absolute mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <Link
            href="/"
            className="absolute bg-gray-300 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            rel="noopener noreferrer"
            style={{ zIndex: 5 }}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Volver a inicio{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Animación de ejemplo usando Three.JS
            </p>
          </Link>
        </div>

        <Canvas
          camera={{
            fov: 64,
            position: [2.3, 1.5, 2.3],
          }}
        >
          <Scene />
        </Canvas>
      </main>
    </>
  );
}
