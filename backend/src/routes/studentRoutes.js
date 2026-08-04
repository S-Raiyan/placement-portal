import express from "express";

import {
    protect,
    studentOnly
} from "../middleware/authMiddleware.js";

import {
    getPublishedJobs,
    getPublishedJobById
} from "../controllers/jobController.js";

import uploadResume from "../middleware/uploadMiddleware.js";

import {
    applyForJob
} from "../controllers/applicationController.js";

import {
    getMyAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    studentOnly,
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Student Dashboard",
            user: req.user
        });
    }
);

router.get(
    "/jobs",
    protect,
    studentOnly,
    getPublishedJobs
);

router.get(
    "/jobs/:id",
    protect,
    studentOnly,
    getPublishedJobById
);

router.post(
    "/jobs/:id/apply",
    protect,
    studentOnly,
    uploadResume.single("resume"),
    applyForJob
);

// ===============================
// STUDENT ATTENDANCE
// ===============================

router.get(
    "/attendance",
    protect,
    studentOnly,
    getMyAttendance
);

export default router;