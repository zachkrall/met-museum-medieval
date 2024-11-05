import {
  ElementRef,
  forwardRef,
  Suspense,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImageCardPlaceholder } from "./ImageCardPlaceholder";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary";
import { ImageCardRendered } from "./ImageCardRendered";

export const ImageCard = forwardRef<
  // ref
  ElementRef<"group">,
  // props
  {
    objectID: string;
    index: number;
    onSelect: () => void;
  }
>(function ImageCard({ onSelect, objectID, index }, ref) {
  const innerRef = useRef<ElementRef<"group">>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [scale, setScale] = useState(1);

  useImperativeHandle(ref, () => innerRef.current!, []);

  useFrame(({ camera }) => {
    if (innerRef.current) {
      const frustum = new THREE.Frustum();
      const cameraViewProjectionMatrix = new THREE.Matrix4();
      camera.updateMatrix(); // make sure the camera matrix is updated
      camera.updateMatrixWorld(); // update the world matrix
      cameraViewProjectionMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

      const boundingBox = new THREE.Box3().setFromObject(innerRef.current);
      setIsVisible(frustum.intersectsBox(boundingBox));
    }
  });

  return (
    <group ref={innerRef}>
      {isVisible ? (
        <>
          <ErrorBoundary
            key={`${objectID}--error-boundary`}
            fallbackRender={() => <ImageCardPlaceholder />}
          >
            <Suspense
              fallback={
                <ImageCardPlaceholder key={`${objectID + index}--loading`} />
              }
            >
              <ImageCardRendered
                key={`${objectID + index}--image-card`}
                src={`./thumbnails/${objectID}.jpg`}
                z={scale > 1 ? 1 : 0}
                scale={scale}
              />
            </Suspense>
          </ErrorBoundary>
        </>
      ) : null}

      {/* use invisible plane to calculate if image should be visible */}
      <ImageCardPlaceholder
        z={scale > 1 ? 1 : 0}
        opacity={isVisible ? 0.0 : 0.5}
        scale={scale}
        meshProps={{
          onPointerEnter: () => setScale(1.8),
          onPointerLeave: () => setScale(1),
          onClick: () => onSelect(),
        }}
      />
    </group>
  );
});
