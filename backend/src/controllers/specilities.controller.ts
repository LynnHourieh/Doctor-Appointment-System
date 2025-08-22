import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await prisma.specialty.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        res.status(200).json(specialties);
    } catch (error) {
        console.error("Error fetching specialties:", error);
        res.status(500).json({ message: "Failed to fetch specialties" });
    }
};

export { getAllSpecialties };