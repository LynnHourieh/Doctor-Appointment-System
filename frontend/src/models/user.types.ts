export interface BaseUser {
    id: number | string;
    fullName: string;
    email: string;
    password?: string;
    roleId: number;
    statusId?: number;
    created_at?: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
}

export interface DoctorInfo extends BaseUser {
    role: 'doctor'; // discriminator
    bio: string;
    phone: string;
    license_number: string;
    experience_years: number;
    education: string;
    languages: string;
    photo_url: string;
    clinic_name: string;
    location: string;
    is_active: boolean;
    specialtyId: number;
    profileUrl?: string;
}

export interface PatientInfo extends BaseUser {
    role: 'patient'; // discriminator
    phone: string;
    address: string;
    known_conditions: string[];
    allergies: string[];
    blood_type: string;
    weight_kg: number;
    height_cm: number;
    profileUrl?: string;
}

export interface AdminProps extends BaseUser {
    role: 'admin';
}

export type UserInfo = DoctorInfo | PatientInfo | AdminProps;

export interface GetProfileResponse extends BaseUser {
    doctor?: Partial<DoctorInfo>;
    patient?: Partial<PatientInfo>;
}
