import express from "express";
import { submitContactForm } from "../contactForm/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", submitContactForm);

export default router;