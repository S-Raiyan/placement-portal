import Student from "../models/Student.js";
import Job from "../models/job.js";
import Application from "../models/Application.js";

export const getDashboardStats = async (req, res) => {
    try {

        const students = await Student.countDocuments();

        const jobs = await Job.countDocuments({
            status: "published"
        });

        const applications =
            await Application.countDocuments();

        const selected =
            await Application.countDocuments({
                status: "selected"
            });

        return res.status(200).json({
            success: true,
            stats: {
                students,
                jobs,
                applications,
                selected
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard stats"
        });

    }
};
