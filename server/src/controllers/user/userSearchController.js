// controllers/user/searchController.js
import { searchProductsService } from "../../services/user/userSearchService.js";
import logger from "../../config/logger.js";

export const searchProducts = async (req, res) => {
  const { search } = req.query; // ← CHANGED: 'search' instead of 'q'

  // CASE 1: No query parameter at all
  if (!search) {
    logger.warn("Search request made without 'search' parameter");
    return res.status(400).json({
      success: false,
      message: "Search query is required. Use ?search=your-search-term",
    });
  }

  const searchQuery = search.trim();

  // CASE 2: Empty or too short query
  if (searchQuery.length === 0) {
    logger.warn("Empty search query received");
    return res.status(400).json({
      success: false,
      message: "Search query cannot be empty",
    });
  }

  if (searchQuery.length < 2) {
    logger.warn(`Search query too short: "${searchQuery}"`);
    return res.status(400).json({
      success: false,
      message: "Search query must be at least 2 characters",
    });
  }

  try {
    const products = await searchProductsService(searchQuery);

    logger.info(`Search performed: "${searchQuery}" → ${products.length} results`);

    // CASE 3: No results found
    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No products found for "${searchQuery}". Try different keywords.`,
        data: [],
        count: 0,
      });
    }

    // CASE 4: Results found
    return res.status(200).json({
      success: true,
      message: "Search results retrieved",
      data: products,
      count: products.length,
    });
  } catch (error) {
    logger.error(`Search error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during search",
      error: error.message,
    });
  }
};