import express from "express"
import { addToWishlist, getWishlist, removeFromWishlist } from "../../controllers/user/userWishlistController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// router.add("/", isUserLoginIn, userAddAddressController)
// router.get("/", isUserLoginIn, userGetAddressController)
// router.delete("/", isUserLoginIn, userChangeAddressController)
router.post("/", isUserLoginIn, addToWishlist)
router.get("/", isUserLoginIn, getWishlist)
router.delete("/:productId", isUserLoginIn, removeFromWishlist);

export default router;