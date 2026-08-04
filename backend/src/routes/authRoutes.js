import express from "express";

import {
    adminLogin,
    studentLogin,
    getMe
} from "../controllers/authController.js";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

router.post("/student/login", studentLogin);

router.get("/me", protect, getMe);

router.get("/admin-test",protect,adminOnly,(req, res)=>{
    res.json({
        success:true,
        message:"Admin protected route is working",
        user:req.user
    })
})

export default router;