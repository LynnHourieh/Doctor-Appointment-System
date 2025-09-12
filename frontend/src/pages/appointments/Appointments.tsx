import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import InputField from "../../components/input-field/InputField";
import "./appointments-styles.scss"

const Appointments = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [appointments, setAppointments] = useState<Array<{
        id: number;
        date: string;
        time: string;
        patient: {
            user: any;
            id: number;
            fullName: string;
        };
        doctor: {
            id: number;
            user: any;
            fullName: string;
        };

        status: string;
    }>>([]);
    const userId = localStorage.getItem("userId");

    const fetchAppointments = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/appointments/${userId}`, { credentials: "include" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    useEffect(() => { fetchAppointments() }, [])
    console.log(appointments);

    return (<div className="appointments-container">
        <div className="appointments-title">
            <h2 className="appointments-title-text">My Appointments</h2>
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
                    <th>Doctor Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {appointments?.map((appt) => (
                    <tr key={appt.id} >
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>{appt.patient.user.fullName}</td>
                        <td>{appt.doctor.user.fullName}</td>
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