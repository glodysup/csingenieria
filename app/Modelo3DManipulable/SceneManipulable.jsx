'use client';
import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';






export default function SceneManipulable(){

    useEffect(() => {
        console.log('El componente ha sido renderizado');


        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
        const renderer = new THREE.WebGLRenderer({antialias:true});

        const controls = new OrbitControls( camera, renderer.domElement );
        const loader = new GLTFLoader();
        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
       directionalLight.position.set(-10,10,10)

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        const geometry = new THREE.BoxGeometry( 2, 2, 2 );
        //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const material = new THREE.MeshStandardMaterial({color:0x00ff00})
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        scene.add( light );
        scene.add( directionalLight );

        camera.position.z = 5;
        
        function animate() {
            requestAnimationFrame( animate );
           cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
            renderer.render( scene, camera );
        }
        animate()

        // Inicializar Three.js y configurar la escena
        return () => {
          // Limpiar recursos de Three.js al salir de la página
          // Detener animaciones, liberar memoria, etc.
          console.log('El componente está siendo desmontado');
            // Detener la animación
      cancelAnimationFrame(animate);
      // Liberar recursos
      scene.remove(cube);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
        };
      }, []);
      //return null;
    
    return(
        <>
       {


       }
        </>
    )
}