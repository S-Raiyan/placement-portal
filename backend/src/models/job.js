import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        employmentType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Internship"
            ],
            default: "Full-time"
        },

        salary: {
            type: String,
            trim: true,
            default: ""
        },

        eligibility: {
            type: String,
            trim: true,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        applicationLink: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "closed"
            ],
            default: "draft"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;