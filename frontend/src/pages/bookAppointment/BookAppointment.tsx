import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import "./bookAppointment-styles.scss"
import InputField from '../../components/input-field/InputField';
import { useState } from 'react';
const BookAppointment = () => {
    const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="book-appointment-container">
        <div className='book-appointment-section'>
  <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />
  <div>Doctor List</div>
        </div>
      <div className='book-appointment-section'>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </div>
      <div className='book-appointment-section'>
        Add notes
      </div>
    </div>
  );
};

export default BookAppointment;

