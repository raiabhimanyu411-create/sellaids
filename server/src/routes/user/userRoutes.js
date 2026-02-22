import express from "express";
import { userGetProfile, userUpdateProfile } from "../../controllers/user/userController.js";

const router = express.Router();

router.get("/list", userGetProfile);
router.put("/edit", userUpdateProfile);

export default router;