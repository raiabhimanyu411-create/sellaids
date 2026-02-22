import fs from "fs";
import path from "path";
import sharp from "sharp";

const INPUT_DIR = "./src/public/uploads";
const OUTPUT_DIR = "./src/public/uploads_webp";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const files = fs.readdirSync(INPUT_DIR);

for (const file of files) {
  const inputPath = path.join(INPUT_DIR, file);
  if (fs.lstatSync(inputPath).isDirectory()) continue;

  const outputPath = path.join(
    OUTPUT_DIR,
    path.parse(file).name + ".webp"
  );

  await sharp(inputPath)
    .resize(1600, 1600, { fit: "inside" })
    .webp({ quality: 80 })
    .toFile(outputPath);

  console.log("Converted:", file);
}