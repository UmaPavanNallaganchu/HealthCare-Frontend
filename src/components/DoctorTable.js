import React, { useState, useEffect } from 'react';
import "../CssFiles/DoctorTable.css";
const DoctorTable = ({token,patientId,patientName}) => {
  const [displayDoctors, setDisplayDoctors] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [specialization, setSpecialization] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/availability/doctors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success && data.data) {
          console.log(data.data);
          filterFutureAppointments(data.data);
          setFetchError(null);
        } else {
          setFetchError('Failed to fetch doctor data. Please try again later.');
        }
      } catch (error) {
        setFetchError('Failed to connect to the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  const filterFutureAppointments = (data) => {
    const currentDate = new Date();
    const filteredData = data.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        const [startHour, endHour] = appointment.timeSlots.split('_TO_').map(time => {
            switch (time) {
                case 'FOUR': return 4;
                case 'SIX': return 6;
                case 'TWO': return 2;
                case 'NINE': return 9;
                case 'ELEVEN': return 11;
                case 'ONE': return 1;
                default: return parseInt(time);
            }
        });

        // Check if the appointment date is in the future or if it's today and the time slot is in the future
        return appointmentDate > currentDate || 
               (appointmentDate.toDateString() === currentDate.toDateString() && currentDate.getHours() < endHour);
    });
    setDisplayDoctors(filteredData);
};




  const filteredDoctors = displayDoctors.filter(doctor =>
    (specialization ? doctor.specialization === specialization : true) &&
    (date ? doctor.date === date : true) &&
    (search ? doctor.doctorName.toLowerCase().includes(search.toLowerCase()) : true) &&
    (timeSlot ? doctor.timeSlots === timeSlot : true)
  );

  const handleBook = async (doctor) => {
    try {
        const patientdetails ={
            patientId:patientId,
            patientName:patientName,
            doctorName:doctor.doctorName
        }
      const response = await fetch(`http://localhost:8065/appointments/create/${doctor.availabilityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify(patientdetails)
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const data = await response.json();

      setDisplayDoctors(prevDoctors => prevDoctors.filter(d => d.doctorId !== doctor.doctorId));

      alert('Appointment booked successfully!');
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className='doctortable'>
      <div className="filter-container">
        <label>Specialization:</label>
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All</option>
          <option value="General">General</option>
          <option value="Neurology">Neurology</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Gynaecology">Gynaecology</option>
          <option value="Orthodontics">Orthodontics</option>
          <option value="Pulmonology">Pulmonology</option>
          <option value="Nephrology">Nephrology</option>
          <option value="Oncology">Oncology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Psychology">Psychology</option>
        </select>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className='filter-container'>
      <label>Search:</label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='search doctor name' />
        <label>Time Slot:</label>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          <option value="">All</option>
          <option value="NINE_TO_ELEVEN">9:00 - 11:00</option>
          <option value="ELEVEN_TO_ONE">11:00 - 1:00</option>
          <option value="TWO_TO_FOUR">2:00 - 4:00</option>
          <option value="FOUR_TO_SIX">4:00 - 6:00</option>
        </select>
      </div>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      {filteredDoctors.length === 0 ? (
        <p className="no-doctors">No doctors available for the selected criteria.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.doctorName}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.date}</td>
                <td>{doctor.timeSlots}</td>
                <td>
                  <button onClick={() => handleBook(doctor)}>Book</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorTable;
