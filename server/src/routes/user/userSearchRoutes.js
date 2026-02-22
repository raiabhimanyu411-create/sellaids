import express from "express";
import { searchProducts } from "../../controllers/user/userSearchController.js";

const router = express.Router();


router.get("/", searchProducts);

export default router;