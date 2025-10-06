import "./dashboard-styles.scss"
import { calendarIcon, DoctorIcon, profileIcon } from '../../assets/images/icons';
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from '@mui/x-charts/BarChart';
import { useAdmin } from "../../contexts/adminContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { pendingUsers, loading, error, fetchPendingUsers, setLoading, setPendingUsers } = useAdmin();
  const [appointments, setAppointments] = useState([]);
  const xLabels = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ];
  const fetchAppointments = async () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    try {
      const response = await fetch(`${baseUrl}/appointments`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      
      setAppointments(data);

    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
    fetchPendingUsers();
    fetchAppointments();
  }, [])

  const pendingDoctors = pendingUsers.filter((u) => u.role === "DOCTOR").length;
  const pendingPatients = pendingUsers.filter((u) => u.role === "PATIENT").length;
  const allAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a: any) => a.status === 'PENDING').length;
  const rejectedAppointments = appointments.filter((a: any) => a.status === 'REJECTED').length;
  const confirmedAppointments = appointments.filter((a: any) => a.status === 'CONFIRMED').length;

  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);


const weekDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + i);
  return d;
});

// --- Count confirmed appointments ---
const pData = weekDays.map((day) => {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);

  return appointments.filter((a: any) => {
    if (a.status !== "CONFIRMED") return false;
    const date = new Date(a.createdAt || a.appointmentDate);
    return date >= start && date <= end;
  }).length;
});

today.setHours(0, 0, 0, 0);

const todayAppointments = appointments.filter((a: any) => {
  const apptDate = new Date(a.appointmentDate);
  apptDate.setHours(0, 0, 0, 0);
  return apptDate.getTime() === today.getTime() && a.status === "CONFIRMED";
});

todayAppointments.sort((a: any, b: any) => {
  // "10:00" → 10, "14:30" → 14.5
  const [ah, am] = a.appointmentTime.split(":").map(Number);
  const [bh, bm] = b.appointmentTime.split(":").map(Number);
  return ah * 60 + am - (bh * 60 + bm);
});

const topThreeAppointments = todayAppointments.slice(0, 3);
const statement = topThreeAppointments.map((appt: any, i: number) => {
  const doctorName = appt.doctor?.user?.fullName || "Unknown Doctor";
  const patientName = appt.patient?.user?.fullName || "Unknown Patient";
  const time = appt.appointmentTime;
  return `${i + 1}. ${time} — ${doctorName} with ${patientName}`;
}).join("\n");


  return (

    <div className='dashboard-container'>
      <div className="dashboard-title">
        <h2 className="dashboard-title-text">Dashboard</h2>
        <div className="dashboard-line"></div>
      </div>
      <div className='dashboard-section-one'>
        <div className='dashboard-cards-container'>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{profileIcon} Pending Patients</h3>
            <p className='dashboard-card-value'>{pendingPatients}</p>
          </div>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{DoctorIcon} Pending Doctors</h3>
            <p className='dashboard-card-value'>{pendingDoctors}</p>
          </div>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{calendarIcon} Today's Appointments</h3>
            <p className='dashboard-card-value'>{allAppointments}</p>
          </div>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{profileIcon} Total Patients</h3>
            <p className='dashboard-card-value'>150</p>
          </div>

        </div>
      </div>
      <div className='dashboard-section-two'>
        <div className='dashboard-appointments'>
          <h3>Today's Appointments</h3>
          {topThreeAppointments.length === 0 ? (
            <p>No appointments scheduled for today.</p>
          ) : (
            <ul>
              {topThreeAppointments.map((appt: any, index: number) => (
                <li key={index}>
                  <strong>{appt.appointmentTime}</strong> - {appt.doctor?.user?.fullName || "Unknown Doctor"} with {appt.patient?.user?.fullName || "Unknown Patient"}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
      <div className="dashboard-charts">
        <div className="dashboard-chart-item">
          <h3>Appointments by status</h3>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: pendingAppointments, label: "Pending" },
                  { id: 1, value: confirmedAppointments, label: "Confirmed" },
                  { id: 2, value: rejectedAppointments, label: "Rejected" },
                ],
              },
            ]}
            width={200}
            height={200}
          /></div>
        <div className="dashboard-chart-item">
          <h3>This Week</h3>
          <BarChart
            height={200}
            series={[
              { data: pData, label: 'pv', id: 'pvId' },

            ]}
            xAxis={[{ data: xLabels }]}
            yAxis={[{ width: 50 }]}
          />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;


