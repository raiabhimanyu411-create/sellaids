import express from "express"
import { userCreateTicketController,userGetAllTicketsController } from "../../controllers/user/userSupportController.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// ticket rased 
router.post("/", isUserLoginIn, userCreateTicketController);
router.get("/", isUserLoginIn, userGetAllTicketsController);

export default router