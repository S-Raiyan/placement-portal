import express from "express";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

import {
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    deleteAllApplications
} from "../controllers/applicationController.js";

const router = express.Router();

router.use(
    protect,
    adminOnly
);


// Get all applications
router.get(
    "/",
    getAllApplications,
    

);


// Get single application
router.get(
    "/:id",
    getApplicationById,

);


// Update application status
router.patch(
    "/:id/status",
    updateApplicationStatus,
    
);
//update the application
router.put(
    "/:id",
    updateApplicationStatus
)
//Delete one
router.delete(
    "/:id",
    deleteApplication
)

//Delete all

router.delete(
    "/",
    deleteAllApplications
)


export default router;