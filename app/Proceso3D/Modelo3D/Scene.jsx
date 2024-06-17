"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment } from "@react-three/drei";

//Atributo de "Canvas" style={{backgroundColor: "black"}}
export default function Scene() {
  return (
    <Canvas>
      <directionalLight intensity={3} position={(0, 3, 2)} />
      <Environment preset="city" />
      <Model />
    </Canvas>
  );
}
