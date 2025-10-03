import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import "./bookAppointment-styles.scss"
import InputField from '../../components/input-field/InputField';
import { useEffect, useState } from 'react';
import type { Dayjs } from 'dayjs';
import Avatar from '../../components/avatar/Avatar';
import { useSpecialties } from '../../hooks/useSpecialties';
import type { UserInfo } from '../../models/user.types';
import Button from '../../components/button/Button';
import TimeSlotChip from '../../components/timeslotchip/TimeSlotChip';
import { toAMPM, toHHmm, toMin } from '../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const query = new URLSearchParams(useLocation().search);
    const queryAppointmentId = query.get("appointmentId");
    const isRescheduled = Boolean(queryAppointmentId);
    console.log({ queryAppointmentId });
    const [searchTerm, setSearchTerm] = useState("");
    //fetch all doctors
    const [doctors, setDoctors] = useState<UserInfo[]>([]);
    const [notes, setNotes] = useState("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const { specialties } = useSpecialties();
    const currentUserId = localStorage.getItem("userId");
    const [doctorAvailability, setDoctorAvailability] = useState<any[]>([]);
    const [timeSlots, setTimeSlots] = useState<{ value: string; label: string }[]>([]);
    const STEP_MIN = 15;
    const isDoctor = localStorage.getItem("userRole") === "DOCTOR";
    const userId = localStorage.getItem("userId");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    console.log(isRescheduled)
    const handleSaveAppointment = () => {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const appointmentData = {
            doctorId: selectedDoctorId,
            patientId: currentUserId,
            appointmentDate: selectedDate ? selectedDate.toISOString().slice(0, 10) : undefined,
            appointmentTime: selectedTimeSlot,
            reason: notes
        };
        fetch(`${baseUrl}/appointments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData),
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                return response.json();
            })
            .then(data => {
                setIsLoading(false);
                navigate('/my-appointments');
            })
            .catch(error => {
                setIsLoading(false);
                console.error("Error creating appointment:", error);
            });
    }

    const handleUpdateAppointment = () => {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const appointmentData = {
            doctorId: selectedDoctorId,
            appointmentDate: selectedDate ? selectedDate.toISOString().slice(0, 10) : undefined,
            appointmentTime: selectedTimeSlot,
            reason: notes
        };
        fetch(`${baseUrl}/appointments/${queryAppointmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData),
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setIsLoading(false);
                navigate('/my-appointments');
            })
            .catch(error => {
                setIsLoading(false);
                console.error("Error updating appointment:", error);
            });
    }


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

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_BASE_URL;

        if (!selectedDoctorId) { setDoctorAvailability([]); return; }
        fetch(`${baseUrl}/availability/${selectedDoctorId}`, { credentials: 'include' })
            .then(r => r.json())
            .then(setDoctorAvailability)
            .catch(console.error);
    }, [selectedDoctorId]);

    useEffect(() => {
        if (!selectedDate) return;

        const dow = selectedDate.day(); // 0=Sun .. 6=Sat (matches your data: 6 → Saturday)
        const windows = doctorAvailability.filter(w => w.dayOfWeek === dow);

        // expand windows into "HH:mm" slots
        let slots: string[] = [];
        for (const w of windows) {
            for (let t = toMin(w.startTime); t < toMin(w.endTime); t += STEP_MIN) {
                slots.push(toHHmm(t));
            }
        }

        // remove duplicates & sort
        slots = Array.from(new Set(slots)).sort();

        // (optional) hide past times if today
        const todayISO = new Date().toISOString().slice(0, 10);
        const selectedISO = selectedDate.toISOString().slice(0, 10);
        if (todayISO === selectedISO) {
            const now = new Date();
            const nowHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            slots = slots.filter(s => s > nowHHmm);
        }

        setTimeSlots(slots.map(v => ({ value: v, label: toAMPM(v) })));
    }, [doctorAvailability, selectedDate]);


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
                        {isDoctor
                            ? doctors
                                .filter((doctor: any) => String(doctor.id) === String(userId))
                                .map((doctor: any) => {
                                    const selected = selectedDoctorId === doctor.id;
                                    return (
                                        <div key={doctor.id} className={`book-appointment-doctor-card ${selected ? "is-selected" : ""}`} onClick={() => setSelectedDoctorId(doctor.id)}>
                                            <Avatar src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
                                            <div className='book-appointment-doctor-info'>
                                                <h4 className='book-appointment-doctor-name'>{doctor.fullName}</h4>
                                                <p className='book-appointment-doctor-specialty'> {specialties.find(s => s.value === String(doctor.doctor.specialtyId))?.text || "-"}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            : doctors
                                .filter((doctor: any) => doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((doctor: any) => {
                                    const selected = selectedDoctorId === doctor.id;
                                    return (
                                        <div key={doctor.id} className={`book-appointment-doctor-card ${selected ? "is-selected" : ""}`} onClick={() => setSelectedDoctorId(doctor.id)}>
                                            <Avatar src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
                                            <div className='book-appointment-doctor-info'>
                                                <h4 className='book-appointment-doctor-name'>{doctor.fullName}</h4>
                                                <p className='book-appointment-doctor-specialty'> {specialties.find(s => s.value === String(doctor.doctor.specialtyId))?.text || "-"}</p>
                                            </div>
                                        </div>
                                    );
                                })
                        }
                    </div>
                </div>
                <div className='book-appointment-section'>
                    {selectedDoctorId ? <div className='book-appointment-choose-date'>Choose Date and Time:</div> : <div className='book-appointment-choose-date'>Select Doctor First</div>}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            disablePast
                            disabled={!selectedDoctorId}

                        />
                    </LocalizationProvider>
                    <div className='book-appointment-time-slots'>
                        {timeSlots.length === 0 && <div className="no-slots">No slots for this day</div>}
                        {timeSlots.map(s => (
                            <TimeSlotChip
                                key={s.value}
                                label={s.label}                      // "08:30 AM"
                                selected={s.value === selectedTimeSlot}
                                onClick={() => setSelectedTimeSlot(s.value)} // store "HH:mm"
                            />
                        ))}
                    </div>

                </div>

                <div className='book-appointment-section'>
                    <p>Notes</p>
                    <textarea className='book-appointment-notes' placeholder='Add any notes for the doctor' maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)}    ></textarea>
                </div>
            </div>
            <Button text={isRescheduled ? `Update` : `Schedule`} onClickHandler={isRescheduled ? handleUpdateAppointment : handleSaveAppointment} id="book-appointment-confirm-button" disabled={!selectedTimeSlot || !selectedDoctorId || !selectedDate} isLoading={isLoading} />
        </div>
    );
};

export default BookAppointment;

