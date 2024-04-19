import {
  Environment,
  Float,
  OrbitControls,
  Text,
  CameraControls,
  MeshReflectorMaterial,
  RenderTexture,
  useFont,
} from "@react-three/drei";
import { Camping } from "./Camping";
import { Building } from "./Building";
import { degToRad, lerp } from "three/src/math/MathUtils";
import { Color } from "three";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { currentPageAtom } from "./UI";
import { useFrame } from "@react-three/fiber";

const bloomColor = new Color("#ffffff");
bloomColor.multiplyScalar(1.5);

export const Experience = () => {
  const controls = useRef();
  const meshFitCameraHome = useRef();
  const meshFitCameraStore = useRef();
  const textMaterial = useRef();
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  useFrame((_, delta) => {
    textMaterial.current.opacity = lerp(
      textMaterial.current.opacity,
      currentPage === "Propuesta1" || currentPage === "intro" ? 1 : 0,
      delta * 1.5
    );
  });

  const intro = async () => {
    controls.current.dolly(-22);
    controls.current.smoothTime = 1.6;
    controls.current.dolly(22, true);
    setTimeout(() => {
      setCurrentPage("Propuesta1");
    }, 1200);
    fitCamera();
  };

  const fitCamera = async () => {
    if (currentPage === "store") {
      controls.current.smoothTime = 0.8;
      controls.current.fitToBox(meshFitCameraStore.current, true);
    } else {
      controls.current.smoothTime = 1.6;
      controls.current.fitToBox(meshFitCameraHome.current, true);
    }
  };

  useEffect(() => {
    intro();
  }, []);

  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);
  }, [currentPage]);

  return (
    <>
      <CameraControls ref={controls} />
      <mesh ref={meshFitCameraHome} position-rotateZ={0.5} visible={false}>
        <boxGeometry args={[10, 2, 2]} />
        <meshBasicMaterial color="orange" transparent opacity={0.5} />
      </mesh>
      <Text
        font={"./fonts/Poppins-Black.ttf"}
        position-x={-1.3}
        position-y={-0.5}
        position-z={1}
        lineHeight={0.85}
        textAlign="left"
        rotation-y={degToRad(30)}
        anchorY={"bottom"}
        scale={0.7}
      >
        CHALLENGING{"\n"}DESIGN
        <meshBasicMaterial
          color={bloomColor}
          toneMapped={false}
          ref={textMaterial}
        >
          <RenderTexture attach={"map"}>
            <color attach="background" args={["#fff"]} />
            <Environment preset="sunset" />
            <Float floatIntensity={4} rotationIntensity={5}>
              <Camping
                scale={1.6}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(40)}
                position-x={-1}
                position-y={-0.2}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <Text
        font={"./fonts/Poppins-Black.ttf"}
        position-x={0}
        position-y={-0.5}
        position-z={1}
        textAlign="right"
        rotation-y={degToRad(15)}
        anchorY={"bottom"}
        scale={0.35}
      >
        24/7
        <meshBasicMaterial color="white">
          <RenderTexture attach={"map"}>
            <color attach="background" args={["#fff"]} />
            <Environment preset="sunset" />
          </RenderTexture>
        </meshBasicMaterial>
      </Text>

      <group rotation-y={degToRad(-25)} position-x={3}>
        <Camping scale={0.6} html />
        <mesh ref={meshFitCameraStore} visible={false}>
          <boxGeometry args={[2, 1, 2]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
      <Environment preset="sunset" />
    </>
  );
};

useFont.preload("/fonts/Poppins-Black.ttf");
