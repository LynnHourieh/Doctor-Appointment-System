import { useState } from "react";
import Button from "../../components/button/Button";
import InputField from "../../components/input-field/InputField";
import "./appointments-styles.scss"
const Appointments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const appointments = [
        {
            id: 1,
            date: "07/06/2025",
            time: "09:00 AM",
            patient: "John Doe",
            status: "Confirmed",
        },
        {
            id: 2,
            date: "07/07/2025",
            time: "11:00 AM",
            patient: "Alice Smith",
            status: "Cancelled",
        },
        {
            id: 3,
            date: "07/07/2025",
            time: "02:00 PM",
            patient: "Michael Brown",
            status: "Pending",
        },
    ];

    return (<div className="appointments-container">
        <div className="appointments-title">
            <h2 className="appointments-title-text">Our Appointmentss</h2>
            <div className="appointments-line"></div>
        </div>
        <p>View and Manage your upcoming and past appointments</p>
        <div className="appointments-search">
        <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />
        <InputField placeholder="Filter by date" type="date" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />
        </div>
        <table >
            <thead>
                <tr >
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {appointments.map((appt) => (
                    <tr key={appt.id} >
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>{appt.patient}</td>
                        <td>{appt.status}</td>
                        <td>
                            {appt.status === "Pending" && (
                                <>
                                    <Button
                                        text="Confirm" variant="tertiary"
                                        onClickHandler={() => console.log("Confirm", appt.id)}
                                    />

                                    <Button text="Cancel" variant="tertiary" onClickHandler={() => console.log("Cancel", appt.id)} />
                                </>
                            )}
                            {appt.status === "Cancelled" && (
                                <Button text="Reschedule" variant="tertiary" onClickHandler={() => console.log("Reschedule", appt.id)} />


                            )}
                            {appt.status === "Confirmed" && (
                                <Button text="View Notes" variant="tertiary" onClickHandler={() => console.log("View Notes", appt.id)} />


                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>)
}
export default Appointments;