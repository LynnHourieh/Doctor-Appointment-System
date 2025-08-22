import { getStatusByName } from "../services/status.service.js";
import { createUser } from "../services/user.service.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      roleId,
      gender,
      dateOfBirth,
      // doctor/patient additional fields
      specialtyId,
      phone,
      bio,
      license_number,
      education,
      languages,
      clinic_name,
      location,
      address,
      known_conditions,
      allergies,
      blood_type,
      weight_kg,
      height_cm,
    } = req.body;

    if (!fullName || !email || !password || !roleId || !gender || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const statusName = roleId === 1 ? "approved" : "pending";
    const status = await getStatusByName(statusName);
    if (!status) {
      return res.status(500).json({ message: `Status '${statusName}' not found.` });
    }

    const doctorData =
      roleId === 2
        ? {
          specialtyId: Number(specialtyId),
          is_active: true,
          phone: phone || null,
          bio: bio || null,
          license_number: license_number || null,
          education: education || null,
          languages: languages || null,
          clinic_name: clinic_name || null,
          location: location || null,
        }
        : undefined;

    const patientData =
      roleId === 3
        ? {
          phone: phone || null,
          address: address || null,
          known_conditions: known_conditions || null,
          allergies: allergies || null,
          blood_type: blood_type || null,
          weight_kg: weight_kg || null,
          height_cm: height_cm || null,
        }
        : undefined;

    const user = await createUser({
      fullName,
      email,
      password,
      roleId,
      statusId: status.id,
      gender,
      dateOfBirth,
      doctorData,
      patientData,
    });

    const message =
      roleId === 1
        ? "Admin registered successfully."
        : "Registered. Waiting for admin approval.";

    res.status(201).json({ message, user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Destructure to remove password and unnecessary null fields
    const {
      password,
      doctor,
      patient,
      ...baseUser
    } = user;

    // Add role-specific info conditionally
    let responseData: any = { ...baseUser };

    if (user.roleId === 2) {
      responseData.doctor = doctor;
    } else if (user.roleId === 3) {
      responseData.patient = patient;
    }
    res.json(responseData);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      fullName,
      email,
      dateOfBirth,
      gender,
      phone,
      bio,
      license_number,
      education,
      languages,
      clinic_name,
      location,
      specialtyId,
      is_active,
      address,
      known_conditions,
      allergies,
      blood_type,
      weight_kg,
      height_cm,
    } = req.body;

    // Update base user info
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        dateOfBirth,
        gender,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user.roleId === 2) {
      // Doctor role
      await prisma.doctor.upsert({
        where: { id: userId }, // use id instead of userId
        update: {
          phone,
          bio,
          license_number,
          education,
          languages,
          clinic_name,
          location,
          specialtyId,
          is_active,
        },
        create: {
          id: userId, // match User ID
          phone,
          bio,
          license_number,
          education,
          languages,
          clinic_name,
          location,
          specialtyId,
          is_active,
        },
      });
    } else if (user.roleId === 3) {
      // Patient role
      await prisma.patient.upsert({
        where: { id: userId }, // use id instead of userId
        update: {
          phone,
          address,
          known_conditions,
          allergies,
          blood_type,
          weight_kg,
          height_cm,
        },
        create: {
          id: userId, // match User ID
          phone,
          address,
          known_conditions,
          allergies,
          blood_type,
          weight_kg,
          height_cm,
        },
      });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.user.findMany({
      where: {
        roleId: 3, // patient role
        statusId: 2, // only approved patients
      },
      include: {
        patient: true,
        status: true,
        role: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const sanitizedPatients = patients.map(({ password, patient, ...user }) => ({
      ...user,
      patient,
    }));

    res.status(200).json(sanitizedPatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await prisma.user.findUnique({
      where: { id: patientId.toString() },
      include: {
        patient: true,
        status: true,
        role: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { password, ...sanitizedPatient } = patient;

    res.status(200).json(sanitizedPatient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        roleId: 2, // doctor role
        statusId: 2,
      },
      include: {
        doctor: true,
        status: true,
        role: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const sanitizedDoctors = doctors.map(({ password, doctor, ...user }) => ({
      ...user,
      doctor,
    }));

    res.status(200).json(sanitizedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId.toString() },
      include: {
        patient: true,
        status: true,
        role: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { password, ...sanitizedDoctor } = doctor;

    res.status(200).json(sanitizedDoctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
};

//update patient profile as admin
const updateProfile = async (req, res) => {
  try {
    
    const {
      id: userId,
      fullName,
      email,
      dateOfBirth,
      gender,
      phone,
      bio,
      license_number,
      education,
      languages,
      clinic_name,
      location,
      specialtyId,
      is_active,
      address,
      known_conditions,
      allergies,
      blood_type,
      weight_kg,
      height_cm,
    } = req.body;

    // Update base user info
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        dateOfBirth,
        gender,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user.roleId === 2) {
      // Doctor role
      await prisma.doctor.upsert({
        where: { id: userId }, // use id instead of userId
        update: {
          phone,
          bio,
          license_number,
          education,
          languages,
          clinic_name,
          location,
          specialtyId,
          is_active,
        },
        create: {
          id: userId, // match User ID
          phone,
          bio,
          license_number,
          education,
          languages,
          clinic_name,
          location,
          specialtyId,
          is_active,
        },
      });
    } else if (user.roleId === 3) {
      // Patient role
      await prisma.patient.upsert({
        where: { id: userId }, // use id instead of userId
        update: {
          phone,
          address,
          known_conditions,
          allergies,
          blood_type,
          weight_kg,
          height_cm,
        },
        create: {
          id: userId, // match User ID
          phone,
          address,
          known_conditions,
          allergies,
          blood_type,
          weight_kg,
          height_cm,
        },
      });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export { registerUser, getUserProfile, updateUserProfile, getAllPatients, getPatientById, getAllDoctors, getDoctorById, updateProfile };

