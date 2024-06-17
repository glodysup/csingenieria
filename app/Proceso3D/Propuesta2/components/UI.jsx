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

      <header className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center py-4">
        <div className="flex gap-4">
          <button
            style={{
              textDecoration: "underline",
              textDecorationThickness: "1px",
              textUnderlineOffset: "5px",
            }}
            className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded underline"
          >
            HARNERO
          </button>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            CAJA VIBRADORA
          </button>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            TAMBOR AGLOMERADOR
          </button>
        </div>
      </header>

      <section
        className={`flex w-full h-full flex-col items-end justify-end duration-500 pr-12 pb-12  `}
      >
        <div className="h-[66%]"></div>

        <button className="pointer-events-auto py-4 px-8 bg-blue-600 text-white font-black rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500">
          VER MODELOS
        </button>
      </section>
    </div>
  );
};
