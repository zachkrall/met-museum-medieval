import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { clamp } from "remeda";
import { Vector2, Vector3 } from "three";

import { DragGesture, WheelGesture, PinchGesture } from "@use-gesture/vanilla";

export function CustomControls({
  bounds,
}: {
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}) {
  const { camera, gl } = useThree();
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const startMouse = useRef(new Vector2());
  const startCamera = useRef(new Vector3());
  const startZoom = useRef(0);

  // Register pointer events on the canvas itself for panning
  useEffect(() => {
    const canvas = gl.domElement;

    if (canvas) {
      canvas.style.touchAction = "manipulation";

      const dragGesture = new DragGesture(
        canvas,
        ({ first, pinching, cancel, movement: [mx, my] }) => {
          if (pinching) {
            return cancel();
          }

          const cam = cameraRef.current;
          const pos = cam.position;

          if (first) {
            startMouse.current.set(mx, my);
            startCamera.current.copy(pos);
          }

          cam.position.set(
            clamp(startCamera.current.x - mx * 0.02, {
              min: bounds.minX * 0.9,
              max: bounds.maxX * 0.9,
            }),
            clamp(startCamera.current.y + my * 0.02, {
              min: bounds.minY * 0.9,
              max: bounds.maxY * 0.9,
            }),
            pos.z
          );
        },
        {
          eventOptions: { passive: false },
          preventScroll: true,
        }
      );

      const wheelGesture = new WheelGesture(
        canvas,
        ({ pinching, movement: [_, my] }) => {
          if (pinching) {
            return;
          }
          const cam = cameraRef.current;
          const startingZoom = cam.zoom;
          const zoomFactor = 0.01;

          cam.zoom = clamp(my * -zoomFactor + startingZoom, {
            min: 20,
            max: 80,
          });

          cam.updateProjectionMatrix();
        },
        {
          eventOptions: { passive: false },
        }
      );

      const pinchGesture = new PinchGesture(
        canvas,
        ({ first, offset: [scale] }) => {
          if (first) {
            startZoom.current = cameraRef.current.zoom;
          }

          const cam = cameraRef.current;

          cam.zoom = clamp(startZoom.current * scale, {
            min: 20,
            max: 80,
          });

          cam.updateProjectionMatrix();
        },
        {
          eventOptions: { passive: false },
        }
      );

      return () => {
        dragGesture.destroy();
        wheelGesture.destroy();
        pinchGesture.destroy();
      };
    }
  }, [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, gl.domElement]);

  return null;
}
