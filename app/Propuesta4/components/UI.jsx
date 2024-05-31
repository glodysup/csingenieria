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
    </div>
  );
};
