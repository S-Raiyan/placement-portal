import { useEffect, useState } from "react";
import api from "../services/api";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [resettingId, setResettingId]=useState(null)
    const [search, setSearch] = useState("")

    const [editData, setEditData] = useState({
        name: "",
        email: "",
        phone: "",
        course: ""
    });

const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        course: ""
    });

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/admin/students"
            );

            setStudents(
                response.data.students || []
            );
        } catch (error) {
            console.error(
                "Fetch students error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load students"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);

            const response = await api.post(
                "/admin/students",
                formData
            );

            setStudents((current) => [
                response.data.student,
                ...current
            ]);

            setFormData({
                name: "",
                email: "",
                username: "",
                password: "",
                phone: "",
                course: ""
            });

            setShowForm(false);

            alert("Student created successfully");

        } catch (error) {
            console.error(
                "Create student error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create student"
            );
        } finally {
            setCreating(false);
        }
    };

   const handleDeleteStudent = async (student) => {
    const studentId = student._id || student.id;

    console.log("Student:", student);
    console.log("Student ID:", studentId);

    if (!studentId) {
        alert("Student ID is missing");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await api.delete(
            `/admin/students/${studentId}`
        );

        setStudents((current) =>
            current.filter(
                (item) =>
                    (item._id || item.id) !== studentId
            )
        );

    } catch (error) {
        console.error(
            "Delete student error:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to delete student"
        );
    }
};

const handleEditStudent = (student) => {
    setEditingStudent(student);

    setEditData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        course: student.course || ""
    });
};

const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((current) => ({
        ...current,
        [name]: value
    }));
};

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        const studentId =
            editingStudent._id || editingStudent.id;

        if (!studentId) {
            alert("Student ID is missing");
            return;
        }

        try {
            setUpdating(true);

            const response = await api.put(
                `/admin/students/${studentId}`,
                editData
            );

            const updatedStudent =
                response.data.student;

            setStudents((current) =>
                current.map((student) =>
                    (student._id || student.id) === studentId
                        ? updatedStudent
                        : student
                )
            );

            setEditingStudent(null);

            alert("Student updated successfully");

        } catch (error) {
            console.error(
                "Update student error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update student"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleToggleStatus = async (student) => {
        const studentId = student._id || student.id;

        try {
            const response = await api.patch(
                `/admin/students/${studentId}/status`,
                {
                    isActive: !student.isActive
                }
            );

            const updatedStudent = response.data.student;

            setStudents((current) =>
                current.map((item) =>
                    (item._id || item.id) === studentId
                        ? updatedStudent
                        : item
                )
            );

        } catch (error) {
            console.error(
                "Update student status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update student status"
            );
        }
    };

    const handleResetPassword = async (student) => {
        const studentId = student._id || student.id;

        if (!studentId) {
            alert("Student ID is missing");
            return;
        }

        const password = window.prompt(
            `Enter new password for ${student.name}:`
        );

        if (!password) {
            return;
        }

        if (password.length < 8) {
            alert(
                "Password must contain at least 8 characters"
            );
            return;
        }

        try {
            setResettingId(studentId);

            await api.patch(
                `/admin/students/${studentId}/reset-password`,
                {
                    password
                }
            );

            alert(
                "Student password reset successfully"
            );

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to reset password"
            );
        } finally {
            setResettingId(null);
        }
    };

    const filteredStudents = students.filter((student) => {
        const keyword = search.trim().toLowerCase();

        if (keyword === "") return true;

        return (
            (student.name || "").toLowerCase().includes(keyword) ||
            (student.username || "").toLowerCase().includes(keyword) ||
            String(student.phone || "").includes(keyword)
        );
    });


    return (
        <div className="students-page">

            <div className="students-page-header">

                <div>
                    <p className="page-eyebrow">
                        MANAGEMENT
                    </p>

                    <h1>Students</h1>

                    <p>
                        Manage registered students
                        in the placement portal.
                    </p>
                </div>

                <div className="table-header">
                    <div className="search-box">
                        <input type="text" placeholder="Search by name username or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                <button
                    className="primary-admin-button"
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                >
                    {showForm
                        ? "Close"
                        : "+ Add Student"}
                </button>

                </div>

            </div>


            {showForm && (
                <form
                    className="student-form"
                    onSubmit={handleCreateStudent}
                >

                    <h2>
                        Create New Student
                    </h2>

                    <div className="student-form-grid">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Student name"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="student@email.com"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>Username</label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone number"
                            />
                        </div>


                        <div className="form-group">
                            <label>Course</label>

                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                placeholder="BSc Computer Science"
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
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Student"}
                        </button>

                    </div>

                </form>

                
            )}


            {loading && (
                <div className="students-state">
                    Loading students...
                </div>
            )}


            {!loading && error && (
                <div className="students-state error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                students.length === 0 && (
                    <div className="students-state">
                        No students found.
                    </div>
                )}

            {editingStudent && (
                <form
                    className="student-form"
                    onSubmit={handleUpdateStudent}
                >
                    <h2>
                        Edit Student
                    </h2>

                    <div className="student-form-grid">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={editData.phone}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Course</label>

                            <input
                                type="text"
                                name="course"
                                value={editData.course}
                                onChange={handleEditChange}
                            />
                        </div>

                    </div>

                    <div className="student-form-actions">

                        <button
                            type="button"
                            className="cancel-form-button"
                            onClick={() =>
                                setEditingStudent(null)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-admin-button"
                            disabled={updating}
                        >
                            {updating
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>
                </form>
            )}


            {!loading &&
                !error &&
                students.length > 0 && (

                    <div className="students-table-wrapper">

                        <table className="students-table">

                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map((student) => (

                                    <tr key={student._id}>

                                        <td>
                                            <div className="student-name-cell">

                                                <div className="student-avatar">
                                                    {student.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {student.name}
                                                    </strong>

                                                    <span>
                                                        {student.phone ||
                                                            "No phone"}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {student.username}
                                        </td>

                                        <td>
                                            {student.email}
                                        </td>

                                        <td>
                                            {student.course || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    `student-status ${
                                                        student.isActive
                                                            ? "active"
                                                            : "inactive"
                                                    }`
                                                }
                                                onClick={() => handleToggleStatus(student)}
                                            >
                                                {student.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="student-actions">

                                                <button
                                                    className="table-action-button"
                                                    onClick={() => handleEditStudent(student)}
                                                >
                                                    Manage
                                                </button>

                                                <button
                                                    className="delete-student-button"
                                                    onClick={() =>
                                                        handleDeleteStudent(
                                                            student
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    className="reset-password-button"
                                                    onClick={() =>
                                                        handleResetPassword(student)
                                                    }
                                                    disabled={
                                                        resettingId ===
                                                        (student._id || student.id)
                                                    }
                                                >
                                                    {resettingId ===
                                                        (student._id || student.id)
                                                        ? "Resetting..."
                                                        : "Reset Password"}
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

        </div>
    );
}

export default Students;