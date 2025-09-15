import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAvailabilitiesById = async (req, res) => {
    const { id } = req.params;
  

    try {
        const availability = await (prisma as any).doctorAvailability.findMany({
            where: {
                doctorId: id,
            },
            include: {
                doctor: { select: { id: true, user: { select: { fullName: true } } } },
            },
        });
        

        return res.status(200).json(availability);
    } catch (error) {
        console.error('Error fetching availability:', error);
        return res.status(500).json({ message: 'Failed to fetch availability' });
    }
};

const updateAvailabilityRecord = async (req, res) => {
  try {

    const { id } = req.params;
    const {  availability } = req.body;

    if (!id) return res.status(400).json({ message: 'doctorId is required' });
    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'availability must be an array' });
    }

    // Remove existing
    await (prisma as any).doctorAvailability.deleteMany({ where: { doctorId: id } });

    // Insert new (skip OFF/empty)
    const createPromises = availability
      .filter(s => s && s.dayOfWeek != null && s.startTime && s.endTime && s.startTime !== 'OFF' && s.endTime !== 'OFF')
      .map(slot =>
        (prisma as any).doctorAvailability.create({
          data: {
            doctorId: id,
            dayOfWeek: Number(slot.dayOfWeek),
            startTime: String(slot.startTime),
            endTime: String(slot.endTime),
          },
        }),
      );

    await Promise.all(createPromises); // createPromises is always an array here
    return res.status(200).json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    return res.status(500).json({ message: 'Failed to update availability' });
  }
};


export { getAvailabilitiesById, updateAvailabilityRecord };