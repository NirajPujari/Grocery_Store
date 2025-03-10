require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { dbConfig } = require("./db/db.js");
const { router } = require("./routers/router.js");

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use("/api", router);

// Server Port
const PORT = process.env.PORT || 4000;

// Database Configuration & Server Initialization
(async () => {
    try {
        await dbConfig();
        console.log("✅ Database configured successfully");

        mongoose.connection.once("connected", () => {
            console.log("✅ MongoDB Connected");
        });

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
})();
