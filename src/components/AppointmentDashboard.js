// AppointmentDashboard.js
import React from 'react';
//import '../CssFiles/AppointmentDashboard.css';

const AppointmentDashboard = ({ appointments, setAppointments, handleUpdate, toggleDashboard, togglePrescriptionDashboard }) => {
  const handleCancel = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Cancelled' } : app));
  };

  return (
    <div className="dashboard">
      <button className="close-button" onClick={toggleDashboard}>Close</button>
      {appointments.length === 0 ? (
        <p className="no-appointments">No appointments to view</p>
      ) : (
        <div className="appointments-list">
          {appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(app => (
            <div key={app.id} className={app.status === 'Cancelled' ? 'appointment cancelled' : 'appointment'}>
              <h3>{app.doctor}</h3>
              <p>Date: {app.date}</p>
              <p>Time: {app.timeSlot}</p>
              <p>Status: {app.status}</p>
              {app.status !== 'Cancelled' && (
                <>
                  <button className="update-button" onClick={() => handleUpdate(app)}>Update</button>
                 
                </>
              )}
              <button onClick={() => handleCancel(app.id)}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;