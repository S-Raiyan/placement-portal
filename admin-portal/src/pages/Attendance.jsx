import { useEffect, useState } from "react";
import api from "../services/api";
import QRScannerModal from "../components/QRScannerModel";

function Attendance() {

    const today = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(today);

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(false);

    const [openScanner, setOpenScanner] = useState(false);

    const fetchAttendance = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/admin/attendance?date=${selectedDate}`
            );

            setAttendance(response.data.attendance);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const markAttendance = async (studentId) => {

        try {

            await api.post(
                "/admin/attendance/present",
                {
                    studentId
                }
            );

            alert("✅ Attendance marked successfully");

            fetchAttendance();

        } catch (error) {

            console.error(error);

            alert("Failed to mark attendance");

        }

};

    

    useEffect(() => {

        fetchAttendance();

    }, [selectedDate]);

    return (

        <div className="attendance-page">

            <h1>
                Attendance Management
            </h1>

            <div className="attendance-toolbar">

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        setSelectedDate(e.target.value)
                    }
                />

                <button onClick={() => setOpenScanner(true)}>
                    📷 Start QR Scanner
                </button>

            </div>
                    {
                        openScanner && (

                        <QRScannerModal

                            onClose={() => setOpenScanner(false)}

                            onScan={async (studentId) => {

                                setOpenScanner(false);

                                await markAttendance(studentId);

                            }}

                        />

                    )
}
            {loading ? (

                <p>Loading...</p>

            ) : (

                <table className="attendance-table">

                    <thead>

                        <tr>

                            <th>Student ID</th>

                            <th>Name</th>

                            <th>Course</th>

                            <th>Status</th>

                            <th>Time</th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map((student) => (

                            <tr key={student._id}>

                                <td>{student.studentId}</td>

                                <td>{student.studentName}</td>

                                <td>{student.course}</td>

                                <td>{student.status}</td>

                                <td>{student.checkInTime || "-"}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

}

export default Attendance;