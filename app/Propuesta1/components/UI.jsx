import { atom, useAtom } from "jotai";
import Image from "next/image";

export const currentPageAtom = atom("intro");

export const UI = () => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  return (
    <div className="fixed inset-0 pointer-events-none">
      <section
        className={`flex w-full h-full flex-col items-center justify-center 
      duration-500
      ${currentPage === "Propuesta1" ? "" : "opacity-0"}`}
      >
        <Image
          src="/Isotipo-secundario-csi.png"
          alt="Descripción de la imagen"
          width={100}
          height={100}
          style={{ position: "absolute", top: 20, left: 20 }}
        />

        <div className="h-[66%]"></div>
        <button
          onClick={() => setCurrentPage("store")}
          className="pointer-events-auto py-4 px-8 bg-blue-600 text-white font-black rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500"
        >
          EXPLORE SOLUTIONS
        </button>
      </section>
    </div>
  );
};
