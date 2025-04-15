import React, { useState } from 'react';
import AppointmentDashboard from '../components/AppointmentDashboard';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  return (
    <div>
      <h1>View Appointments</h1>
      <AppointmentDashboard appointments={appointments} setAppointments={setAppointments} />
    </div>
  );
};

export default AppointmentsPage;