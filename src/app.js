// Responsible for
// 1. Express initialization
// 2. Middleware
// 3. Routes

const express = require("express");
const urlRoutes = require("./routes/url.routes");
require("dotenv").config();
const PORT = process.env.PORT || 8181;

const app = express();

// Parse JSON request bodies
app.use(express.json())

// Register Routes
app.use("/api/url", urlRoutes);

// Add a health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        message: "Service is running",
        instance: `server-${PORT}`,
        port: PORT
    });
});

// Error Handler
const errorMiddleware = require("./middlewares/error.middleware");
app.use(errorMiddleware);

module.exports = app;