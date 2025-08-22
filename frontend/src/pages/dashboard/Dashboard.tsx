import "./dashboard-styles.scss"
import { calendarIcon, DoctorIcon, profileIcon } from '../../assets/images/icons';
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ];
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
            <p className='dashboard-card-value'>150</p>
          </div>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{DoctorIcon} Pending Doctors</h3>
            <p className='dashboard-card-value'>50</p>
          </div>
          <div className='dashboard-card'>

            <h3 className='dashboard-card-title'>{calendarIcon} Today's Appointments</h3>
            <p className='dashboard-card-value'>150</p>
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
          <ul><li>Appointment 1</li><li>Appointment 2</li><li>Appointment 3</li></ul>
        </div>

      </div>
      <div className="dashboard-charts">
        <div className="dashboard-chart-item">
          <h3>Appointments by status</h3>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={200}
            height={200}
          /></div>
        <div className="dashboard-chart-item">
          <h3>This Week</h3>
          <BarChart
            height={300}
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


