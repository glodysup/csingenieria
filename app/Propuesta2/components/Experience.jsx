"use client";

import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ScrollControls } from "@react-three/drei";

export const Experience = () => {
  const mountRef = useRef(null); // Referencia para montar el canvas

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Agregando el canvas a la referencia del montaje actual
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / innerHeight,
      1,
      1000
    );

    camera.position.set(4, 3, 6.5);
    //camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    //  controls.enableZoom = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update();

    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
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

    /*const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);  // color blanco, intensidad completa
scene.add(ambientLight);*/

    const loader = new GLTFLoader().setPath("/medias/");

    loader.load(
      "HarneroOptimizado1.glb",
      (gltf) => {
        console.log("loading model");
        const mesh = gltf.scene;

        mesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const newMaterial = new THREE.MeshPhongMaterial({
              // color: 0x555555, // Color gris
              shininess: 100, // Brillo
              specular: 0xffffff, // Color especular
              metalness: 0.9,
              roughness: 0.9,
            });
            child.material = newMaterial;
          }
        });
        mesh.position.set(-2, 0, 2);
        mesh.scale.set(0.5, 0.5, 0.5);
        mesh.rotateY(20);

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
        mesh.position.set(-2.5, 1.8, 3);
        mesh.rotateY(0.9);

        mesh.scale.set(0.4, 0.4, 0.4);

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

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      try {
        mountRef.current.removeChild(renderer.domElement);
      } catch (e) {}
    };
  }, []);

  return <div ref={mountRef} style={{ height: "100vh" }}></div>;
};
