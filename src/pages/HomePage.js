import React, { useState, useEffect } from 'react';
import DoctorTable from '../components/DoctorTable';
import AppointmentDashboard from '../components/AppointmentDashboard';
import '../CssFiles/HomePage.css';

const HomePage = ({patientId,token}) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [updatingAppointment, setUpdatingAppointment] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const toggleDashboard = () => {
    console.log('HomePage: Toggling dashboard');
    setShowDashboard(!showDashboard);
  };

  const handleUpdate = (appointment) => {
    console.log('HomePage: Updating appointment', appointment);
    setUpdatingAppointment(appointment);
    setShowDashboard(false);
  };

  const handleBookUpdate = async (doctor) => {
    console.log('HomePage: handleBookUpdate', doctor);
    if (updatingAppointment) {
      try {
        const response = await fetch(
          `http://localhost:8065/appointments/update/${updatingAppointment.id}/${doctor.availabilityId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update appointment');
        }

        const data = await response.json();
        console.log('HomePage: Appointment updated:', data);

        // Update the appointment in the local state
        setAppointments(appointments.map(app =>
          app.id === updatingAppointment.id
            ? { ...app, doctor: doctor.doctorName, date: doctor.date, timeSlot: doctor.timeSlots, status: 'Booked' }
            : app
        ));

        setUpdatingAppointment(null);
        setShowDashboard(true);
        alert('Appointment updated successfully!');
      } catch (error) {
        console.error('HomePage: Error updating appointment:', error);
        alert('Failed to update appointment. Please try again.');
      }
    }
  };

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    console.log('HomePage: Fetching appointments...');
    try {
      const response = await fetch('http://localhost:8065/appointments/view', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      console.log('HomePage: Appointments fetched:', data);

      if (data.success && data.data) {
        setAppointments(data.data);
        setFetchError(null);
      } else {
        console.error('HomePage: Failed to fetch appointments:', data.message);
        setFetchError('Failed to fetch appointments. Please try again later.');
      }
    } catch (error) {
      console.error('HomePage: Error fetching appointments:', error);
      setFetchError('Failed to connect to the server. Please check your network connection.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    console.log('HomePage: Cancelling appointment:', appointmentId);
    try {
      const response = await fetch(`http://localhost:8065/appointments/cancel/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      console.log('HomePage: Appointment cancelled successfully');
      // Update the appointment status in the local state instead of filtering it out
      setAppointments(appointments.map(app =>
        app.appointmentId === appointmentId ? { ...app, status: 'Cancelled' } : app
      ));
      // Optionally, you can refresh the appointments list after cancellation
      // fetchAppointments();

    } catch (error) {
      console.error('HomePage: Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  return (
    <div className="homepage-container">

      <button className="view-appointments-button" onClick={toggleDashboard}>View Appointments</button>
      {updatingAppointment && <h2 className="update-title">Updating Appointment for {updatingAppointment.doctor}</h2>}
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      <DoctorTable
        appointments={appointments}
        setAppointments={setAppointments}
        handleBookUpdate={handleBookUpdate}
        updatingAppointment={updatingAppointment}
        token={token}
      />

      {showDashboard && (
        <div className="modal-backdrop" onClick={toggleDashboard}>
          <AppointmentDashboard
            appointments={appointments}
            setAppointments={setAppointments}
            handleUpdate={handleUpdate}
            toggleDashboard={toggleDashboard}
            handleCancelAppointment={handleCancelAppointment} // Pass cancel handler
            token={token}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;