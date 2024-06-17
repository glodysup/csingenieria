"use client";

import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { throttle } from "lodash";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import * as BufferGeometryUtils from "../../../../utils/BufferGeometryUtils.js";

export const scenes = [
  {
    path: "HarneroMain2.glb",
    mainColor: "#f9c0ff",
    name: "Harnero - Seleccione el modelo",
    description: "Modelo CS01",
    price: 72000,
    range: 660,
    scale: 0.45,
    url: "Propuesta5/Harnero",
  },
  {
    path: "CajaMain.glb",
    mainColor: "#c0ffe1",
    name: "Harnero Nordberg",
    description: "Modelo CS02",
    price: 29740,
    range: 576,
    scale: 1.4,
    url: "/caja",
  },
  {
    path: "tamborAmarillo.glb",
    mainColor: "#ffdec0",
    name: "Harnero Hidro Escurridor",
    description: "Modelo CS03",
    price: 150000,
    range: 800,
    scale: 0.25,
    url: "/tambor",
  },
];

// Material normal
const normalMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 100,
  specular: 0xffffff,
});

// Material para cuando el puntero está encima
const hoverMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100,
  specular: 0xffffff,
});

const loader = new GLTFLoader().setPath("/medias/");
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);
const pointer = new THREE.Vector2();

function loadModel(scene, modelInfo, position, onLoaded) {
  loader.load(
    modelInfo.path,
    (gltf) => {
      const mesh = gltf.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          let color = child.material.color;
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = normalMaterial.clone();
          child.userData.hoverMaterial = hoverMaterial.clone();
          child.userData.normalMaterial = child.material;
          child.userData.modelInfo = modelInfo;
          child.material.color = color;
          child.layers.set(1);
        }
      });

      mesh.position.set(position.x, position.y, position.z);
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

function combineMeshes(mesh, color, position, modelInfo) {
  const geometries = [];
  const materials = [];
  const materialMap = new Map();

  mesh.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry.clone();
      geometry.applyMatrix4(child.matrixWorld);

      color = child.material.color;
      child.userData.hoverMaterial = hoverMaterial.clone();
      child.userData.normalMaterial = normalMaterial.clone();
      child.material = normalMaterial.clone();
      child.material.color = color;
      child.castShadow = true;
      child.receiveShadow = true;

      let materialIndex = materialMap.get(child.material);
      if (materialIndex === undefined) {
        materialIndex = materials.length;
        materialMap.set(child.material, materialIndex);
        materials.push(child.material);
      }

      const groups = geometry.groups;
      for (let i = 0; i < groups.length; i++) {
        groups[i].materialIndex = materialIndex;
      }

      geometries.push(geometry);
    }
  });

  if (geometries.length > 0) {
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      geometries,
      true
    );
    const combinedMesh = new THREE.Mesh(mergedGeometry, materials);

    combinedMesh.position.set(position.x, position.y, position.z);
    combinedMesh.scale.set(modelInfo.scale, modelInfo.scale, modelInfo.scale);
    combinedMesh.castShadow = true;
    combinedMesh.receiveShadow = true;
    combinedMesh.layers.set(1);

    return combinedMesh;
  }
}

export const Experience = () => {
  const mountRef = useRef(null);
  const harneroMeshRef = useRef(null);
  const tamborAglomeradorMeshRef = useRef(null);
  const cajaVibradoraMeshRef = useRef(null);
  const controlRef = useRef(null);
  const sceneRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [lastSelectedObject, setLastSelectedObject] = useState(null);
  const [selectedObjectName, setSelectedObjectName] = useState("");

  const { text } = useTypewriter({
    words: ["HARNERO", "TAMBOR AGLOMERADO", "CAJA VIBRADORA"],
    loop: {},
    typeSpeed: 120,
    deleteSpeed: 80,
  });

  useEffect(() => {
    let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    const handlePointerMove = throttle((event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, 100); // Actualiza cada 100ms

    window.addEventListener("pointermove", handlePointerMove);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    camera.position.set(0, 3, 8);
    camera.layers.enable(1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 2.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update();

    controlRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Añadir luz ambiental
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.44, 1);
    spotLight.position.set(0, 25, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(8, 3, -3);
    /*   directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;*/
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-8, 5, 5);
    /*   directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize.width = 2048;
    directionalLight2.shadow.mapSize.height = 2048;*/
    scene.add(directionalLight2);

    const groundGeometry = new THREE.PlaneGeometry(25, 5, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.ShadowMaterial({
      opacity: 0.3, // Ajusta este valor para cambiar el tono de la sombra
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.set(0, -1.5, 0);
    scene.add(groundMesh);

    loadModel(sceneRef.current, scenes[0], { x: 0, y: -1, z: 0 }, (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      harneroMeshRef.current = mesh;
    });

    let lastPointerMove = 0;
    const pointerMoveInterval = 200;
    let now = Date.now();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      now = Date.now();
      if (now - lastPointerMove > pointerMoveInterval) {
        raycaster.setFromCamera(pointer, camera);
        updateHighlightedObjects();
        lastPointerMove = now;
      }

      try {
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera);
      } catch (error) {
        console.error("Error during render:", error);
      }
    }

    let targetScale;
    let intersects = [];
    let newHighlighted = new Set();
    let highlightedObjects = new Set();
    const scaleFactor = 1.25;
    const lerpFactor = 0.3;

    function updateHighlightedObjects() {
      intersects = raycaster.intersectObjects(scene.children, true);
      newHighlighted = new Set(intersects.map((intersect) => intersect.object));

      highlightedObjects.forEach((obj) => {
        if (!newHighlighted.has(obj)) {
          if (obj.userData.normalMaterial) {
            obj.material = obj.userData.normalMaterial;
          } else {
            console.warn("Normal material is undefined for object:", obj);
          }
          if (obj.userData.originalScale) {
            obj.scale.copy(obj.userData.originalScale);
          }
        }
      });

      let lastHighlightedObject = null;

      intersects.forEach(({ object }) => {
        if (object.userData.hoverMaterial) {
          object.material = object.userData.hoverMaterial.clone();
        }

        /*  if (!object.userData.originalScale) {
          object.userData.originalScale = object.scale.clone();
        }
        targetScale = object.userData.originalScale
          .clone()
          .multiplyScalar(scaleFactor);
        object.scale.lerp(targetScale, lerpFactor);*/

        lastHighlightedObject = object;
      });

      if (lastHighlightedObject) {
        setShowOptions(true);
        setLastSelectedObject(lastHighlightedObject);
        setSelectedObjectName(lastHighlightedObject.name);
      }

      highlightedObjects = new Set(newHighlighted);
    }

    function handleMouseClick(event) {
      //raycaster.setFromCamera(pointer, camera);
      // const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        console.log("VARIABLE: " + intersects);
        const firstIntersect = intersects[0].object;
        setShowOptions(true);
        setLastSelectedObject(firstIntersect);
        setSelectedObjectName(firstIntersect.userData.modelInfo.name);
      } else {
        setShowOptions(false);
        console.log("VARIABLE: FALSE" + intersects);
      }
    }

    function disposeModel(mesh) {
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("click", handleMouseClick);

    animate();

    return () => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      if (tamborAglomeradorMeshRef.current) {
        sceneRef.current.remove(tamborAglomeradorMeshRef.current);
        disposeModel(tamborAglomeradorMeshRef.current);
      }
      if (cajaVibradoraMeshRef.current) {
        sceneRef.current.remove(cajaVibradoraMeshRef.current);
        disposeModel(cajaVibradoraMeshRef.current);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (controlRef.current) {
        controlRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.children.forEach((child) => disposeModel(child));
      }
      renderer.dispose();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2"
          autoPlay
          muted
          loop
        >
          <source src="/medias/videos/FondoHarneros.mp4" type="video/mp4" />
        </video>
      </div>
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full"></div>

      <div className="absolute bottom-0 w-full overflow-hidden leading-none -z-10">
        <svg
          viewBox="0 0 1200 265"
          preserveAspectRatio="none"
          className="relative block w-full h-full"
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="5"
                dy="4"
                stdDeviation="10"
                floodColor="black"
                floodOpacity="0.9"
              />
            </filter>
          </defs>
          <polygon
            points="0,0 600,75 1200,0 1200,300 0,300"
            fill="white"
          ></polygon>
          <polygon
            points="0,0 600,150 1200,0"
            fill="transparent"
            style={{ filter: "url(#shadow)" }}
          ></polygon>
        </svg>
      </div>
      {showOptions && lastSelectedObject && (
        <div
          className="fixed bg-white text-black p-5 rounded-lg shadow-lg max-w-xs z-50 space-y-4"
          style={{
            top: "50%",
            right: "10%",
          }}
          onClick={(e) => e.stopPropagation()} // Prevenir que el clic en el modal cierre el modal
        >
          <h2 className="font-bold">{selectedObjectName}</h2>
          <select className="pointer-events-auto py-2 px-4 bg-transparent border border-gray-600 rounded-full">
            <option>Modelo CSI-01</option>
            <option>Modelo CSI-02</option>
            <option>Modelo CSI-03</option>
          </select>
          <p>Número de parte: {"0023455190"}</p>
          <p className="mt-2 italic text-gray-500">
            Descripción: Repuestos CSI Piezas confiables de alta calidad
          </p>
          <div className="flex flex-col space-y-2">
            <button className="pointer-events-auto py-2 px-4 bg-transparent text-blue-600 border border-blue-600 font-bold rounded-full hover:bg-blue-800 hover:text-white cursor-pointer transition-colors duration-500">
              Cotizar
            </button>
            <a
              href="/pdfs/HarneroPDF.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-800 cursor-pointer transition-colors duration-500"
            >
              Descargar ficha técnica
            </a>
          </div>
        </div>
      )}

      <div
        className="fixed text-black p-5 max-w-xl z-50 space-y-4"
        style={{
          top: "70%",
          left: "2%",
        }}
      >
        <p></p>
        <p className="mt-2 italic text-gray-500">
          Estos términos se utilizan solo para propósitos de identificación y no
          representan afiliación con, o aprobación de Metso o FLSmidth/FLS.
          Todas las piezas son fabricadas por y para FLSmidth Inc. - Operaciones
          en Pekin y cuentan con su garantía; y no son fabricadas, adquiridas ni
          garantizadas por el fabricante de equipo original.
        </p>
      </div>
    </>
  );
};
