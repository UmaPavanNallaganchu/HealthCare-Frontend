import React, { useEffect, useState } from 'react';

const PatientConsultations = ({ token, patientId }) => {
    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        const handleExtractAppointments = async () => {
            try {
                const id = 'p1';
                const apiUrl = `http://localhost:8065/appointments/viewByPatient/${id}`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'Application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    handleFilteringAppointmentIds(data.data);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.log("error ", error);
            }
        };

        handleExtractAppointments();
    }, []);

    const handleFilteringAppointmentIds = (appointments) => {
        const filteredAppointmentIds =[];
        for(let i=0;i<appointments.length;i++){
             if(appointments[i].status === "Completed"){
                filteredAppointmentIds.push(appointments[i].appointmentId);
             }
        }
        HandleGetConsultations(filteredAppointmentIds);
    };

    const getConsultation = async (id) => {
        const apiUrl = `http://localhost:8050/consultation/appointment/${id}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
           
setConsultations((prevConsultations) => {
    // Check if the consultation already exists
    if (!prevConsultations.some(consultation => consultation.consultationId === data.data[0].consultationId)) {
         return [...prevConsultations, data.data[0]];
    }
    return prevConsultations;
        });
        }
    };

    const HandleGetConsultations = (appointmentIds) => {
        appointmentIds.forEach(id => {
            getConsultation(id);
        });
    };

    return (
        <div>
            <h3>Consultation Details</h3>
            {consultations.length > 0 ? (
                <div className='Consultation'>
                    {consultations.map((consultation) => (
                        <div key={consultation.consultationId}>
                            <p><strong>Consultation ID:</strong> {consultation.consultationId}</p>
                            <p><strong>Appointment ID:</strong> {consultation.appointmentId}</p>
                            <p><strong>Notes:</strong> {consultation.notes}</p>
                            <p><strong>Prescription:</strong> {consultation.prescription}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No Consultations yet...!</div>
            )}
        </div>
    );
};

export default PatientConsultations;
