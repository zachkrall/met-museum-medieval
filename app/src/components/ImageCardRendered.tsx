/* a 2d plane with an image texture in react three fiber */

import { useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";

export function ImageCardRendered({
  src,
  z = 0,
  scale = 1,
}: {
  src: string;
  z?: number;
  scale?: number;
}) {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  const texture = useTexture(src);

  useEffect(() => {
    // fetch image and get dimensions
    const img = new Image();
    img.src = src;

    img.onload = () => {
      // normalized width and height between 0 - 1 and figure out of the aspect ratio is landscape or portrait
      const aspect = img.width / img.height;

      if (aspect > 1) {
        setWidth(1);
        setHeight(1 / aspect);
      } else {
        setWidth(aspect);
        setHeight(1);
      }
    };
  }, [src]);

  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width * scale, height * scale, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
