import express from "express";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

import {
    createJob,
    getAllJobs,
    updateJob,
    updateJobStatus,
    deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", createJob);

router.get("/", getAllJobs);

router.patch("/:id", updateJob);

router.patch("/:id/status", updateJobStatus);

router.delete("/:id", deleteJob);

export default router;