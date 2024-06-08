"use client";

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
              INICIO
            </button>
          </div>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            CENTRO DE REPARACIONES
          </button>
          <button className="text-white hover:text-blue-500 font-medium py-2 px-4 rounded">
            CONTÁCTO
          </button>
        </div>
      </header>
    </div>
  );
};
