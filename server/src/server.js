import app from "./app.js"
import logger from "./config/logger.js";
import config from "./config/config.js"
import "./cron/deliveryTracking.cron.js";

// define PORT
const PORT = config.server.port || 8000

// server start
app.listen(PORT, ( err) => {
    if (err) {
        logger.error(`Server failed to start: ${err.message}`)
    } else {
        logger.info(`Server running on http://localhost:${PORT}`)
    }
})

export default app;