import React, {useRef} from 'react'
import { useGLTF, Text, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva';



export default function Model(){
   
   const mesh = useRef() //Malla que permite la manipulación del objeto 3D, se usa con el hook: useRef() para referenciar al mesh del objeto en el DOM
   const {nodes} = useGLTF("/medias/torrus.glb")
   const {viewport} = useThree(); // Para ajustar el tamaño dependiendo del ancho de pantalla



   useFrame(() => {  // Funcion que se ejecuta cada frame de la app
          mesh.current.rotation.x += 0.02           
   })

   const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: {value: 1, min: 0, max: 1, step: 0.1},
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1},
    backside: { value: true},
})


    return(

        
    <group scale={(viewport.width/3.5)}>        
        <Text fontSize={0.4} font='fonts/PPNeueMontreal-Bold.otf' position={[0,0,-.5]}>
            CSIngenieria SPA
        </Text>
        <mesh ref={mesh}{...nodes.Torus002}>
            <MeshTransmissionMaterial{...materialProps}/>
        </mesh>
    </group>
    )
}