import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        jobTitle: "",
        description: "",
        location: "",
        employmentType: "Full-time",
        salary: "",
        eligibility: "",
        skills: "",
        applicationDeadline: "",
        applicationLink: "",
    })
    const [editingJob, setEditingJob] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null)

    const currentFormData = editingJob || formData;

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/jobs");

            setJobs(response.data.jobs || []);

        } catch (error) {
            console.error(
                "Fetch jobs error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load jobs"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const getStatusClass = (status) => {
        if (status === "published") {
            return "published";
        }

        if (status === "closed") {
            return "closed";
        }

        return "draft";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);

            const payload = {
                ...formData,

                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
            };

            const response = await api.post(
                "/admin/jobs",
                payload
            );

            setJobs((current) => [
                response.data.job,
                ...current
            ]);

            setFormData({
                companyName: "",
                jobTitle: "",
                description: "",
                location: "",
                employmentType: "Full-time",
                salary: "",
                eligibility: "",
                skills: "",
                applicationDeadline: "",
                applicationLink: ""
            });

            setShowForm(false);

            alert("Job created successfully");

        } catch (error) {
            console.error(
                "Create job error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create job"
            );
        } finally {
            setCreating(false);
        }
    };

    const handleEditJob = (job) => {
        setEditingJob({
            ...job,
            applicationDeadline: job.applicationDeadline
                ? job.applicationDeadline.slice(0, 10)
                : "",
            skills: Array.isArray(job.skills)
                ? job.skills.join(", ")
                : ""
        });

        setShowForm(true);
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();

        if (!editingJob?._id) {
            return;
        }

        try {
            setUpdating(true);

            const payload = {
                companyName: editingJob.companyName,
                jobTitle: editingJob.jobTitle,
                description: editingJob.description,
                location: editingJob.location,
                employmentType: editingJob.employmentType,
                salary: editingJob.salary,
                eligibility: editingJob.eligibility,

                skills: editingJob.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),

                applicationDeadline:
                    editingJob.applicationDeadline,

                applicationLink:
                    editingJob.applicationLink
            };

            const response = await api.patch(
                `/admin/jobs/${editingJob._id}`,
                payload
            );

            setJobs((current) =>
                current.map((job) =>
                    job._id === editingJob._id
                        ? response.data.job
                        : job
                )
            );

            setEditingJob(null);
            setShowForm(false);

            alert("Job updated successfully");

        } catch (error) {
            console.error(
                "Update job error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update job"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateJobStatus = async (job) => {
        const newStatus =
            job.status === "published"
                ? "draft"
                : "published";

        const action =
            newStatus === "published"
                ? "publish"
                : "unpublish";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${job.jobTitle}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingStatusId(job._id);

            const response = await api.patch(
                `/admin/jobs/${job._id}/status`,
                {
                    status: newStatus
                }
            );

            setJobs((current) =>
                current.map((item) =>
                    item._id === job._id
                        ? response.data.job
                        : item
                )
            );

        } catch (error) {
            console.error(
                "Update job status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update job status"
            );

        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDeleteJob = async (job) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${job.jobTitle}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/jobs/${job._id}`
            );

            setJobs((current) =>
                current.filter(
                    (item) => item._id !== job._id
                )
            );

            alert("Job deleted successfully");

        } catch (error) {
            console.error(
                "Delete job error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };



    return (
        <div className="jobs-page">

            {/* HEADER */}

            <div className="jobs-page-header">

                <div>
                    <p className="page-eyebrow">
                        PLACEMENT MANAGEMENT
                    </p>

                    <h1>
                        Jobs
                    </h1>

                    <p>
                        Create and manage placement
                        opportunities for students.
                    </p>
                </div>

                <button
                    className="primary-admin-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm
                        ? "close" : "+ Add Job"
                    }
                </button>

            </div>

            {showForm && (
                <form
                    className="job-form"
                    onSubmit={editingJob
                        ? handleUpdateJob : handleCreateJob
                    }
                >
                    <div className="job-form-header">
                        <div>
                            <p className="page-eyebrow">
                                NEW OPPORTUNITY
                            </p>

                            <h2>
                                {editingJob
                                    ? "Edit Job" : "Create Job"}
                            </h2>
                        </div>
                    </div>

                    <div className="job-form-grid">

                        <div className="form-group">
                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                value={currentFormData.companyName || ""}
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            companyName: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                value={currentFormData.companyName || ""}
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            companyName: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={currentFormData.location || ""}
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            location: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Employment Type
                            </label>

                            <select
                                name="employmentType"
                                value={
                                    currentFormData.employmentType ||
                                    "Full-time"
                                }
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            employmentType: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                            >
                                <option value="Full-time">
                                    Full-time
                                </option>

                                <option value="Part-time">
                                    Part-time
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label>
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={currentFormData.salary || ""}
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            salary: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Application Deadline
                            </label>

                            <input
                                type="date"
                                name="applicationDeadline"
                                value={
                                    currentFormData.applicationDeadline || ""
                                }
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            applicationDeadline: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                                required
/>
                        </div>


                        <div className="form-group">
                            <label>
                                Eligibility
                            </label>

                            <input
                                type="text"
                                name="eligibility"
                                value={
                                    currentFormData.eligibility || ""
                                }
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            eligibility: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
/>
                        </div>


                        <div className="form-group">
                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={currentFormData.skills || ""}
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            skills: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                            />

                            <small>
                                Separate skills using commas
                            </small>
                        </div>


                        <div className="form-group full-width">
                            <label>
                                Application Link
                            </label>

                           
                        </div>


                        <div className="form-group full-width">
                            <label>
                                Job Description
                            </label>
                            <input
                                type="url"
                                name="applicationLink"
                                value={
                                    currentFormData.applicationLink || ""
                                }
                                onChange={(e) => {
                                    if (editingJob) {
                                        setEditingJob((current) => ({
                                            ...current,
                                            applicationLink: e.target.value
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                            />
                        </div>

                    </div>


                    <div className="student-form-actions">

                        <button
                            type="button"
                            className="cancel-form-button"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-admin-button"
                            disabled={editingJob
                                ? updating : creating
                            }
                        >
                            {editingJob
                                ? updating
                                    ? "Updating..."
                                    : "Update Job"
                                : creating
                                    ? "Creating..."
                                    : "Create Job"}
                        </button>

                    </div>

                </form>
            )}


            {/* LOADING */}

            {loading && (
                <div className="students-state">
                    Loading jobs...
                </div>
            )}


            {/* ERROR */}

            {!loading && error && (
                <div className="students-state error">
                    {error}
                </div>
            )}


            {/* EMPTY */}

            {!loading &&
                !error &&
                jobs.length === 0 && (

                    <div className="students-state">
                        No jobs found.
                    </div>

                )}


            {/* JOBS */}

            {!loading &&
                !error &&
                jobs.length > 0 && (

                    <div className="jobs-grid">

                        {jobs.map((job) => (

                            <div
                                className="job-admin-card"
                                key={
                                    job._id ||
                                    job.id
                                }
                            >

                                <div className="job-card-top">

                                    <div>

                                        <p className="job-company">
                                            {job.companyName}
                                        </p>

                                        <h2>
                                            {job.jobTitle}
                                        </h2>

                                    </div>

                                    <span
                                        className={
                                            `job-status ${getStatusClass(
                                                job.status
                                            )}`
                                        }
                                    >
                                        {job.status}
                                    </span>

                                </div>


                                <div className="job-info">

                                    <span>
                                        📍 {job.location}
                                    </span>

                                    <span>
                                        💼 {job.employmentType}
                                    </span>

                                    {job.salary && (
                                        <span>
                                            💰 {job.salary}
                                        </span>
                                    )}

                                </div>


                                <p className="job-description">
                                    {job.description}
                                </p>


                                <div className="job-deadline">

                                    <strong>
                                        Application deadline
                                    </strong>

                                    <span>
                                        {new Date(
                                            job.applicationDeadline
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    </span>

                                </div>


                                <div className="job-card-actions">

                                    <button
                                        className="table-action-button"
                                        onClick={() => handleEditJob(job)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={
                                            job.status === "published"
                                                ? "job-unpublish-button"
                                                : "job-publish-button"
                                        }
                                        onClick={() =>
                                            handleUpdateJobStatus(job)
                                        }
                                        disabled={
                                            updatingStatusId === job._id
                                        }
                                    >
                                        {updatingStatusId === job._id
                                            ? "Updating..."
                                            : job.status === "published"
                                                ? "Unpublish"
                                                : "Publish"}
                                    </button>
                                    <button
                                        className="job-delete-button"
                                        onClick={() => handleDeleteJob(job)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default Jobs;