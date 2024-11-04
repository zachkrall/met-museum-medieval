import { ElementRef, Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ImageCardRendered } from "./ImageCardRendered";
import { ImageCardPlaceholder } from "./ImageCardPlaceholder";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ImageCard({
  objectID,
  x,
  y,
  index,
}: {
  objectID: string;
  x: number;
  y: number;
  index: number;
}) {
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLargeEnough, setIsLargeEnough] = useState(false);

  const [scale, setScale] = useState(1);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      const frustum = new THREE.Frustum();
      const cameraViewProjectionMatrix = new THREE.Matrix4();
      camera.updateMatrix(); // make sure the camera matrix is updated
      camera.updateMatrixWorld(); // update the world matrix
      cameraViewProjectionMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

      const boundingBox = new THREE.Box3().setFromObject(meshRef.current);
      setIsVisible(frustum.intersectsBox(boundingBox));

      // detect if mesh is rendered on screen larger than 100 x 100 pixels
      const corners = [
        new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, 0),
        new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, 0),
        new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, 0),
        new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, 0),
      ];

      const screenSize = corners.map((corner) => {
        const screenPos = corner.clone().project(camera); // Project to screen space
        // Convert normalized device coordinates to pixel coordinates
        return [
          ((screenPos.x + 1) / 2) * window.innerWidth,
          ((-screenPos.y + 1) / 2) * window.innerHeight,
        ];
      });

      const widthInPixels = Math.abs(screenSize[2][0] - screenSize[0][0]); // Width in pixels
      const heightInPixels = Math.abs(screenSize[1][1] - screenSize[0][1]); // Height in pixels

      // Check if the mesh is larger than 70x70 pixels
      setIsLargeEnough(widthInPixels > 70 && heightInPixels > 70);
    }
  });

  return (
    <>
      {isVisible ? (
        <>
          {isLargeEnough ? (
            <ErrorBoundary
              key={`${objectID}--error-boundary--large`}
              fallbackRender={() => null}
            >
              <Suspense fallback={null}>
                <ImageCardRendered
                  key={`${objectID + index}--image-card--large`}
                  src={`/images/${objectID}.jpg`}
                  x={x}
                  y={y}
                  z={scale > 1 ? 1 : 0}
                  scale={scale}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <ErrorBoundary
              key={`${objectID}--error-boundary`}
              fallbackRender={() => <ImageCardPlaceholder x={x} y={y} />}
            >
              <Suspense
                fallback={
                  <ImageCardPlaceholder
                    key={`${objectID + index}--loading`}
                    x={x}
                    y={y}
                  />
                }
              >
                <ImageCardRendered
                  key={`${objectID + index}--image-card`}
                  src={`/thumbnails/${objectID}.jpg`}
                  x={x}
                  y={y}
                  z={scale > 1 ? 1 : 0}
                  scale={scale}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </>
      ) : null}

      {/* use invisible plane to calculate if image should be visible */}
      <ImageCardPlaceholder
        ref={meshRef}
        x={x}
        y={y}
        z={scale > 1 ? 1 : 0}
        opacity={isVisible ? 0.0 : 0.5}
        scale={scale}
        meshProps={{
          onPointerEnter: () => setScale(1.8),
          onPointerLeave: () => setScale(1),
        }}
      />
    </>
  );
}
