import { Edges } from "@react-three/drei";
import { ComponentProps, ElementRef, forwardRef } from "react";
import { DoubleSide } from "three";

export const ImageCardPlaceholder = forwardRef<
  ElementRef<"mesh">,
  {
    scale?: number;
    z?: number;
    x: number;
    y: number;
    opacity?: number;
    meshProps?: ComponentProps<"mesh">;
  }
>(function ImageCardPlaceholder(
  { x, y, scale = 1.0, z = 0.0, opacity = 1.0, meshProps },
  ref
) {
  return (
    <mesh position={[x, y, z]} ref={ref} {...meshProps}>
      <planeGeometry args={[1 * scale, 1 * scale]} />
      <Edges color={"white"} opacity={opacity} />
      <meshBasicMaterial
        color="white"
        side={DoubleSide}
        transparent={true}
        opacity={0.0}
      />
    </mesh>
  );
});
