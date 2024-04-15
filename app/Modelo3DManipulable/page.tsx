import dynamic from "next/dynamic.js";
import Link from "next/link";

const SceneManipulable = dynamic(() => import("./SceneManipulable"), {
  //Importación asincrona
  ssr: false,
});

export default function Modelo3DManipulable() {
  return (
    <>
      <main className="relative">
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

        <SceneManipulable />
      </main>
    </>
  );
}
