import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSiderbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Applications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate()


    useEffect(() => {

        const fetchApplications = async () => {

            try {

                const response = await api.get(
                    "/admin/applications"
                );

                setApplications(
                    response.data.applications
                );

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load applications"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchApplications();

    }, []);

    const deleteApplication = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this application?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(
                `/admin/applications/${id}`
            );

            setApplications(
                applications.filter(
                    (item) => item._id !== id
                )
            );

            alert("Application deleted");

        } catch (error) {

            console.error(error);

            alert("Unable to delete application");

        }

    };


    const deleteAllApplications = async () => {

        const confirmDelete = window.confirm(
            "Delete ALL applications?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(
                "/admin/applications"
            );

            setApplications([]);

            alert("All applications deleted");

        } catch (error) {

            console.error(error);

            alert("Unable to delete applications");

        }

    };

    const filteredApplications = applications.filter((application)=>{

        const student = application.student?.name?.toLowerCase() || "";

        const company = application.job?.companyName?.toLowerCase() || "";

        const job = application.job?.jobTitle?.toLowerCase() || "";

        return(
            student.includes(search.toLocaleLowerCase()) || 
            company.includes(search.toLocaleLowerCase()) ||
            job.includes(search.toLocaleLowerCase())
        )
    })

    return (


        <>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search student, company or job..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <main className="applications-page">

                <div className="page-header">
                    <p className="page-eyebrow">
                        MANAGEMENT
                    </p>

                    <h1>
                        Job Applications
                    </h1>

                    <p>
                        Review and manage all student job applications.
                    </p>
                </div>

                <button className="delete-all-button" onClick={deleteAllApplications}>Delete All</button>

                {loading ? (

                    <p>Loading...</p>

                ) : error ? (

                    <p>{error}</p>

                ) : (

                    <div className="applications-table-container">

                        <div className="table-wrapper">

                        <table className="applications-table">

                            <thead>

                                <tr>

                                    <th>Student</th>

                                    <th>Company</th>

                                    <th>Job</th>

                                    <th>Status</th>

                                    <th>Applied On</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredApplications.map((application) => (

                                    <tr key={application._id}>

                                        <td>

                                            <div className="student-info">

                                                <div className="student-avatar">

                                                    {application.student?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <div>

                                                    <div className="student-name">
                                                        {application.student?.name}
                                                    </div>

                                                    <div className="student-email">
                                                        {application.student?.email}
                                                    </div>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <strong>
                                                {application.job?.companyName}
                                            </strong>

                                        </td>

                                        <td>

                                            {application.job?.jobTitle}

                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${application.status}`}
                                            >

                                                {application.status}

                                            </span>

                                        </td>

                                        <td>

                                            {new Date(
                                                application.createdAt
                                            ).toLocaleDateString()}

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="btn-view"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/applications/${application._id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button 
                                                className="delete-button"
                                                onClick={() => deleteApplication(application._id)}
                                                >Delete</button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        </div>

                    </div>

                )}

            </main>

</>

    
    );
}

export default Applications;