import React, { useState, useEffect } from 'react';
import '../CssFiles/DoctorTable.css';

const DoctorTable = ({ appointments, setAppointments, handleBookUpdate, updatingAppointment, token }) => {
  const [displayDoctors, setDisplayDoctors] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [specialization, setSpecialization] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log('DoctorTable: Fetching doctor data...');
      try {
        const response = await fetch('http://localhost:8000/availability/doctors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('DoctorTable: Network response was not ok', response);
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('DoctorTable: API response data', data);

        if (data.success && data.data) {
          setDisplayDoctors(data.data);
          setFetchError(null);
          console.log('DoctorTable: All doctors set', data.data);
        } else {
          console.error('DoctorTable: Failed to fetch doctors:', data.message);
          setFetchError('Failed to fetch doctor data. Please try again later.');
        }
      } catch (error) {
        console.error('DoctorTable: Error fetching doctors:', error);
        setFetchError('Failed to connect to the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = displayDoctors.filter(doctor =>
    (specialization ? doctor.specialization === specialization : true) &&
    (date ? doctor.date === date : true) &&
    (search ? doctor.doctorName.toLowerCase().includes(search.toLowerCase()) : true) &&
    (timeSlot ? doctor.timeSlots === timeSlot : true)
  );

  const handleBook = async (doctor) => {
    console.log('DoctorTable: Booking doctor', doctor);

    try {
      const response = await fetch(`http://localhost:8065/appointments/create/${doctor.availabilityId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('DoctorTable: Failed to create appointment:', response);
        throw new Error('Failed to create appointment');
      }

      const data = await response.json();
      console.log('DoctorTable: Appointment created:', data);

      setAppointments(prev => {
        const newAppointments = [...prev, { id: Date.now(), doctor: doctor.doctorName, date: doctor.date, timeSlot: doctor.timeSlots, status: 'Booked', prescription: 'Sample prescription' }];
        return newAppointments;
      });

      setDisplayDoctors(prevDoctors => prevDoctors.filter(d => d.doctorId !== doctor.doctorId));

      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('DoctorTable: Error creating appointment:', error);
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
          <option value="Orthology">Orthology</option>
        </select>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label>Search:</label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  {updatingAppointment ? (
                    <button className="update-button" onClick={() => handleBookUpdate(doctor)}>Update</button>
                  ) : (
                    <button onClick={() => handleBook(doctor)}>Book</button>
                  )}
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
