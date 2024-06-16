"use client";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { atom, useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { scenes } from "./Experience";
import { degToRad, lerp } from "three/src/math/MathUtils";
//export const currentPageAtom = atom("intro");

export const slideAtom = atom(0);

export const UI = () => {
  //const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [text] = useTypewriter({
    words: [
      "AUMENTE SU CONFIABILIDAD",
      "MEJOR DISEÑO",
      "MEJOR RENDIMIENTO",
      "REPUESTOS CS INGENIERÍA",
    ],
    loop: {},
    typeSpeed: 40,
    deleteSpeed: 20,
  });

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

      <header className="pointer-events-auto absolute top-0 right-0 w-full flex justify-end items-center py-4 pr-5">
        <div className="flex gap-1 relative">
          <div className="group">
            <button
              style={{
                textDecoration: "underline",
                textDecorationThickness: "1px",
                textUnderlineOffset: "5px",
              }}
              className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded underline focus:outline-none"
            >
              Inicio
            </button>
          </div>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            Centro de reparaciones
          </button>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            Productos
          </button>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            Contacto
          </button>
        </div>
      </header>
    </div>
  );
};
/**
 *  <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center z-50 font-montserrat text-white font-bold text-5xl text-center space-y-4">
        <span className="font-extrabold text-5xl">
          CENTRO DE CUSTOMIZACIÓN DE EQUIPOS
        </span>
        <span className="font-extrabold text-3xl">{text}</span>
      </div>

       <Image
            src="/medias/images/carrito.png"
            alt="Descripción de la imagen"
            width={50}
            height={50}
          />
 */
