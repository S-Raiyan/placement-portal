import bcrypt from "bcryptjs";
import Student from "../models/Student.js";


// ===============================
// CREATE STUDENT
// ===============================

export const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            username,
            password
        } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, username and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username.trim();

        const existingStudent = await Student.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Student email or username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const student = await Student.create({
            name: name.trim(),
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword,
            role: "student",
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username,
                role: student.role,
                isActive: student.isActive
            }
        });

    } catch (error) {
        console.error("Create student error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating student"
        });
    }
};


// ===============================
// GET ALL STUDENTS
// ===============================

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
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


// ===============================
// UPDATE STUDENT STATUS
// ===============================

export const updateStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body || {};

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

        return res.status(200).json({
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


// ===============================
// RESET STUDENT PASSWORD
// ===============================

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

        return res.status(200).json({
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


// ===============================
// DELETE STUDENT
// ===============================

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

        return res.status(200).json({
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

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            course
        } = req.body;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (name !== undefined) {
            student.name = name.trim();
        }

        if (email !== undefined) {
            student.email = email.trim().toLowerCase();
        }

        if (phone !== undefined) {
            student.phone = phone.trim();
        }

        if (course !== undefined) {
            student.course = course.trim();
        }

        await student.save();

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        console.error(
            "Update student error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while updating student"
        });
    }
};