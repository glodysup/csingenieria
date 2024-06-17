import { atom, useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { scenes } from "./Experience";
import { degToRad, lerp } from "three/src/math/MathUtils";
//export const currentPageAtom = atom("intro");

export const slideAtom = atom(0);

export const UI = () => {
  //const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setVisible(false);
    //Aquí, si cambia el slide se debe borrar el Harnero
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 500);
  }, [slide]);

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

      <header className="pointer-events-auto absolute top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center py-4">
        <div className="flex gap-4 relative">
          <div className="group">
            <button
              style={{
                textDecoration: "underline",
                textDecorationThickness: "1px",
                textUnderlineOffset: "5px",
              }}
              className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded underline focus:outline-none"
            >
              HARNERO
            </button>
            <div className="absolute left-0 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out hidden group-hover:flex">
              <div className="text-gray-800 font-bold py-2 px-4 rounded-t bg-blue-100">
                Modelos
              </div>
              <a
                href="#"
                className="text-gray-800 hover:text-blue-500 font-medium py-2 px-4 rounded"
              >
                CS-01
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-blue-500 font-medium py-2 px-4 rounded"
              >
                CS-02
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-blue-500 font-medium py-2 px-4 rounded"
              >
                CS-03
              </a>
            </div>
          </div>
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
      </section>

      <div
        className={`fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col justify-between pointer-events-none text-black ${
          visible ? "" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        <div className="absolute top-0 bottom-0 left-0 right-0 flex-1 flex items-center justify-between p-4">
          <svg
            onClick={() =>
              setSlide((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))
            }
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
            onClick={() =>
              setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0))
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>

        <div></div>

        <div className="bg-gradient-to-t from-white/90 pt-20 pb-10 p-4 flex items-center flex-col text-center">
          <h1 className="text-5xl font-extrabold">
            {scenes[displaySlide].name}
          </h1>

          <p className="text-opacity-60 italic">
            {scenes[displaySlide].description}
          </p>
          <div className="flex items-center gap-12 mt-10">
            <div className="flex flex-col items-center">
              <div className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
                <p className="font-semibold text-3xl">
                  ${scenes[displaySlide].price.toLocaleString()}
                </p>
              </div>
              <p className="text-sm opacity-80">Despues de impuestos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z"
                  />
                </svg>
                <p className="font-semibold text-3xl">
                  {scenes[displaySlide].range} m/s2
                </p>
              </div>
              <p className="text-sm opacity-80">Eficiencia</p>
            </div>
            <button className="pointer-events-auto py-4 px-8 bg-blue-600 text-white font-black rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500 z-20">
              COMPRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
