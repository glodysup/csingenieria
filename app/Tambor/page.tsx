"use client";

import * as THREE from "three";
import { useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience.jsx";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";
import { UI } from "../components/UI";
import { OrbitControls, ScrollControls } from "@react-three/drei";

import dynamic from "next/dynamic.js";

export default function Propuesta2() {
  return (
    <>
      <main className="relative h-screen">
        <ambientLight intensity={2.5} />

        <Experience />
        <UI />
      </main>
    </>
  );
}
