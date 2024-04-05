//import Scene from "../components/Scene.jsx";
import dynamic from "next/dynamic.js";

const Scene = dynamic(() => import("../components/Scene"), {
  ssr: false,
});

export default function Modelo3D() {
  return (
    <main className="relative h-screen">
      <Scene />
    </main>
  );
}
