import express from "express"
import { addToCartController, getCartController, updateCartQuantityController, removeFromCartController } from "../../controllers/user/userCartController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()


router.post("/", isUserLoginIn, addToCartController);
router.get("/", isUserLoginIn, getCartController);
router.put("/:product_id", isUserLoginIn, updateCartQuantityController);
router.delete("/:product_id", isUserLoginIn, removeFromCartController);


export default router