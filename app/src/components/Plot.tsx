import { Canvas } from "@react-three/fiber";
import { useGetObjects } from "../api/useGetObjects";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { ImageCard } from "./ImageCard";

export function Plot() {
  const objects = useGetObjects();

  return (
    <div className="fixed inset-0 size-screen">
      <Canvas className="bg-[black]" >

		<OrthographicCamera makeDefault position={[0,0,2]} zoom={100}/>
		
        {objects.data?.map((object, index) => (
          <ImageCard {...object} index={index} key={object.objectID + index}/>
        ))}


        <OrbitControls
          enablePan={true}
          enableRotate={false}
          mouseButtons={{
            LEFT: 2,
            RIGHT: 0,
          }}
        />
      </Canvas>

      {/* toolbar */}
      {/* <div className="fixed top-0 p-4 flex justify-center items-center bg-[green] z-50">
        <button>Load data</button>
      </div> */}
    </div>
  );
}
