import { getDashboardStatsService } from "../../services/user/userDashboardService.js";
import logger from "../../config/logger.js";

export const getDashboardController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }
  try {
    const kpis = await getDashboardStatsService(userId);
    logger.info(`Dashboard KPIs fetched for user: ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Dashboard KPIs retrieved",
      data: kpis,
    });
  } catch (error) {
    logger.error(`Error fetching dashboard KPIs for user ${userId}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};