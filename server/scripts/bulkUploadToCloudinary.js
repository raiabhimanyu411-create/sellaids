import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import cloudinary from "../src/config/cloudinary.js";

dotenv.config({
  path: path.resolve(process.cwd(), "server/.env"),
});

const IMAGES_DIR = path.join(process.cwd(), "src/public/uploads");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const uploadImages = async () => {
  const files = fs.readdirSync(IMAGES_DIR);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    if (fs.lstatSync(filePath).isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      skipped++;
      continue;
    }

    const publicId = path.basename(file, ext);

    try {
      console.log("Processing:", file);

      // 🔥 Compress + Resize + Convert to WebP
      // ✅ .rotate() fixes EXIF orientation (portrait images seedhi ho jayengi)
      const webpBuffer = await sharp(filePath)
        .rotate()                                    // 👈 EXIF auto-fix
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 65 })
        .toBuffer();

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            public_id: publicId,
            resource_type: "image",
            overwrite: true,     // 👈 Same public_id pe overwrite karega
            invalidate: true,    // 👈 CDN cache clear karega - turant dikhengi nayi images
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(webpBuffer);
      });

      success++;
      console.log(`✅ Uploaded (${success}): ${result.secure_url}`);

      await delay(1000); // Rate limit safe

    } catch (err) {
      failed++;
      console.error("❌ Failed:", file, err?.message || err);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Migration Completed!");
  console.log("=".repeat(50));
  console.log(`✅ Success : ${success}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log(`⏭️  Skipped : ${skipped}`);
  console.log("=".repeat(50));
};

uploadImages();