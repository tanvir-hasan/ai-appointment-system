export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Patient {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;

  patient_id: string;
  doctor_id: string;

  appointment_date: string;
  appointment_time: string;

  duration_minutes: number;

  status: AppointmentStatus;

  notes?: string | null;

  patients: Patient | null;
  doctors: Doctor | null;
}