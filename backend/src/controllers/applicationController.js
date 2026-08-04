import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import { sendJobApplicationEmail } from "../services/emailservice.js";


export const applyForJob = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { id } = req.params;

        const {
            phone,
            coverMessage
        } = req.body;

        // -------------------------------
        // CHECK RESUME
        // -------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        // -------------------------------
        // CHECK STUDENT
        // -------------------------------

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // -------------------------------
        // CHECK JOB
        // -------------------------------

        const job = await Job.findOne({
            _id: id,
            status: "published"
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or no longer available"
            });
        }

        // -------------------------------
        // CHECK DEADLINE
        // -------------------------------

        if (
            new Date(job.applicationDeadline) <
            new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Application deadline has passed"
            });
        }

        // -------------------------------
        // CHECK DUPLICATE
        // -------------------------------

        const existingApplication =
            await Application.findOne({
                student: studentId,
                job: id
            });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // -------------------------------
        // CREATE APPLICATION
        // -------------------------------

        const application = await Application.create({
            student: studentId,
            job: id,
            name: student.name,
            email: student.email,
            phone: phone?.trim() || "",
            coverMessage: coverMessage?.trim() || ""
        });

        // -------------------------------
        // SEND EMAIL
        // -------------------------------

        try {

            await sendJobApplicationEmail({
                student,
                job,
                application,
                resume: req.file
            });

        } catch (emailError) {

            console.error(
                "Application email failed:",
                emailError
            );

            // Remove application if email failed
            await Application.findByIdAndDelete(
                application._id
            );

            return res.status(500).json({
                success: false,
                message: "Application could not be sent to institute email"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application: {
                id: application._id,
                jobId: job._id,
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                status: application.status,
                appliedAt: application.createdAt
            }
        });

    } catch (error) {

        console.error(
            "Apply for job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while applying for job"
        });
    }
};

// ===============================
// ADMIN - GET ALL APPLICATIONS
// ===============================

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate(
                "student",
                "name email username"
            )
            .populate(
                "job",
                "companyName jobTitle location employmentType"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "Get all applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching applications"
        });
    }
};


// ===============================
// ADMIN - GET APPLICATION BY ID
// ===============================

export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id)
            .populate(
                "student",
                "name email username"
            )
            .populate(
                "job",
                "companyName jobTitle location employmentType salary"
            );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            application
        });

    } catch (error) {
        console.error(
            "Get application error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching application"
        });
    }
};


// ===============================
// ADMIN - UPDATE APPLICATION STATUS
// ===============================

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "applied",
            "shortlisted",
            "rejected",
            "selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const application =
            await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error(
            "Update application status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while updating application"
        });
    }
};

// ===============================
// STUDENT - GET MY APPLICATIONS
// ===============================

export const getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;

        const applications = await Application.find({
            student: studentId
        })
            .populate(
                "job",
                "companyName jobTitle location employmentType salary applicationDeadline"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "Get my applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching applications"
        });
    }
};

// ===============================
// DELETE SINGLE APPLICATION
// ===============================

export const deleteApplication = async (req, res) => {
    try {

        const { id } = req.params;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        await Application.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete application error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while deleting application"
        });

    }
};


// ===============================
// DELETE ALL APPLICATIONS
// ===============================

export const deleteAllApplications = async (req, res) => {
    try {

        await Application.deleteMany({});

        return res.status(200).json({
            success: true,
            message: "All applications deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete all applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while deleting applications"
        });

    }
};