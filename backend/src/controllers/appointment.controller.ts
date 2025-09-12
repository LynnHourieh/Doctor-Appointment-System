import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({

            orderBy: { appointmentDate: 'asc' },


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

const getAppointmentsById = async (req, res) => {
    const { id } = req.params;

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                OR: [{ doctorId: id }, { patientId: id }],
            },
            orderBy: {
                appointmentDate: "asc",
            },

            select: {
                id: true,
                doctorId: true,
                patientId: true,
                appointmentDate: true,
                status: true,
                reason: true,
                doctor: { select: { id: true, user: { select: { fullName: true } } } },
                patient: { select: { id: true, user: { select: { fullName: true } } } },
            },
        });

        return res.json(appointments);
    } catch (e) {
        console.error("Error fetching appointments by id:", e);
        return res.status(500).json({ message: "Failed to fetch appointments" });
    }
};


const addAppointment = async (req, res) => {
    const { doctorId, patientId, appointmentDate,appointmentTime, reason } = req.body;

    try {
        const newAppointment = await prisma.appointment.create({
            data: {
                doctor: { connect: { id: doctorId } },
                patient: { connect: { id: patientId } },
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                reason: reason
            },
        });

        return res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ message: 'Failed to create appointment' });
    }
};

export { getAllAppointments, getAppointmentsById, addAppointment };