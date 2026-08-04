import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        coverMessage: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "applied",
                "shortlisted",
                "rejected",
                "selected"
            ],
            default: "applied"
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;