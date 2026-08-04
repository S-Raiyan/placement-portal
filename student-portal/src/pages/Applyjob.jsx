import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";
import api from "../services/api";

function ApplyJob() {
    const { id  } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);

    const [phone, setPhone] = useState("");
    const [coverMessage, setCoverMessage] = useState("");
    const [resume, setResume] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/student/jobs/${id}`
                );

                setJob(response.data.job);

            } catch (error) {
                console.error(
                    "Apply page job error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load job"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {
            setResume(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setResume(null);

            event.target.value = "";

            setError(
                "Only PDF resume files are allowed."
            );

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResume(null);

            event.target.value = "";

            setError(
                "Resume must be smaller than 5 MB."
            );

            return;
        }

        setResume(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        if (!resume) {
            setError("Please upload your resume PDF.");
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "phone",
                phone.trim()
            );

            formData.append(
                "coverMessage",
                coverMessage.trim()
            );

            formData.append(
                "resume",
                resume
            );

            const response = await api.post(
                `/student/jobs/${id}/apply`,
                formData
            );

            setSuccess(
                response.data.message ||
                "Application submitted successfully."
            );

            setPhone("");
            setCoverMessage("");
            setResume(null);

            const fileInput =
                document.getElementById("resume");

            if (fileInput) {
                fileInput.value = "";
            }

        } catch (error) {
            console.error(
                "Application submission error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to submit application."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="apply-page">

                    <Skeleton type="title" />

                    <div className="apply-skeleton">
                        <Skeleton type="job" />
                    </div>

                </main>
            </>
        );
    }

    if (error && !job) {
        return (
            <>
                <Navbar />

                <main className="apply-page">

                    <div className="apply-message error">
                        <h2>
                            Unable to open application
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/jobs"
                            className="back-link"
                        >
                            ← Back to jobs
                        </Link>
                    </div>

                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="apply-page">

                <Link
                    to={`/jobs/${id}`}
                    className="back-link"
                >
                    ← Back to job details
                </Link>


                <div className="apply-layout">

                    <section className="apply-intro">

                        <p className="dashboard-eyebrow">
                            Application
                        </p>

                        <h1>
                            Apply for this opportunity
                        </h1>

                        <p className="apply-description">
                            Submit your details and resume
                            to apply for this placement
                            opportunity.
                        </p>


                        <div className="apply-job-summary">

                            <div className="company-logo large">
                                {job?.companyName
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div>
                                <p className="company-name">
                                    {job?.companyName}
                                </p>

                                <h2>
                                    {job?.jobTitle}
                                </h2>

                                <span>
                                    {job?.location}
                                </span>
                            </div>

                        </div>

                    </section>


                    <section className="apply-form-card">

                        <form
                            onSubmit={handleSubmit}
                            className="apply-form"
                        >

                            {error && (
                                <div className="form-alert error">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="form-alert success">
                                    {success}
                                </div>
                            )}


                            <div className="form-field">

                                <label htmlFor="phone">
                                    Phone number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label htmlFor="coverMessage">
                                    Cover message
                                </label>

                                <textarea
                                    id="coverMessage"
                                    rows="6"
                                    placeholder="Tell the recruiter briefly why you are suitable for this opportunity..."
                                    value={coverMessage}
                                    onChange={(event) =>
                                        setCoverMessage(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label htmlFor="resume">
                                    Resume
                                </label>

                                <label
                                    htmlFor="resume"
                                    className="resume-upload"
                                >

                                    <span className="upload-icon">
                                        ↑
                                    </span>

                                    <span>
                                        {resume
                                            ? resume.name
                                            : "Choose your resume PDF"}
                                    </span>

                                    <small>
                                        PDF only · Maximum 5 MB
                                    </small>

                                </label>

                                <input
                                    id="resume"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={
                                        handleResumeChange
                                    }
                                    hidden
                                />

                            </div>


                            <button
                                type="submit"
                                className="submit-application-button"
                                disabled={submitting}
                            >

                                {submitting
                                    ? "Submitting application..."
                                    : "Submit application"}

                            </button>

                        </form>

                    </section>

                </div>

            </main>
        </>
    );
}

export default ApplyJob;