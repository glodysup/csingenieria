import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Office } from "./Office"
import { Overlay} from "./Overlay"

export default function ScrollEffect(){
    return(
        <>
        <ambientLight intensity={2.5}/>
        <OrbitControls enableZoom={false}/>
        <ScrollControls pages={3} damping={0.25}>
            <Overlay/>
            <Office/>  

        </ScrollControls>
          
        
        </>
    )
}