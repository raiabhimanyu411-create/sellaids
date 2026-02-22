import logger from "../../config/logger.js";
import { Cart } from "../../models/cartModel.js";
import { Product } from "../../models/productModel.js";


export const addToCartService = async (userId, productId) => {
  try {
    logger.info(`Adding product ${productId} to cart for user ${userId}`);

    const product = await Product.findByPk(productId);

    if (!product) {
      return { status: false, message: "Product not found" };
    }

    if (product.stock <= 0 || product.stock_status === "out_of_stock") {
      return {
        status: false,
        message: "Product is out of stock",
      };
    }

    const existingCartItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existingCartItem) {
      return {
        status: false,
        message: "Product already in cart",
      };
    }

    const newCartItem = await Cart.create({
      user_id: userId,
      product_id: productId,
    });

    logger.info(`Product ${productId} successfully added to cart`);
    return { status: true, data: newCartItem };
  } catch (error) {
    logger.error(`Error in addToCartService: ${error.message}`);
    throw new Error("Failed to add product to cart");
  }
};


export const getCartService = async (userId) => {
  try {
    logger.info(`Fetching cart for user ${userId}`);

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ['id', 'product_type', 'purchase_price', 'selling_price', 'front_photo', 'back_photo', 'label_photo', 'inside_photo', 'button_photo', 'wearing_photo', 'more_images'],
        },
      ],
    });

    const formattedCart = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        size: item.product.size,
        size_other: item.product.size_other,
        id: item.product?.id,
        name: item.product?.product_type || 'Unknown Product',
        price: parseFloat(item.product?.selling_price) || parseFloat(item.product?.purchase_price) || 0, // ✅ Use selling_price first
        original_price: parseFloat(item.product?.purchase_price) || 0, // ✅ For discount calculation        front_photo: item.product?.front_photo || 'N/A', 
        front_photo: item.product?.front_photo || 'N/A',
        back_photo: item.product.back_photo,
        label_photo: item.product.label_photo,
        inside_photo: item.product.inside_photo,
        button_photo: item.product.button_photo,
        wearing_photo: item.product.wearing_photo,
        more_images: item.product.more_images,
      },
    }));

    logger.info(`Cart fetched successfully for user ${userId}`);
    return { status: true, data: formattedCart };
  } catch (error) {
    logger.error(`Error in getCartService: ${error.message}`);
    throw new Error("Failed to fetch cart");
  }
};

export const updateCartQuantityService = async (userId, productId, quantity) => {
  try {
    logger.info(`Updating quantity for product ${productId} to ${quantity} for user ${userId}`);

    const cartItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cartItem) {
      logger.warn(`Cart item not found for user ${userId}, product ${productId}`);
      return { status: false, message: "Cart item not found" };
    }

    if (quantity === 0) {
      await cartItem.destroy();
      logger.info(`Removed product ${productId} from cart for user ${userId}`);
      return { status: true, data: null };
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    logger.info(`Updated quantity for product ${productId} in cart`);
    return { status: true, data: cartItem };
  } catch (error) {
    logger.error(`Error in updateCartQuantityService: ${error.message}`);
    throw new Error("Failed to update cart quantity");
  }
};

export const removeFromCartService = async (userId, productId) => {
  try {
    logger.info(`Removing product ${productId} from cart for user ${userId}`);

    const cartItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cartItem) {
      logger.warn(`Cart item not found for user ${userId}, product ${productId}`);
      return { status: false, message: "Cart item not found" };
    }

    await cartItem.destroy();
    logger.info(`Removed product ${productId} from cart for user ${userId}`);
    return { status: true, data: null };
  } catch (error) {
    logger.error(`Error in removeFromCartService: ${error.message}`);
    throw new Error("Failed to remove from cart");
  }
};
