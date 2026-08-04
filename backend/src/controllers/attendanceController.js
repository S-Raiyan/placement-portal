import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// ===============================
// GET ATTENDANCE BY DATE
// ===============================

export const getAttendanceByDate = async (req, res) => {

    try {

        const { date } = req.query;

        const attendance = await Attendance.find({ date });

        return res.status(200).json({
            success: true,
            attendance
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance"
        });

    }

};


// ===============================
// MARK STUDENT PRESENT
// ===============================

export const markPresent = async (req, res) => {

    try {

        const { studentId } = req.body;

        const student = await Student.findOne({ studentId });

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        const today = new Date().toISOString().split("T")[0];

        const currentTime = new Date().toLocaleTimeString();

        const attendance = await Attendance.findOneAndUpdate(

            {
                student: student._id,
                date: today
            },

            {
                student: student._id,
                studentId: student.studentId,
                studentName: student.name,
                course: student.course,
                date: today,
                status: "Present",
                checkInTime: currentTime
            },

            {
                new: true,
                upsert: true
            }

        );

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark attendance"
        });

    }

};

// ===============================
// STUDENT - GET MY ATTENDANCE
// ===============================

export const getMyAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find({
            student: req.user._id
        }).sort({ date: -1 });

        const present = attendance.filter(
            item => item.status === "Present"
        ).length;

        const absent = attendance.filter(
            item => item.status === "Absent"
        ).length;

        const holiday = attendance.filter(
            item => item.status === "Holiday"
        ).length;

        const total = attendance.length;

        const percentage =
            total === 0
                ? 0
                : Math.round((present / total) * 100);

        return res.status(200).json({

            success: true,

            percentage,

            present,

            absent,

            holiday,

            history: attendance

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Failed to fetch attendance"

        });

    }

};