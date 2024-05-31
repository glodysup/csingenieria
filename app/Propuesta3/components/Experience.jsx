"use client";

import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { slideAtom } from "./UI";
import { useAtom } from "jotai";

export const scenes = [
  {
    path: "HarneroCentrado.glb",
    mainColor: "#f9c0ff",
    name: "Harnero Ensamblado",
    description: "Modelo CS01",
    price: 72000,
    range: 660,
    scale: 0.6,
  },
  {
    path: "HarneroNor.glb",
    mainColor: "#c0ffe1",
    name: "Harnero Nordberg",
    description: "Modelo CS02",
    price: 29740,
    range: 576,
    scale: 0.6,
  },
  {
    path: "HarneroHidro.glb",
    mainColor: "#ffdec0",
    name: "Harnero Hidro Escurridor",
    description: "Modelo CS03",
    price: 150000,
    range: 800,
    scale: 1,
  },
];

const loader = new GLTFLoader().setPath("/medias/");

function loadModel(scene, modelInfo, onLoaded) {
  loader.load(
    modelInfo.path,
    (gltf) => {
      const mesh = gltf.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshPhongMaterial({
            //color: modelInfo.mainColor,
            shininess: 100,
            specular: 0xffffff,
            metalness: 0.9,
            roughness: 0.9,
          });
        }
      });

      mesh.position.set(0, 0, 0);
      mesh.scale.set(modelInfo.scale, modelInfo.scale, modelInfo.scale);
      scene.add(mesh);
      if (onLoaded) onLoaded(mesh);
    },
    undefined,
    (error) => {
      console.error("An error happened loading the model:", error);
    }
  );
}

export const Experience = () => {
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const mountRef = useRef(null); // Referencia para montar el canvas
  const harneroMeshRef = useRef(null); //// Referencia para almacenar el objeto HarneroOptimizado1
  const controlRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true }); //WebGLRenderer es un componente de Three.js que se encarga de dibujar las escenas 3D definidas por el usuario en un elemento <canvas> en la página web.
    renderer.outputColorSpace = THREE.SRGBColorSpace; //Usado como estandar mundial para la representación del color, recomendado para precisión.

    renderer.setSize(window.innerWidth, window.innerHeight); // Asegurar que la salida del renderizador llene la ventana del navegador.
    renderer.setClearColor(0x000000); //establece el color de fondo del renderizador.
    renderer.setPixelRatio(window.devicePixelRatio); //Asegurar que el renderizado se vea nítido y claro en dispositivos con diferentes densidades de píxeles.

    renderer.shadowMap.enabled = true; //Habilitar el sistema de sombras en el renderizador para que las luces en la escena puedan proyectar sombras.
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //Definir el algoritmo utilizado para crear sombras en la escena, optando por uno que produce sombras más suaves y naturales.

    mountRef.current.appendChild(renderer.domElement); // Usa la ref para montar el canvas de Three.js

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45, // representa el campo de visión en grados verticales.
      window.innerWidth / innerHeight, //calcula la relación de aspecto de la cámara
      1, // distancia del plano más cercano a la cámara, más allá del cual los objetos son visibles.
      1000 // es la distancia del plano más lejano visible desde la cámara.
    );

    camera.position.set(0, 3, 9);
    //camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement); //renderer.domElement: elemento del DOM en el que se renderiza la escena y que capturará los eventos del mouse para la interacción. Usualmente, este es el lienzo (canvas) creado por el renderizador de Three.js. Pasar este parámetro asegura que los eventos de mouse están correctamente vinculados al área de visualización correcta.
    controls.enableDamping = true;
    controls.enablePan = false;
    //  controls.enableZoom = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update(); // recalcula y actualiza la posición de la cámara basada en las interacciones del usuario. Esto incluye el seguimiento de movimientos del ratón y gestos en dispositivos táctiles que afectan la orientación, el acercamiento (zoom) y la posición panorámica de la cámara en la escena. Cada vez que un usuario realiza una acción que debería alterar la vista, controls.update() aplica estos cambios a la cámara.

    controlRef.current = controls;

    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.44, 1);
    spotLight.position.set(0, 25, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    //const light = new THREE.AmbientLight(0xffffff); // soft white light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(8, -1, 10);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(0, 0, -10);
    scene.add(directionalLight2);

    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32); //32,32 Los siguientes dos números indican cuántos segmentos dividirán el plano a lo largo del ancho y el alto, respectivamente.
    groundGeometry.rotateX(-Math.PI / 2); //alinea el plano con el eje XZ,
    const groundMaterial = new THREE.MeshStandardMaterial({
      //Este es un material estándar en Three.js que soporta sombras y iluminación físicamente correctas. Es adecuado para la mayoría de los casos de uso donde los materiales necesitan interactuar de manera realista con diferentes fuentes de luz.
      color: 0x555555,
      side: THREE.DoubleSide, //Esta propiedad define que ambos lados del plano deben ser visibles. Por defecto, los materiales en Three.js son visibles solo desde el frente (THREE.FrontSide)
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial); //objetos 3D a la escena.
    groundMesh.castShadow = false; // Aquí está configurada como false, lo que significa que el plano no arrojará sombras.
    groundMesh.receiveShadow = true; //permite que el objeto reciba sombras de otros objetos que sí arrojan sombras.
    scene.add(groundMesh);

    /*********************************HASTA AQUÍ ES SOLO SETUP DE CÁMARA, LUCES, GROUND ********************/

    loadModel(sceneRef.current, scenes[0], (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current); // Limpieza previa
        // Dispose materials and geometry as needed
      }
      harneroMeshRef.current = mesh;
    });

    const loader = new GLTFLoader().setPath("/medias/");

    loader.load(
      "LETRASTEXTURIZADAS.glb",
      (gltf) => {
        console.log("loading model");
        const mesh = gltf.scene;

        mesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.roughness = 0.2; // Hace que la superficie sea más reflectante
            child.material.metalness = 0.1; // Añade un poco de reflectancia metálica
            child.material.shininess = 90;
          }
        });
        mesh.position.set(-4.5, 1.8, 1);
        mesh.rotateY(0.7);

        mesh.scale.set(0.4, 0.4, 0.4);

        scene.add(mesh);

        document.getElementById("progress-container").style.display = "none";
      },
      (xhr) => {
        //xhr representa un objeto relacionado con la petición de XMLHttpRequest utilizada para cargar los recursos
        console.log(`loading ${(xhr.loaded / xhr.total) * 100}%`); //Este callback se llama repetidamente durante la carga y es especialmente útil para informar al usuario sobre el progreso
      },
      (error) => {
        console.error(error);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      if (harneroMeshRef.current) {
        harneroMeshRef.current.rotation.y += 0.005; // Rotar el objeto en el eje Y
      }
      //loader..rotation.y += 0.005;
    }

    animate();

    return () => {
      //Retorno de useEffect
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current); // Limpieza final
        // Dispose materials and geometry as needed
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); //Fin del useEffect

  useEffect(() => {
    if (lastSlide.current === slide) {
      return;
    }

    if (harneroMeshRef.current) {
      //Animación de transición podría ir aquí
      sceneRef.current.remove(harneroMeshRef.current);
      harneroMeshRef.current = null;

      /*  // Limpiar la referencia
  harneroMeshRef.current.material.dispose();
  sceneRef.current.remove(harneroMeshRef);*/
    }

    const scene = sceneRef.current;

    //Hacer función que llame a loader.

    loadModel(sceneRef.current, scenes[slide], (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current); // Limpieza previa
        // Dispose materials and geometry as needed
      }
      harneroMeshRef.current = mesh;
    });

    lastSlide.current = slide;

    return () => {
      if (harneroMeshRef.current) {
        //scene.remove(harneroMeshRef.current);

        sceneRef.current.remove(harneroMeshRef.current);
        harneroMeshRef.current = null;

        /*  // Limpiar la referencia
    harneroMeshRef.current.material.dispose();
    sceneRef.current.remove(harneroMeshRef);*/
      }
    };
  }, [slide]);

  return <div ref={mountRef} style={{ height: "100vh" }}></div>;
};
