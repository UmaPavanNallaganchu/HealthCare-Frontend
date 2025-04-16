import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../CssFiles/viewAppointment.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle, faCheckCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';


const ViewAppointments = ({ patientId, token }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const retrieveData = async () => {
            const apiUrl = `http://localhost:8065/appointments/viewByPatient/${patientId}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("API Response Data:", data); // Log the response data
                setAppointments(data.data || []); // Access the correct property
            } else {
                console.log("Failed to fetch appointments");
            }
        };
        retrieveData();
    }, [patientId, token]);

    const handleCancel = async (id) => {
        const apiUrl = `http://localhost:8065/appointments/cancel/${id}`;
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("Cancelled Successfully", response);
        } else {
            console.log("Unable to Cancel");
        }
    };
    const handleRedirect = () => {
          window.location.href = "/myConsultations";
      };

    return (
        <div className="appointmentdetails">
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className="appointment-card">
                        {appointment.status==="Booked" && <FontAwesomeIcon icon={faCalendarCheck} className="appointment-icon" style={{color:"blue"}}/>}
                        {appointment.status==="Completed" && <FontAwesomeIcon icon={faCheckCircle} className="appointment-icon" style={{color:"green"}}/>}
                        {appointment.status==="Cancelled" && <FontAwesomeIcon icon={faTimesCircle} className="appointment-icon" style={{color:"red"}}/>}
                        <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                        <p><strong>Date:</strong> {appointment.date}</p>
                        <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
                        <p><strong>Status:</strong> {appointment.status}</p>
                        {appointment.status === "Booked" && <button onClick={() => handleCancel(appointment.appointmentId)}>Cancel Appointment</button>}
                        {appointment.status === "Completed" && <button onClick={() => handleRedirect()}>View Consultation</button>}

                    </div>
                ))
            )}
        </div>
    );
};

export default ViewAppointments;
