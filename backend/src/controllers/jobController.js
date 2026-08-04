import Job from "../models/Job.js";


// ===============================
// CREATE JOB
// ===============================

export const createJob = async (req, res) => {
    try {
        const {
            companyName,
            jobTitle,
            description,
            location,
            employmentType,
            salary,
            eligibility,
            skills,
            applicationDeadline,
            applicationLink
        } = req.body;

        if (
            !companyName ||
            !jobTitle ||
            !description ||
            !location ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                success: false,
                message: "Required job fields are missing"
            });
        }

        const job = await Job.create({
            companyName: companyName.trim(),
            jobTitle: jobTitle.trim(),
            description: description.trim(),
            location: location.trim(),
            employmentType,
            salary: salary?.trim() || "",
            eligibility: eligibility?.trim() || "",
            skills: Array.isArray(skills) ? skills : [],
            applicationDeadline,
            applicationLink: applicationLink?.trim() || "",
            status: "draft",
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating job"
        });
    }
};


// ===============================
// GET ALL JOBS - ADMIN
// ===============================

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching jobs"
        });
    }
};


// ===============================
// UPDATE JOB
// ===============================

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const allowedFields = [
            "companyName",
            "jobTitle",
            "description",
            "location",
            "employmentType",
            "salary",
            "eligibility",
            "skills",
            "applicationDeadline",
            "applicationLink"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        await job.save();

        return res.json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating job"
        });
    }
};


// ===============================
// CHANGE JOB STATUS
// ===============================

export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "draft",
            "published",
            "closed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job status"
            });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.status = status;

        await job.save();

        return res.json({
            success: true,
            message: `Job ${status} successfully`,
            job
        });

    } catch (error) {
        console.error("Update job status error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating job status"
        });
    }
};


// ===============================
// DELETE JOB
// ===============================

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        await Job.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting job"
        });
    }
};

// ===============================
// GET PUBLISHED JOBS - STUDENT
// ===============================

export const getPublishedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: "published"
        })
            .select(
                "companyName jobTitle description location employmentType salary eligibility skills applicationDeadline createdAt"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get published jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching available jobs"
        });
    }
};


// ===============================
// GET SINGLE PUBLISHED JOB
// ===============================

export const getPublishedJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findOne({
            _id: id,
            status: "published"
        }).select(
            "companyName jobTitle description location employmentType salary eligibility skills applicationDeadline createdAt"
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or no longer available"
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Get published job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching job"
        });
    }
};