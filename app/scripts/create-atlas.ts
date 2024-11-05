import fs from "node:fs";
import path from "node:path";
import { createCanvas, loadImage } from "canvas";
import sizeOf from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

// ESM version of __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// turn sizeOf into a promise
const getSize = (img: string) =>
  new Promise<ISizeCalculationResult | undefined>((resolve, reject) => {
    sizeOf(img, (err, dimensions) => {
      if (err) {
        reject(err);
      } else {
        resolve(dimensions);
      }
    });
  });

async function createAtlas(
  images: Array<{ x: number; y: number; objectID: string }>,
  thumbnailSize: number
) {
  const loadedImages = await Promise.all(
    images.map(async ({ objectID }) => {
      const imagePath = path.join(__dirname, `../public/thumbnails/${objectID}.jpg`);

      //load image from file system
      const img = await loadImage(imagePath);
      const dimensions = await getSize(imagePath);

      return {
        data: img,
        width: dimensions?.width ?? 0,
        height: dimensions?.height ?? 0,
      };
    })
  );

  const numImages = loadedImages.length;
  const cols = Math.ceil(Math.sqrt(numImages));
  const rows = Math.ceil(numImages / cols);
  const atlasWidth = cols * thumbnailSize;
  const atlasHeight = rows * thumbnailSize;

  const atlasCanvas = createCanvas(atlasWidth, atlasHeight);
  const context = atlasCanvas.getContext("2d")!;

  context.fillStyle = "transparent";
  context.fillRect(0, 0, atlasWidth, atlasHeight);

  loadedImages.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = col * thumbnailSize;
    const baseY = (rows - 1 - row) * thumbnailSize;

    // Calculate dimensions maintaining aspect ratio
    let targetWidth = thumbnailSize;
    let targetHeight = thumbnailSize;
    const aspectRatio = img.width / img.height;

    if (aspectRatio > 1) {
      // Image is wider than tall
      targetHeight = thumbnailSize / aspectRatio;
    } else {
      // Image is taller than wide
      targetWidth = thumbnailSize * aspectRatio;
    }

    // Calculate padding to center the image in the cell
    const xPadding = (thumbnailSize - targetWidth) / 2;
    const yPadding = (thumbnailSize - targetHeight) / 2;

    // Draw the image centered in its cell
    context.drawImage(
      img.data,
      baseX + xPadding,
      baseY + yPadding,
      targetWidth,
      targetHeight
    );
  });

  fs.writeFileSync("out.png", atlasCanvas.toBuffer());
}

const file = fs.readFileSync(path.join(__dirname, "../public/embedding.json"));
const json = JSON.parse(file.toString());

createAtlas(json, 50);
