"use client";

import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { slideAtom } from "./UI";
import { useAtom } from "jotai";
import { throttle } from "lodash";

export const scenes = [
  {
    path: "HarneroHidro.glb",
    mainColor: "#f9c0ff",
    name: "Harnero Ensamblado",
    description: "Modelo CS01",
    price: 72000,
    range: 660,
    scale: 1,
  },
  {
    path: "HarneroHidro.glb",
    mainColor: "#c0ffe1",
    name: "Harnero Nordberg",
    description: "Modelo CS02",
    price: 29740,
    range: 576,
    scale: 1,
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

// Material para cuando el puntero está encima
const hoverMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100,
  specular: 0xffffff,
});

// Material normal
const normalMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 100,
  specular: 0xffffff,
});

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
          child.material = normalMaterial.clone();
          child.userData.hoverMaterial = hoverMaterial.clone();
          child.userData.normalMaterial = child.material;
          child.userData.modelInfo = modelInfo;
          child.layers.set(1);
        }
      });

      mesh.position.set(0, 1, 0);
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

export const Experience = () => {
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const mountRef = useRef(null);
  const harneroMeshRef = useRef(null);
  const controlRef = useRef(null);
  const sceneRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [lastSelectedObject, setLastSelectedObject] = useState(null);
  const [selectedObjectName, setSelectedObjectName] = useState("");

  useEffect(() => {
    const handlePointerMove = throttle((event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    }, 100); // Actualiza cada 100ms

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let camera;

    window.addEventListener("pointermove", handlePointerMove);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    camera.position.set(0, 3, 9);
    camera.layers.enable(1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update();

    controlRef.current = controls;

    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.44, 1);
    spotLight.position.set(0, 25, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(8, -1, 10);
    scene.add(directionalLight);

    /*  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(0, 0, -10);
    scene.add(directionalLight2);

    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh); */

    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32); // Aumenta las subdivisiones para más detalles
    groundGeometry.rotateX(-Math.PI / 2);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load("/textures/terrain-normal.jpg");
    const roughnessTexture = textureLoader.load(
      "/textures/terrain-roughness.jpg"
    );

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000, // Gris más oscuro
      side: THREE.DoubleSide,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.8,
      metalness: 0,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = true;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    loadModel(sceneRef.current, scenes[2], (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      harneroMeshRef.current = mesh;
    });

    const loader = new GLTFLoader().setPath("/medias/");

    loader.load(
      "HARNEROS_MANTENIBLES.glb",
      (gltf) => {
        console.log("loading model");
        const mesh = gltf.scene;

        mesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.roughness = 0.2;
            child.material.metalness = 0.1;
            child.material.shininess = 90;
          }
        });
        mesh.position.set(-5.2, 2, 0.5);
        mesh.rotateY(0.7);

        mesh.scale.set(0.3, 0.3, 0.3);

        scene.add(mesh);

        document.getElementById("progress-container").style.display = "none";
      },
      (xhr) => {
        console.log(`loading ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error(error);
      }
    );

    let lastPointerMove = 0;
    const pointerMoveInterval = 100;
    let now = Date.now();

    let targetScale;
    let intersects = [];
    let newHighlighted = new Set();
    let highlightedObjects = new Set();
    const scaleFactor = 1.25;
    const lerpFactor = 0.3;

    function animate() {
      requestAnimationFrame(animate);

      now = Date.now();
      if (now - lastPointerMove > pointerMoveInterval) {
        raycaster.setFromCamera(pointer, camera);
        updateHighlightedObjects();
        lastPointerMove = now;
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    function updateHighlightedObjects() {
      raycaster.layers.set(1);
      intersects = raycaster.intersectObjects(scene.children, true);
      newHighlighted = new Set(intersects.map((intersect) => intersect.object));

      highlightedObjects.forEach((obj) => {
        if (!newHighlighted.has(obj)) {
          if (obj.userData.normalMaterial) {
            obj.material = obj.userData.normalMaterial;
          } else {
            console.warn("Normal material is undefined for object:", obj);
          }
        }
      });

      let lastHighlightedObject = null;

      intersects.forEach(({ object }) => {
        if (object.userData.hoverMaterial) {
          object.material = object.userData.hoverMaterial;
        }

        lastHighlightedObject = object;
      });

      if (lastHighlightedObject) {
        setShowOptions(true);
        setLastSelectedObject(lastHighlightedObject);
        setSelectedObjectName(lastHighlightedObject.name);
      }

      highlightedObjects = newHighlighted;
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("click", (event) => {
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length === 0) {
        setShowOptions(false);
      }
    });

    return () => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();

      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (lastSlide.current === slide) {
      return;
    }

    if (harneroMeshRef.current) {
      sceneRef.current.remove(harneroMeshRef.current);
      disposeModel(harneroMeshRef.current);
      harneroMeshRef.current = null;
    }

    loadModel(sceneRef.current, scenes[slide], (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      harneroMeshRef.current = mesh;
    });

    lastSlide.current = slide;

    return () => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
        harneroMeshRef.current = null;
      }
    };
  }, [slide]);

  return (
    <>
      <div ref={mountRef} style={{ height: "100vh" }}></div>
      {showOptions && lastSelectedObject && (
        <div
          className="fixed bg-white text-black p-5 rounded-lg shadow-lg max-w-xs z-50 space-y-4"
          style={{
            top: "20%",
            right: "10%",
          }}
        >
          <h2 className="font-bold">{selectedObjectName}</h2>
          <p>{lastSelectedObject.userData.modelInfo.description}</p>
          <p className="mt-2 italic text-gray-500">
            Repuestos CSI Piezas confiables de alta calidad
          </p>
          <div className="flex flex-row space-x-2">
            <button className="pointer-events-auto py-2 px-4 bg-transparent text-blue-600 border border-blue-600 font-black rounded-full hover:bg-blue-800 hover:text-white cursor-pointer transition-colors duration-500 z-20">
              Datasheet
            </button>
            <button className="pointer-events-auto py-2 px-4 bg-blue-600 text-white border border-blue-600 font-black rounded-full hover:bg-blue-800 hover:text-white cursor-pointer transition-colors duration-500 z-20 flex items-center space-x-2">
              <span>Agregar al carrito</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l1.4-7H6.4M7 13L6 18h12M7 13l1.4 7H17m-7-7H6m1 7a1 1 0 102 0 1 1 0 00-2 0zM5 21a1 1 0 102 0 1 1 0 00-2 0zM17 21a1 1 0 102 0 1 1 0 00-2 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
