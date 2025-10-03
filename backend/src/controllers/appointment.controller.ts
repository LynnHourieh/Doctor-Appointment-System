import { AppointmentStatus, PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";
const prisma = new PrismaClient();

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { appointmentDate: 'desc' },
            include: {
                doctor: { select: { id: true, user: { select: { fullName: true } } } },
                patient: { select: { id: true, user: { select: { fullName: true } } } },
            },
        });

        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};

// GET /appointments/user/:id
const getAppointmentsById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                OR: [{ doctorId: id }, { patientId: id }],
            },
            orderBy: { appointmentDate: 'desc' },
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                appointmentDate: true,
                appointmentTime: true,
                status: true,
                reason: true,
                doctor: { select: { id: true, user: { select: { fullName: true } } } },
                patient: { select: { id: true, user: { select: { fullName: true } } } },
            },
        });
        return res.json(appointments);
    } catch (e) {
        console.error('Error fetching appointments for user:', e);
        return res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};


const addAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
            reason,
        } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({ message: 'doctorId and patientId are required' });
        }

        const dateStr = (appointmentDate)?.trim();
        const timeStr = (appointmentTime)?.trim();

        if (!dateStr || !timeStr) {
            return res.status(400).json({ message: 'date (YYYY-MM-DD) and time ("9:00 AM" or "HH:mm") are required' });
        }



        const apptDate = new Date(`${dateStr}T00:00:00Z`);
        if (isNaN(apptDate.getTime())) {
            return res.status(400).json({ message: 'date must be YYYY-MM-DD' });
        }

        const appt = await prisma.appointment.create({
            data: {
                doctorId,
                patientId,
                appointmentDate: apptDate,
                appointmentTime: timeStr,
                status: AppointmentStatus.PENDING,
                reason: reason ?? null,
            },
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                appointmentDate: true,
                appointmentTime: true,
                status: true,
                reason: true,
                doctor: { select: { id: true, user: { select: { fullName: true } } } },
                patient: { select: { id: true, user: { select: { fullName: true } } } },
            },
        });

        return res.status(201).json(appt);
    } catch (error: any) {
        // Unique: same doctor, same date+time
        if (error?.code === 'P2002') {
            return res.status(409).json({ message: 'This time slot is already booked for this doctor.' });
        }
        // FK violations
        if (error?.code === 'P2003') {
            return res.status(400).json({ message: 'Invalid doctorId or patientId' });
        }
        console.error('Error creating appointment:', error);
        return res.status(500).json({ message: 'Failed to create appointment' });
    }
};
const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "CONFIRMED" or "REJECTED"

    if (!["CONFIRMED", "REJECTED"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
    }

    const newStatus = action === "CONFIRMED" ? AppointmentStatus.CONFIRMED : AppointmentStatus.REJECTED;

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id: id },
            data: { status: newStatus },
            select: {
                id: true,
                status: true,
                patient: {
                    select: {
                        user: {
                            select: { email: true, fullName: true }
                        }
                    }
                },
            },
        });

        const patientEmail = updatedAppointment.patient?.user?.email;
        const patientName = updatedAppointment.patient?.user?.fullName;

        const subject =
            action === "CONFIRMED"
                ? "✅ Your Appointment Has Been Confirmed"
                : "❌ Your Appointment Has Been Rejected";

        const html =
            action === "CONFIRMED"
                ? `<p>Dear ${patientName},</p>
                   <p>Your appointment has been <strong>confirmed</strong>. Please check your dashboard for details.</p>`
                : `<p>Dear ${patientName},</p>
                   <p>We regret to inform you that your appointment has been <strong>rejected</strong>.</p>
                   <p>You can reschedule another appointment, please contact support.</p>`;

        if (patientEmail) {
            await sendEmail(patientEmail, subject, html);
        }

        return res.json({
            message: `Appointment ${action}ED successfully.`,
            id: updatedAppointment.id,
            status: updatedAppointment.status,
        });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ message: 'Failed to update appointment status' });
    }
};

const updatedAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

        if (!doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const dateStr = (appointmentDate)?.trim();
        const timeStr = (appointmentTime)?.trim();

        if (!dateStr || !timeStr) {
            return res.status(400).json({ message: 'date (YYYY-MM-DD) and time ("9:00 AM" or "HH:mm") are required' });
        }



        const apptDate = new Date(`${dateStr}T00:00:00Z`);
        if (isNaN(apptDate.getTime())) {
            return res.status(400).json({ message: 'date must be YYYY-MM-DD' });
        }
        const updated = await prisma.appointment.update({
            where: { id },
            data: {
                doctorId,
                appointmentDate: apptDate,
                appointmentTime: timeStr,
                reason,
                patientId: existing.patientId,
                status: "PENDING",
            },
        });

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updated,
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { getAllAppointments, getAppointmentsById, addAppointment, updateAppointmentStatus, updatedAppointment };