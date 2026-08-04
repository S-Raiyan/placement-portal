import express from "express";

import {
    protect,
    studentOnly
} from "../middleware/authMiddleware.js";

import uploadResume from "../middleware/uploadMiddleware.js";

import {
    applyForJob,
    getAllApplications,
    getApplicationById,
    getMyApplications,
    updateApplicationStatus
}from "../controllers/applicationController.js";

const router = express.Router();


// ===============================
// STUDENT AUTHENTICATION
// ===============================

router.use(
    protect,
    studentOnly
);


// ===============================
// APPLY FOR JOB
// ===============================

router.post(
    "/jobs/:jobId",
    uploadResume.single("resume"),
    applyForJob
);


// ===============================
// MY APPLICATIONS
// ===============================


router.get(
    "/my",
    protect,
    studentOnly,
    getMyApplications
)


export default router;