//import Scene from "../components/Scene.jsx";
import Link from "next/link";
import dynamic from "next/dynamic.js";

const Scene = dynamic(() => import("./Scene"), {
  //Importación asincrona
  ssr: false,
});

//
export default function Modelo3D() {
  return (
    <main className="relative h-screen">
      <div className="relative mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/"
          className="absolute group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          style={{ zIndex: 6 }}
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
      <Scene />
    </main>
  );
}
