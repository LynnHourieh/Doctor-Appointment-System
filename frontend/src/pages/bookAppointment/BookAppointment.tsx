import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import "./bookAppointment-styles.scss"
import InputField from '../../components/input-field/InputField';
import { useEffect, useState } from 'react';
import Avatar from '../../components/avatar/Avatar';
import { useSpecialties } from '../../hooks/useSpecialties';
import type { UserInfo } from '../../models/user.types';
import Button from '../../components/button/Button';
const BookAppointment = () => {
    const [searchTerm, setSearchTerm] = useState("");
    //fetch all doctors
    const [doctors, setDoctors] = useState<UserInfo[]>([]);
    const { specialties } = useSpecialties();
   
    const fetchDoctors = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/users/doctors`, { credentials: "include" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setDoctors(data);
           
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };
     useEffect(() => {

        if (searchTerm) {
            const filteredDoctors = doctors.filter(doctor =>
                doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDoctors(filteredDoctors);
        } else {
            fetchDoctors();
        }
    }, [searchTerm]);
    return (
        <div>
             <div className="book-appointment-title">
                <h2 className="book-appointment-title-text">Book An Appointment</h2>
                <div className="book-appointment-line"></div>
            </div>
        <div className="book-appointment-container">
            <div className='book-appointment-section'>
                <InputField placeholder="Search by name" value={searchTerm} onChange={(name, value) => { setSearchTerm(value) }} />
                <div className='book-appointment-doctors-list'>
                    {doctors.filter((doctor: any) => doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map((doctor: any) => (
                        <div key={doctor.id} className='book-appointment-doctor-card'>
                       <Avatar src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
                            <div className='book-appointment-doctor-info'>
                                <h4 className='book-appointment-doctor-name'>{doctor.fullName}</h4>
                                <p className='book-appointment-doctor-specialty'> {specialties.find(s => s.value === String(doctor.doctor.specialtyId))?.text || "-"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='book-appointment-section'>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar />
                </LocalizationProvider>
            </div>
            <div className='book-appointment-section'>
                <p>Notes</p>
                <textarea className='book-appointment-notes' placeholder='Add any notes for the doctor' maxLength={500}></textarea>
            </div>
        </div>
        <Button text='Confirm' onClickHandler={() => {}} id="book-appointment-confirm-button"/>
        </div>
    );
};

export default BookAppointment;

