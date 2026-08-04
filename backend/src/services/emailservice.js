import dotenv from "dotenv";
dotenv.config()
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendJobApplicationEmail = async ({
    student,
    job,
    application,
    resume
}) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,

        to: process.env.INSTITUTE_EMAIL,

        subject: `Job Application - ${job.jobTitle} - ${student.name}`,

        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h2>New Job Application</h2>

                <p>A student has applied for a job through the Placement Portal.</p>

                <hr />

                <h3>Student Details</h3>

                <p>
                    <strong>Name:</strong>
                    ${student.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${student.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${application.phone || "Not provided"}
                </p>

                <h3>Job Details</h3>

                <p>
                    <strong>Company:</strong>
                    ${job.companyName}
                </p>

                <p>
                    <strong>Position:</strong>
                    ${job.jobTitle}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${job.location}
                </p>

                <h3>Cover Message</h3>

                <p>
                    ${application.coverMessage || "No cover message provided"}
                </p>

                <hr />

                <p>
                    Resume is attached to this email.
                </p>

                <p>
                    <strong>Placement Portal</strong>
                </p>

            </div>
        `,

        attachments: [
            {
                filename: resume.originalname,
                content: resume.buffer,
                contentType: resume.mimetype
            }
        ]
    };

    await transporter.sendMail(mailOptions);

};