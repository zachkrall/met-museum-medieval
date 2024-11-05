import { Canvas, useThree } from "@react-three/fiber";
import { useGetObjects } from "../api/useGetObjects";
import { OrthographicCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import { CustomControls } from "./CustomControls";
import { SelectedObject } from "./SelectedObject";
import { AnimatePresence } from "framer-motion";
import { ImageInstance } from "./ImageInstance";
import { gsap } from "gsap";

function PlotInner({
  objects,
  setSelected,
}: {
  objects: ReturnType<typeof useGetObjects>;
  setSelected: (id: string) => void;
}) {
  const camera = useThree((state) => state.camera);

  const positions = useRef<{ x: number; y: number }[]>(objects.data ?? []);
  positions.current = objects.data ?? [];

  const lookAt = (index: number) => {
    const x = positions.current[index].x ?? 0;
    const y = positions.current[index].y ?? 0;
    const z = 1;

    gsap.to(camera.position, {
      x,
      y,
      z,
      duration: 1,
      ease: "power4.out",
    });

    gsap.to(camera, {
      zoom: 70,
      duration: 1,
      ease: "power4.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  };

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={70} />

      {objects.data ? (
        <ImageInstance
          images={objects.data}
          onSelect={(id) => {
            lookAt(objects.data.findIndex((o) => o.objectID === id));
            setSelected(id);
          }}
        />
      ) : null}

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
          <SelectedObject
            key={"selected-object"}
            id={selected}
            onDismiss={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
