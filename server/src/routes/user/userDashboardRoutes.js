import express from "express";
import { getDashboardController } from "../../controllers/user/userDashboardController.js";


const router = express.Router();

router.get("/", getDashboardController);

export default router;