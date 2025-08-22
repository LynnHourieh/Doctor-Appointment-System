import { useState } from "react";
import Button from "../../components/button/Button";
import Select from "../../components/select/Select";
import "./settings-style.scss";

const Settings = () => {
  //call api to post the availability for this doctor (id) 
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeOptions = [
    { text: 'OFF', value: 'OFF' },
    { text: '08:00 AM', value: '08:00' },
    { text: '09:00 AM', value: '09:00' },
    { text: '10:00 AM', value: '10:00' },
    { text: '11:00 AM', value: '11:00' },
    { text: '12:00 PM', value: '12:00' },
    { text: '01:00 PM', value: '13:00' },
    { text: '02:00 PM', value: '14:00' },
    { text: '03:00 PM', value: '15:00' },
    { text: '04:00 PM', value: '16:00' },
    { text: '05:00 PM', value: '17:00' },
    { text: '06:00 PM', value: '18:00' }
  ];
  type Availability = {
    [key: string]: { startTime: string; endTime: string };
  };

  const [availability, setAvailability] = useState<Availability>(
    daysOfWeek.reduce<Availability>((acc, day) => {
      acc[day] = { startTime: 'OFF', endTime: 'OFF' };
      return acc;
    }, {})
  );
  console.log(availability);
   const handleChange = (day:string, type:string, value:string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };
  return (
    <div className="settings-container">
      <div className="settings-title">
        <h2 className="settings-title-text">Availability Settings</h2>
        <div className="settings-line"></div>
      </div>
      <p>Set your weekly working hours</p>
      <div className="settings-card">
        {daysOfWeek.map((day) => (
          <div key={day} className="settings-time-slot">
            <span>{day}</span>
            <Select name="startTime" defaultValue="OFF" onChange={(name,value: string) => handleChange(day, name, value)} options={timeOptions} value={availability[day].startTime} />
            <Select name="endTime" defaultValue="OFF" onChange={(name,value: string) => handleChange(day, name, value)} options={timeOptions} value={availability[day].endTime} />
          </div>
        ))}
      </div>
      <Button text="Save Changes" onClickHandler={() => { }} id="settings-save-button" />
    </div>
  );
};


export default Settings;
