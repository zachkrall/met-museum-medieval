import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGetObjects } from "../api/useGetObjects";
import { OrthographicCamera } from "@react-three/drei";
import { ImageCard } from "./ImageCard";
import { ElementRef, useRef, useState } from "react";
import { CustomControls } from "./CustomControls";
import gsap from "gsap";
import { useForceSimulation } from "../hooks/useForceSimulation";
import { SelectedObject } from "./SelectedObject";
import { AnimatePresence } from "framer-motion";

function PlotInner({
  objects,
  setSelected,
}: {
  objects: ReturnType<typeof useGetObjects>;
  setSelected: (id: string) => void;
}) {
  const camera = useThree((state) => state.camera);

  const positions = useForceSimulation(objects.data ?? [], 5);
  // const positions = useRef<{ x: number; y: number }[]>(objects.data ?? []);

  const refs = useRef<(ElementRef<"group"> | null)[]>([]);

  useFrame(() => {
    refs.current.forEach((ref, index) => {
      if (ref) {
        ref.position.x = positions.current[index].x ?? 0;
        ref.position.y = positions.current[index].y ?? 0;
      }
    });
  });

  const lookAt = (index: number) => {
    const x = positions.current[index].x ?? 0;
    const y = positions.current[index].y ?? 0;

    gsap.to(camera.position, {
      x,
      y,
      z: 10,
      duration: 1,
      ease: "power4.out",
    });
  };

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />

      {objects.data?.map((object, index) => (
        <ImageCard
          ref={(e) => (refs.current[index] = e)}
          objectID={object.objectID}
          index={index}
          key={object.objectID + index}
          onSelect={() => {
            console.log("Selected", object.objectID);
            lookAt(index);
            setSelected(object.objectID);
          }}
        />
      ))}

      <CustomControls />
    </>
  );
}

export function Plot({
  objects,
}: {
  objects: ReturnType<typeof useGetObjects>;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 size-screen">
      <Canvas className="bg-[black]">
        <PlotInner objects={objects} setSelected={setSelected} />
      </Canvas>

      {/* vertical line in the middle of div */}
      {/* <div className="absolute inset-y-0 left-1/2 w-px bg-[cyan]"></div> */}
      {/* horizontal line in the middle of div */}
      {/* <div className="absolute inset-x-0 top-1/2 h-px bg-[cyan]"></div> */}

      <AnimatePresence>
        {selected ? (
          <SelectedObject key={'selected-object'} id={selected} onDismiss={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
