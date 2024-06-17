"use client";

import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { slideAtom } from "./UI";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { throttle } from "lodash";

export const scenes = [
  {
    path: "HarneroNor.glb",
    mainColor: "#f9c0ff",
    name: "Harnero Ensamblado",
    description: "Modelo CS01",
    price: 72000,
    range: 660,
    scale: 0.3,
    Category: "Harnero",
    SubCategories: 2,
  },
  {
    path: "HarneroNor.glb",
    mainColor: "#c0ffe1",
    name: "Harnero Nordberg",
    description: "Modelo CS02",
    price: 29740,
    range: 576,
    scale: 0.3,
    Category: "Tambor aglomerador",
    SubCategories: 3,
  },
  {
    path: "HarneroNor.glb",
    mainColor: "#ffdec0",
    name: "Harnero Hidro Escurridor",
    description: "Modelo CS03",
    price: 150000,
    range: 800,
    scale: 0.3,
    Category: "Caja vibradora",
    SubCategories: 5,
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

function loadModel(scene, modelInfo, position, onLoaded) {
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
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(modelInfo.scale, modelInfo.scale, modelInfo.scale);

      if (!mesh.userData.originalScale) {
        mesh.userData.originalScale = mesh.scale.clone();
      }

      scene.add(mesh);
      if (onLoaded) onLoaded(mesh);
    },
    undefined,
    (error) => {
      console.error("An error happened loading the model:", error);
    }
  );
}

const createInvisiblePanel = (width, height, position) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0, // Invisible
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.copy(position);
  return plane;
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export const Experience = () => {
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const mountRef = useRef(null);
  const harneroMeshRef = useRef(null);
  const tamborAglomeradorMeshRef = useRef(null);
  const cajaVibradoraMeshRef = useRef(null);
  const controlRef = useRef(null);
  const sceneRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [lastSelectedObject, setLastSelectedObject] = useState(null);

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
      raycaster.setFromCamera(pointer, camera);
    }, 100); // Actualiza cada 100ms

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

    /*   camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );*/

    camera.position.set(0, 3, 8);
    camera.layers.enable(1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableZoom = false;
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

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(0, 0, -10);
    scene.add(directionalLight2);

    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load("/medias/images/FondoCSI.jpg");
    backgroundTexture.wrapS = THREE.ClampToEdgeWrapping;
    backgroundTexture.wrapT = THREE.ClampToEdgeWrapping;

    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: backgroundTexture,
      transparent: true,
      opacity: 0.5,
    });

    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15),
      backgroundMaterial
    );

    backgroundMesh.position.set(0, 6.5, -15);
    scene.add(backgroundMesh);

    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    /* const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load("/textures/terrain-normal.jpg");
    const roughnessTexture = textureLoader.load(
      "/textures/terrain-roughness.jpg"
    );

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;

    scene.add(groundMesh);*/

    loadModel(sceneRef.current, scenes[0], { x: 0, y: 1, z: 0 }, (mesh) => {
      if (harneroMeshRef.current) {
        sceneRef.current.remove(harneroMeshRef.current);
        disposeModel(harneroMeshRef.current);
      }
      harneroMeshRef.current = mesh;
    });

    loadModel(sceneRef.current, scenes[1], { x: 4.5, y: 1, z: 0 }, (mesh) => {
      if (tamborAglomeradorMeshRef.current) {
        sceneRef.current.remove(tamborAglomeradorMeshRef.current);
        disposeModel(tamborAglomeradorMeshRef.current);
      }
      tamborAglomeradorMeshRef.current = mesh;
    });

    loadModel(sceneRef.current, scenes[2], { x: -4.5, y: 1, z: 0 }, (mesh) => {
      if (cajaVibradoraMeshRef.current) {
        sceneRef.current.remove(cajaVibradoraMeshRef.current);
        disposeModel(cajaVibradoraMeshRef.current);
      }
      cajaVibradoraMeshRef.current = mesh;
    });

    let lastPointerMove = 0;
    const pointerMoveInterval = 100;
    let now = Date.now();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      if (harneroMeshRef.current) {
        harneroMeshRef.current.rotation.y += 0.005;
      }

      if (tamborAglomeradorMeshRef.current) {
        tamborAglomeradorMeshRef.current.rotation.y += 0.005;
      }

      if (cajaVibradoraMeshRef.current) {
        cajaVibradoraMeshRef.current.rotation.y += 0.005;
      }

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
          if (obj.userData.originalScale) {
            obj.scale.copy(obj.userData.originalScale);
          }
        }
      });

      intersects.forEach(({ object }) => {
        if (object.userData.hoverMaterial) {
          object.material = object.userData.hoverMaterial;
        }

        if (!object.userData.originalScale) {
          object.userData.originalScale = object.scale.clone();
        }
        targetScale = object.userData.originalScale
          .clone()
          .multiplyScalar(scaleFactor);
        object.scale.lerp(targetScale, lerpFactor);

        setShowOptions(true);
        setLastSelectedObject(object);
      });

      highlightedObjects = new Set(newHighlighted);
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

    window.addEventListener("click", (event) => {
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length === 0) {
        setShowOptions(false);
      }
    });

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
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ height: "100vh" }}></div>
      {showOptions && (
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center gap-6 p-6 bg-gradient-to-t from-gray-800 to-transparent bg-opacity-70">
          <div
            className="w-1/2 h-0.5 rounded-full mb-4"
            style={{ backgroundColor: "#00ff00", opacity: 0.5 }}
          ></div>

          <h1 className="text-5xl font-extrabold">
            {lastSelectedObject &&
              lastSelectedObject.userData.modelInfo.Category}
          </h1>
          <p className="text-opacity-60 italic">
            {lastSelectedObject?.userData?.modelInfo?.description}
          </p>

          <div className="flex justify-center gap-6">
            {[
              ...Array(
                lastSelectedObject?.userData?.modelInfo?.SubCategories || 0
              ),
            ].map((_, index) => (
              <Link
                key={index}
                href={`/Proceso3D/Propuesta4/SpecificMachine`}
                passHref
              >
                <div
                  key={index}
                  className="w-28 h-28 bg-white flex items-center justify-center rounded-lg hover:border-2 hover:border-green-500"
                >
                  <Image
                    src={`/medias/images/Harnero${index + 1}.jpg`}
                    alt={`Option ${index + 1}`}
                    width={200}
                    height={100}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
