import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
import attendanceRoute from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Placement Portal Backend is running"
    });
});

// Test routes
app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Server test route works"
    });
});

app.post("/test-post", (req, res) => {
    console.log("POST test route reached");

    res.json({
        success: true,
        message: "POST route works"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin/jobs",jobRoutes);
app.use("/api/student/applications",adminRoutes);
app.use("/api/admin/applications",adminApplicationRoutes);
app.use("/api/student/applications",applicationRoutes);
app.use("/api/admin/attendance",attendanceRoute);


// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("=================================");
            console.log("🚀 PLACEMENT PORTAL BACKEND");
            console.log(`🚀 Server: http://localhost:${PORT}`);
            console.log("=================================");
        });
    } catch (error) {
        console.error("❌ Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();