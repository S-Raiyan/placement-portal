import express from "express";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

import {
    createAdmin
} from "../controllers/adminController.js";

import {
    createStudent,
    getStudents,
    updateStudent,
    updateStudentStatus,
    deleteStudent,
    resetStudentPassword
} from "../controllers/studentController.js";

import  { getDashboardStats } from "../controllers/getDashboardstats.js";

const router = express.Router();


// ===============================
// ADMIN DASHBOARD
// ===============================

router.get(
    "/dashboard",
    protect,
    adminOnly,
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Admin Dashboard",
            user: req.user
        });
    }
);


// ===============================
// CREATE ADMIN
// ===============================

router.post(
    "/create-admin",
    protect,
    adminOnly,
    createAdmin
);


// ===============================
// STUDENT MANAGEMENT
// ===============================

// Create student
router.post(
    "/students",
    protect,
    adminOnly,
    createStudent
);


// Get all students
router.get(
    "/students",
    protect,
    adminOnly,
    getStudents
);


// Activate / Deactivate student
router.patch(
    "/students/:id/status",
    protect,
    adminOnly,
    updateStudentStatus
);


// Reset student password
router.patch(
    "/students/:id/reset-password",
    protect,
    adminOnly,
    resetStudentPassword
);


// Delete student
router.delete(
    "/students/:id",
    protect,
    adminOnly,
    deleteStudent
);

router.put(
    "/students/:id",
    protect,
    adminOnly,
    updateStudent
)

router.get(
    "/dashboard/stats",
    protect,
    adminOnly,
    getDashboardStats
)


export default router;