import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AttendanceCalendar({ history }) {

    const getStatus = (date) => {

        const formattedDate = date
            .toISOString()
            .split("T")[0];

        const record = history.find(
            item => item.date === formattedDate
        );

        return record?.status;

    };

    return (

        <div className="attendance-calendar">

            <Calendar

                tileClassName={({ date, view }) => {

                    if (view !== "month") return;

                    const status = getStatus(date);

                    if (status === "Present")
                        return "present-day";

                    if (status === "Absent")
                        return "absent-day";

                    if (status === "Holiday")
                        return "holiday-day";

                }}

            />

            <div className="calendar-legend">

                <div>
                    <span className="legend-box present-day"></span>
                    Present
                </div>

                <div>
                    <span className="legend-box absent-day"></span>
                    Absent
                </div>

                <div>
                    <span className="legend-box holiday-day"></span>
                    Holiday
                </div>

            </div>

        </div>

    );

}

export default AttendanceCalendar;