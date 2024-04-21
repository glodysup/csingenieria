import { atom, useAtom } from "jotai";
import Image from "next/image";

export const currentPageAtom = atom("intro");

export const UI = () => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  return (
    <div className="fixed inset-0 pointer-events-none">
      <Image
        src="/Horizontal-secundario-csi.png"
        alt="Descripción de la imagen"
        width={200}
        height={100}
        style={{ position: "absolute", top: 20, left: 20 }}
      />

      <Image
        src="/userIcon.png"
        alt="Descripción de la imagen"
        width={75}
        height={75}
        style={{ position: "absolute", top: 5, right: 5 }}
      />

      <section
        className={`flex w-full h-full flex-col items-center justify-center 
      duration-500
      ${currentPage === "Propuesta1" ? "" : "opacity-0"}`}
      >
        <div className="h-[66%]"></div>

        <button
          onClick={() => setCurrentPage("store")}
          className="pointer-events-auto py-4 px-8 bg-blue-600 text-white font-black rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500"
        >
          EXPLORE SOLUTIONS
        </button>
      </section>

      <div className="h-[66%]"></div>
      <button
        onClick={() => setCurrentPage("Propuesta1")}
        className={`pointer-events-auto absolute bottom-1/4 inset-x-0 mx-auto w-max px-8 py-4 bg-blue-600 text-white font-black rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500 transition-opacity duration-500 ${
          currentPage === "store" ? "" : "opacity-0"
        }`}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        VOLVER
      </button>
    </div>
  );
};
