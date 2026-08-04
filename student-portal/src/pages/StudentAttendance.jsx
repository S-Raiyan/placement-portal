import { useEffect, useState } from "react";
import api from "../services/api";
import AttendanceCalendar from "../components/AttendanceCalendar";

function StudentAttendance() {

    const [attendance, setAttendance] = useState({
        percentage: 0,
        present: 0,
        absent: 0,
        holiday: 0,
        history: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchAttendance();

    }, []);

    const fetchAttendance = async () => {

        try {

            const response = await api.get(
                "/student/attendance"
            );

            setAttendance(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="student-attendance-page">

            <h1>
                My Attendance
            </h1>

            <div className="attendance-summary">

                <div className="attendance-progress-card">

                    <h2>
                        Attendance Percentage
                    </h2>

                    <div className="attendance-progress">

                        <div
                            className="attendance-progress-fill"
                            style={{
                                width: `${attendance.percentage}%`
                            }}
                        />

                    </div>

                    <h3>
                        {attendance.percentage}%
                    </h3>

                </div>

                <div className="attendance-stat-card">

                    <h3>Present</h3>

                    <p>{attendance.present}</p>

                </div>

                <div className="attendance-stat-card">

                    <h3>Absent</h3>

                    <p>{attendance.absent}</p>

                </div>

                <div className="attendance-stat-card">

                    <h3>Holiday</h3>

                    <p>{attendance.holiday}</p>

                </div>

            </div>

            <AttendanceCalendar history={attendance.history}/>

            <div className="attendance-history">

                <h2>
                    Attendance History
                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Time</th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.history.map((item) => (

                            <tr key={item._id}>

                                <td>
                                    {item.date}
                                </td>

                                <td>
                                    {item.status}
                                </td>

                                <td>
                                    {item.checkInTime || "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default StudentAttendance;