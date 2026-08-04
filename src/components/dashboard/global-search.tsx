"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const supabase = createClient();
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setPatients([]);
      setDoctors([]);
      setAppointments([]);
      return;
    }

    const [
      patientsResult,
      doctorsResult,
      appointmentsResult,
    ] = await Promise.all([
      supabase
        .from("patients")
        .select("id,name,phone")
        .or(
          `name.ilike.%${value}%,phone.ilike.%${value}%`
        )
        .limit(5),

      supabase
        .from("doctors")
        .select("id,name,specialty")
        .or(
          `name.ilike.%${value}%,specialty.ilike.%${value}%`
        )
        .limit(5),

      supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          patients(name),
          doctors(name)
        `)
        .limit(5),
    ]);

    setPatients(patientsResult.data ?? []);
    setDoctors(doctorsResult.data ?? []);
    setAppointments(appointmentsResult.data ?? []);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setPatients([]);
        setDoctors([]);
        setAppointments([]);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);
  
    return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-md"
    >
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search patients, doctors..."
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-500"
      />

      {(patients.length > 0 ||
        doctors.length > 0 ||
        appointments.length > 0) && (
        <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">

          {/* Patients */}

          {patients.length > 0 && (
            <>
              <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Patients
              </div>

              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    setQuery("");
                    setPatients([]);
                    setDoctors([]);
                    setAppointments([]);

                    router.push(
                      `/patients?id=${patient.id}`
                    );
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <div>
                    <p className="font-medium text-white">
                      {patient.name}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {patient.phone}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-400">
                    Patient
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Doctors */}

          {doctors.length > 0 && (
            <>
              <div className="border-b border-t border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Doctors
              </div>

              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setQuery("");
                    setPatients([]);
                    setDoctors([]);
                    setAppointments([]);

                    router.push(
                      `/doctors?id=${doctor.id}`
                    );
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <div>
                    <p className="font-medium text-white">
                      {doctor.name}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {doctor.specialty}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                    Doctor
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Appointments */}

          {appointments.length > 0 && (
            <>
              <div className="border-b border-t border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Appointments
              </div>

              {appointments.map((appointment) => (
                <button
                  key={appointment.id}
                  onClick={() => {
                    setQuery("");
                    setPatients([]);
                    setDoctors([]);
                    setAppointments([]);

                    router.push(
                      `/appointments?id=${appointment.id}`
                    );
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <div>
                    <p className="font-medium text-white">
                      {appointment.patients?.name}
                    </p>

                    <p className="text-xs text-zinc-400">
                      Dr. {appointment.doctors?.name}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {appointment.appointment_date} •{" "}
                      {appointment.appointment_time}
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-400">
                    Appointment
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}