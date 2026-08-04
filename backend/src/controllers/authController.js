import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Student from "../models/Student.js";

const generateToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};


// ===============================
// ADMIN LOGIN
// ===============================

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const admin = await Admin
            .findOne({ email: email.toLowerCase() })
            .select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(admin._id, "admin");

        return res.json({
            success: true,
            message: "Admin login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// STUDENT LOGIN
// ===============================

export const studentLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const student = await Student
            .findOne({ username })
            .select("+password");

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        if (!student.isActive) {
            return res.status(403).json({
                success: false,
                message: "Student account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = generateToken(student._id, "student");

        return res.json({
            success: true,
            message: "Student login successful",
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username,
                role: "student"
            }
        });

    } catch (error) {
        console.error("Student login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        let user;

        if (req.user.role === "admin") {
            user = await Admin.findById(req.user.id).select(
                "-password"
            );
        }

        if (req.user.role === "student") {
            user = await Student.findById(req.user.id).select(
                "-password"
            );
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};