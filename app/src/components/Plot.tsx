import { Canvas, useThree } from "@react-three/fiber";
import { useGetObjects } from "../api/useGetObjects";
import { OrthographicCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import { CustomControls } from "./CustomControls";
import { SelectedObject } from "./SelectedObject";
import { AnimatePresence } from "framer-motion";
import { ImageInstance } from "./ImageInstance";
import { gsap } from "gsap";
import { cn } from "../utils/cn";
import { useBoundingBox } from "../hooks/useBoundingBox";
import { Title } from "./TItle";

function PlotInner({
  objects,
  setSelected,
  onAtlasLoaded,
}: {
  objects: ReturnType<typeof useGetObjects>;
  setSelected: (id: string) => void;
  onAtlasLoaded: () => void;
}) {
  const bounds = useBoundingBox(objects.data ?? []);

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
          onAtlasLoaded={onAtlasLoaded}
        />
      ) : null}

      <CustomControls bounds={bounds} />
    </>
  );
}

export function Plot({
  objects,
  onAtlasLoaded,
}: {
  objects: ReturnType<typeof useGetObjects>;
  onAtlasLoaded: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0",
        // a dotted background using radial gradient and background-size and repeat
        "bg-black",
        "bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px]",
        "overflow-hidden"
      )}
    >
      <Canvas className={'select-none overflow-hidden [&_*]:overflow-hidden'}>
        <PlotInner
          objects={objects}
          setSelected={setSelected}
          onAtlasLoaded={onAtlasLoaded}
        />
      </Canvas>

      <Title/>

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
