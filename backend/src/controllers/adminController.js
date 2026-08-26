import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "admin"
        });

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Create admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching students"
        });
    }
};


export const updateStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.isActive = isActive;

        await student.save();

        return res.json({
            success: true,
            message: isActive
                ? "Student activated successfully"
                : "Student deactivated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username,
                isActive: student.isActive
            }
        });

    } catch (error) {
        console.error("Update student status error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating student"
        });
    }
};


export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await Student.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting student"
        });
    }
};


export const resetStudentPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const student = await Student.findById(id)
            .select("+password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.password = await bcrypt.hash(password, 12);

        await student.save();

        return res.json({
            success: true,
            message: "Student password reset successfully"
        });

    } catch (error) {
        console.error("Reset student password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while resetting password"
        });
    }
};

