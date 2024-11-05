import { useThree } from "@react-three/fiber";
import { scaleLinear } from "d3";
import { useRef, useCallback, useEffect } from "react";
import { clamp } from "remeda";
import { Vector2, Vector3 } from "three";

const dragScale = scaleLinear().domain([20, 80]).range([0.09, 0.01]);

export function CustomControls() {
    const { camera, gl } = useThree();
    const isDragging = useRef(false);
    const startMouse = useRef(new Vector2());
    const startCamera = useRef(new Vector3());
  
    // Start dragging
    const handlePointerDown = useCallback(
      (e: MouseEvent) => {
        isDragging.current = true;
        startMouse.current.set(e.clientX, e.clientY);
        startCamera.current.copy(camera.position);
        gl.domElement.style.cursor = "grabbing";
      },
      [camera.position, gl.domElement.style]
    );
  
    // Handle dragging movement
    const handlePointerMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging.current) return;

        const dragSpeed = dragScale(camera.zoom);
  
        const deltaX = (e.clientX - startMouse.current.x) * dragSpeed;
        const deltaY = (e.clientY - startMouse.current.y) * dragSpeed;
  
        // Apply calculated offsets to the camera position
        camera.position.set(
          startCamera.current.x - deltaX,
          startCamera.current.y + deltaY,
          camera.position.z
        );
        camera.updateProjectionMatrix();
      },
      [camera]
    );
  
    // End dragging
    const handlePointerUp = useCallback(() => {
      isDragging.current = false;
      gl.domElement.style.cursor = "grab";
    }, [gl]);
  
    // Handle zoom in and zoom out
    const handleWheel = useCallback(
      (e: WheelEvent) => {
        const startingZoom = camera.zoom;
        const zoomFactor = 0.01;
  
        camera.zoom = clamp(e.deltaY * -zoomFactor + startingZoom, {
            min: 20,
            max: 80
        });

        camera.updateProjectionMatrix();
      },
      [camera]
    );
  
    // Register pointer events on the canvas itself for panning
    useEffect(() => {
      const canvas = gl.domElement;
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("wheel", handleWheel);
  
      canvas.style.cursor = "grab";
  
      // Cleanup event listeners
      return () => {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("wheel", handleWheel);
      };
    }, [
      gl.domElement,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handleWheel,
    ]);
  
    return null;
  }