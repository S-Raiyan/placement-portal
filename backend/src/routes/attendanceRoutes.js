import express from "express";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

import {
    getAttendanceByDate,
    markPresent
} from "../controllers/attendanceController.js";

const router = express.Router();


// ===============================
// ADMIN ROUTES
// ===============================

// Get attendance by selected date
router.get(
    "/",
    protect,
    adminOnly,
    getAttendanceByDate
);


// Mark student present (QR Scan)
router.post(
    "/present",
    protect,
    adminOnly,
    markPresent
);

export default router;