import {Scroll, useScroll} from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

const Section = (props) => {
    return(
        <section
            className={`h-screen flex flex-col justify-center p-10 ${props.right?'items-end':'items-star'}`}
            style={{
                opacity:props.opacity
            }}
            >
                <div className="w-1/2 flex items-center justify-center">
                    <div className="max-w-sm w-full">
                        <div className="bg-white rounded-lg px-8 py-12">
                            {props.children}
                        </div>
                    </div>                                 
                </div>    
            </section>
    )
}

export const Overlay = () =>{

    const scroll = useScroll()
    const [opacityFirstSection, setOpacityFirstSection]=useState(1)
    const [opacitySecondSection, setOpacitySecondSection]=useState(1)
    const [opacityLastSection, setOpacityLastSection]=useState(1)

    useFrame(() => {
        setOpacityFirstSection(1-scroll.range(0, 1/3))
        setOpacitySecondSection(scroll.curve(1/3, 1/3))
        setOpacityLastSection(scroll.range(2/3, 1/3))
    })


    return (
    <Scroll html>
        <div class="w-screen">
        <Section opacity={
            opacityFirstSection
        }>
        <h1 className="font-semibold font-serif text-2xl">Modelos de harneros</h1>
        <p className="text-gray-500">Bienvenidos al catálogo</p>
        <p className="mt-3">24/7</p>
        <ul className="leading-9">
            <li>Servicios</li>
            <li>Ficha técnica</li>
            <li>Descripción</li>
        </ul>
        <p className="animate-bounce mt-6"></p>
        </Section>
        
        <Section right opacity={
            opacitySecondSection
        }>
        <h1 className="font-semibold font-serif text-2xl">Modelos de Bombas</h1>
        <p className="text-gray-500">Nuestros servicios</p>
        <p className="mt-3">Mantenciones
            <b> 24/7</b>
        </p>
        <ul className="leading-9">
            <li>Servicios</li>
            <li>Ficha técnica</li>
            <li>Descripción</li>
        </ul>
        <p className="mt-3">Tecnología
            <b> 24/7</b>
        </p>
        <ul className="leading-9">
            <li>China</li>
            <li>Insumos</li>
            
        </ul>
        <p className="animate-bounce mt-6"></p>

        </Section >
      
        <Section opacity={
            opacityLastSection
        }       
        
        >
        <h1 className="font-semibold font-serif text-2xl">
            🤙 Desafiando el diseño
          </h1>
          <p className="text-gray-500">
            24/7
          </p>
          <p className="mt-6 p-3 bg-slate-200 rounded-lg">
            📞 <a href="tel:(+56) 4242-4242-424242">(+56) 986357768 - Comprar aquí</a>
          </p>
        </Section>
        </div>
    </Scroll> 
    )
}