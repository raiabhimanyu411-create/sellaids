import multer from "multer";
import path from "path";
import fs from "fs";

const excelDir = path.join(process.cwd(), "src/public/uploads/excel");

// Ensure directory exists
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, excelDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "excel-" + unique + path.extname(file.originalname));
  },
});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx Excel files are allowed"), false);
  }
};

export const uploadExcel = multer({
  storage,
  fileFilter: excelFilter,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB limit
}).single("file");