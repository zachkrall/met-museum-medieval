import * as THREE from "three";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { forceCollide, forceSimulation, forceX, forceY } from "d3";

interface ImageInstance {
  objectID: string;
  x: number; // x position in your scene
  y: number; // y position in your scene
}

let canvas: HTMLCanvasElement | undefined;

function getOrCreateCanvas(canvasId: string) {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = canvasId;
  }
  return canvas;
}

async function createAtlas(
  images: Array<ImageInstance>,
  thumbnailSize: number
) {
  // const loadedImages = await Promise.all(
  //   images.map(({ objectID }) => {
  //     const img = new Image();
  //     img.src = `./thumbnails/${objectID}.jpg`;
  //     return new Promise<HTMLImageElement>((resolve) => {
  //       img.onload = () => resolve(img);
  //     });
  //   })
  // );

  const numImages = images.length;
  const cols = Math.ceil(Math.sqrt(numImages));
  const rows = Math.ceil(numImages / cols);
  // const atlasWidth = cols * thumbnailSize;
  // const atlasHeight = rows * thumbnailSize;

  // const atlasCanvas = getOrCreateCanvas("image-atlas-canvas");
  // atlasCanvas.width = atlasWidth;
  // atlasCanvas.height = atlasHeight;
  // const context = atlasCanvas.getContext("2d")!;

  // context.fillStyle = "transparent";
  // context.fillRect(0, 0, atlasWidth, atlasHeight);

  const { image, atlasWidth, atlasHeight } = await new Promise<{
    image: HTMLImageElement;
    atlasWidth: number;
    atlasHeight: number;
  }>((resolve) => {
    // load atlas.png
    const img = new Image();
    img.src = "./atlas.png";
    img.onload = () =>
      resolve({
        image: img,
        atlasWidth: img.width,
        atlasHeight: img.height,
      });
  });

  const uvOffsets: Array<[number, number]> = [];
  const scales: Array<[number, number]> = [];

  images.forEach((_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = col * thumbnailSize;
    const baseY = (rows - 1 - row) * thumbnailSize;

    // Calculate dimensions maintaining aspect ratio
    // let targetWidth = thumbnailSize;
    // let targetHeight = thumbnailSize;
    // const aspectRatio = img.width / img.height;
    // const aspectRatio = atlasWidth / atlasHeight;

    // if (aspectRatio > 1) {
    //   // Image is wider than tall
    //   targetHeight = thumbnailSize / aspectRatio;
    // } else {
    //   // Image is taller than wide
    //   targetWidth = thumbnailSize * aspectRatio;
    // }

    // Calculate padding to center the image in the cell
    // const xPadding = (thumbnailSize - targetWidth) / 2;
    // const yPadding = (thumbnailSize - targetHeight) / 2;

    // Draw the image centered in its cell
    // context.drawImage(
    //   img,
    //   baseX + xPadding,
    //   baseY + yPadding,
    //   targetWidth,
    //   targetHeight
    // );

    // Calculate UV coordinates and scales that match the padded area
    // const u = (baseX + xPadding) / atlasWidth;
    // const v = (baseY + yPadding) / atlasHeight;
    const u = baseX / atlasWidth;
    const v = baseY / atlasHeight;
    uvOffsets.push([u, v]);

    // Scale represents the portion of the cell that the image actually occupies
    // const scaleU = targetWidth / atlasWidth;
    // const scaleV = targetHeight / atlasHeight;
    const scaleU = thumbnailSize / atlasWidth;
    const scaleV = thumbnailSize / atlasHeight;
    scales.push([scaleU, scaleV]);

    // Optional: Draw cell boundaries for debugging
    // context.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    // context.strokeRect(baseX, baseY, thumbnailSize, thumbnailSize);
  });

  const atlasCanvas = getOrCreateCanvas("image-atlas-canvas");
  atlasCanvas.width = atlasWidth;
  atlasCanvas.height = atlasHeight;

  const context = atlasCanvas.getContext("2d")!;

  context.drawImage(image, 0, 0, atlasWidth, atlasHeight);

  const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
  atlasTexture.wrapS = atlasTexture.wrapT = THREE.ClampToEdgeWrapping;
  atlasTexture.minFilter = THREE.LinearFilter;
  atlasTexture.magFilter = THREE.LinearFilter;
  atlasTexture.flipY = false;

  return {
    atlasTexture,
    uvOffsets,
    scales,
    dimensions: {
      width: atlasWidth,
      height: atlasHeight,
    },
  };
}

export const ImageInstance = memo(function ImageInstance({
  images,
  onSelect,
  onAtlasLoaded,
}: {
  images: Array<ImageInstance>;
  onSelect: (objectID: string) => void;
  onAtlasLoaded: () => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [atlasData, setAtlasData] = useState<Awaited<
    ReturnType<typeof createAtlas>
  > | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Create texture atlas and gather UV offsets
  useEffect(() => {
    createAtlas(images, 50).then((data) => {
      setAtlasData(data);
      onAtlasLoaded();
    });
  }, [images, onAtlasLoaded]);

  const material = useMemo(() => {
    if (!atlasData) return null;

    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAtlasTexture: { value: atlasData.atlasTexture },
        uAtlasSize: {
          value: new THREE.Vector2(
            atlasData.dimensions.width,
            atlasData.dimensions.height
          ),
        },
        hoveredIndex: { value: -1 }, // Initialize to an invalid index
        hoverScale: { value: 1.2 }, // Scale factor when hovered
      },
      vertexShader: `
        attribute vec2 instanceUV;
        attribute vec2 instanceScale;
        uniform float hoveredIndex;
        uniform float hoverScale;
        varying vec2 vUV;

        void main() {
          // Flip the local UV coordinates before applying atlas offset
          vec2 flippedUV = vec2(uv.x, 1.0 - uv.y);
          vUV = flippedUV * instanceScale + instanceUV;

          float scale = (float(gl_InstanceID) == hoveredIndex) ? hoverScale : 1.0;

          vec3 modifiedPosition = position * scale;

          if (float(gl_InstanceID) == hoveredIndex) {
            modifiedPosition.z -= 0.1; // Move it slightly closer to the camera
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(modifiedPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlasTexture;
        varying vec2 vUV;
        void main() {
            vec2 finalUV = vUV;
            gl_FragColor = texture2D(uAtlasTexture, finalUV);
        }
      `,
    });
  }, [atlasData]);

  useEffect(() => {
    if (!atlasData || !meshRef.current) return;

    const mesh = meshRef.current;
    const instanceMatrix = new THREE.Matrix4();
    const uvArray: number[] = [];
    const scaleArray: number[] = [];

    const positions = [...images].map(({ x, y }) => ({ x, y }));

    images.forEach(({ x, y }, i) => {
      instanceMatrix.setPosition(new THREE.Vector3(x, y, 0));
      mesh.setMatrixAt(i, instanceMatrix);

      // Set each instance’s UV offset in the atlas
      const [u, v] = atlasData.uvOffsets[i];
      uvArray.push(u, v);

      const [scaleU, scaleV] = atlasData.scales[i];
      scaleArray.push(scaleU, scaleV);
    });

    // Set UV offsets as an InstancedBufferAttribute
    mesh.geometry.setAttribute(
      "instanceUV",
      new THREE.InstancedBufferAttribute(new Float32Array(uvArray), 2)
    );

    mesh.geometry.setAttribute(
      "instanceScale",
      new THREE.InstancedBufferAttribute(new Float32Array(scaleArray), 2)
    );

    mesh.instanceMatrix.needsUpdate = true;

    const simulation = forceSimulation(positions)
      .force("x", forceX((d) => d.x ?? 0).strength(0.1))
      .force("y", forceY((d) => d.y ?? 0).strength(0.1))
      .force("collide", forceCollide().radius(0.6).iterations(10))
      .on("tick", () => {
        positions.forEach((pos, i) => {
          instanceMatrix.setPosition(new THREE.Vector3(pos.x, pos.y, 0));
          mesh.setMatrixAt(i, instanceMatrix);
        });

        mesh.instanceMatrix.needsUpdate = true;
      });

    simulation.alphaDecay(0.02).alphaMin(0.1);

    return () => {
      simulation.stop();
    };
  }, [atlasData, images]);

  useEffect(() => {
    if (material) {
      material.uniforms.hoveredIndex.value = hoveredIndex ?? -1; // Update uniform with hovered index
    }
  }, [hoveredIndex, material]);

  if (!atlasData || !material) {
    return null; // Or a loading indicator
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, images.length]}
      onPointerMove={(e) => {
        const id = e.instanceId;

        if (id) {
          setHoveredIndex(id);
        }
      }}
      onPointerOut={() => setHoveredIndex(null)}
      onClick={(e) => {
        const id = e.instanceId;

        if (id) {
          const objectID = images[id].objectID;
          onSelect(objectID);
        }
      }}
    >
      <planeGeometry args={[1, 1]} /> {/* Size of the geometry plane */}
      <primitive attach="material" object={material} />
    </instancedMesh>
  );
});
