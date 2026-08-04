"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useState } from "react";

import AppointmentDetailsDialog from "./appointment-details-dialog";
import EditAppointmentDialog from "@/components/appointments/edit-appointment-dialog";

import type {
  Appointment,
  Patient,
  Doctor,
} from "@/types/database";


interface AppointmentCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}


function getEventColor(status: string) {
  switch (status) {
    case "Confirmed":
      return "#10b981";

    case "Scheduled":
      return "#6366f1";

    case "Completed":
      return "#71717a";

    case "Cancelled":
      return "#ef4444";

    default:
      return "#8b5cf6";
  }
}


function getEndDateTime(
  date: string,
  time: string,
  duration: number
) {
  const end = new Date(`${date}T${time}`);

  end.setMinutes(
    end.getMinutes() + duration
  );

  return end.toISOString();
}



export default function AppointmentCalendar({
  appointments,
  patients,
  doctors,
}: AppointmentCalendarProps) {


  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);


  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);



  const events = appointments.map((appointment) => ({

    id: appointment.id,


    title:
      `${appointment.patients?.name ?? "Patient"} • ${appointment.doctors?.name ?? "Doctor"}`,


    start:
      `${appointment.appointment_date}T${appointment.appointment_time}`,


    end:
      getEndDateTime(
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.duration_minutes ?? 30
      ),


    backgroundColor:
      getEventColor(
        appointment.status
      ),

    borderColor:
      getEventColor(
        appointment.status
      ),

    textColor: "#ffffff",


    extendedProps: {
      appointment,
    },

  }));



  return (
    <>

      <div className="calendar-wrapper rounded-3xl">

        <FullCalendar

          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}


          initialView="dayGridMonth"


          height="78vh"


          selectable


          editable={false}


          events={events}


          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right:
              "dayGridMonth,timeGridWeek,timeGridDay",
          }}


          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}


          eventDisplay="block"


          dayMaxEvents={3}


          eventClick={(info) => {

            const appointment =
              info.event.extendedProps
                .appointment as Appointment;


            setSelectedAppointment(
              appointment
            );


            setDetailsOpen(true);

          }}

        />

      </div>



      <AppointmentDetailsDialog

        open={detailsOpen}

        onOpenChange={setDetailsOpen}

        appointment={selectedAppointment}

        onEdit={() => {

          setDetailsOpen(false);

          setEditOpen(true);

        }}

      />



      {selectedAppointment && (

        <EditAppointmentDialog

          open={editOpen}

          onOpenChange={setEditOpen}


          appointment={
            selectedAppointment
          }


          patients={patients}


          doctors={doctors}

        />

      )}


    </>
  );
}