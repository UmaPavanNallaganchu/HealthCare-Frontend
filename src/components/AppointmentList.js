import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa"; // Import filter icon
import ConsultationForm from "./ConsultationForm";
import UpdateConsultationForm from "./UpdateConsultation";
import "../CssFiles/generalCss.css";
 
const AppointmentList = ({doctorId,token}) => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [consultationStatus, setConsultationStatus] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false); // Date Picker
    const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
    const [sortBy, setSortBy] = useState(null);

    const TimeslotsMapping = {
        NINE_TO_ELEVEN: "9:00 am - 11:00 am",
        ELEVEN_TO_ONE: "11:00 am - 1:00 pm",
        TWO_TO_FOUR: "2:00 pm - 4:00 pm",
        FOUR_TO_SIX: "4:00 pm - 6:00 pm",
    };
 
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`http://localhost:8065/appointments/viewByDoctor/${doctorId}`,{
                method:'GET',
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }});
            const data = await response.json();
            console.log("Fetched Appointments:", data);
            setAppointments(data.data || []);
            setFilteredAppointments(data.data || []);
            checkConsultationStatus(data.data || []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments([]);
            setFilteredAppointments([]);
            setConsultationStatus({});
        }
    };
 
    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        // Sort the filtered appointments whenever the sort criteria change
        if (sortBy === 'date') {
            const sorted = [...filteredAppointments].sort((a, b) => {
                // Compare parsedDate for correct date comparison
                const dateA = a.parsedDate;
                const dateB = b.parsedDate;
 
                if (sortDirection === 'asc') {
                    return dateA.getTime() - dateB.getTime(); // Ascending (oldest first)
                } else {
                    return dateB.getTime() - dateA.getTime(); // Descending (latest first)
                }
            });
            setFilteredAppointments(sorted);
        }
        // You can add more sorting logic for other columns if needed
    }, [filteredAppointments, sortBy, sortDirection]);
 
    const checkConsultationStatus = async (appointments) => {
        let statusMap = {};
        for (const appointment of appointments) {
            statusMap[appointment.appointmentId] = await fetchConsultationStatus(
                appointment.appointmentId
            );
        }
        setConsultationStatus(statusMap);
    };
 
    const fetchConsultationStatus = async (appointmentId) => {
        try {
            const response = await fetch(
                `http://localhost:8050/consultation/appointment/${appointmentId}`,{
                    method:'GET',
                    headers:{
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }}
            );
            const data = await response.json();
            return data.success && data.data.length > 0;
        } catch (error) {
            console.error("Error checking consultation status:", error);
            return false;
        }
    };
 
    const handleOpenModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setIsUpdate(consultationStatus[appointmentId]);
        setIsModalOpen(true);
    };
 
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
 
        if (event.target.value) {
            const filtered = appointments.filter(
                (app) => app.date === event.target.value
            );
            setFilteredAppointments(filtered.length > 0 ? filtered.map(app => ({ ...app, parsedDate: new Date(app.date) })) : []);
        } else {
            setFilteredAppointments(appointments);
        }
        // Reset sorting when filtering by date
        setSortBy(null);
    };
 
 
    const fetchMedicalHistory = async (patientId) => {
        try {
            const response = await fetch(
                `http://localhost:8050/history/patient/${patientId}`,{
                    method:'GET',
                    headers:{
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }}
            );
            const data = await response.json();
            const historyRecords = data.data || [];
 
            setSelectedPatientId(patientId);
 
            if (historyRecords.length === 0) {
                alert(
                    `Patient ID ${patientId} has not created their medical history yet.`
                );
                return;
            }
 
            setHistoryData(historyRecords);
            setShowHistoryModal(true);
        } catch (error) {
            alert(
                `Patient ID ${patientId} has not created their medical history yet.`
            );
            setHistoryData([
                { healthHistory: "Failed to retrieve medical history." },
            ]);
            setShowHistoryModal(true);
        }
    };
 
    const handleConsultationFormSubmit = async (appointmentId) => {
        try {
            await fetchConsultationStatus(appointmentId); // Optionally re-check status
            await fetchAppointments(); // Re-fetch all appointments
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error after creating consultation:", error);
            // Handle error
        }
    };
 
    const handleUpdateConsultationFormSubmit = async (appointmentId) => {
        try {
            await fetchConsultationStatus(appointmentId); // Optionally re-check status
            await fetchAppointments(); // Re-fetch all appointments to update UI
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error after updating consultation:", error);
            // Handle error
        }
    };
    const handleSort = (column) => {
        if (column === sortBy) {
            // Toggle sort direction if the same column is clicked again
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Sort by the new column, default to descending (latest first) for date
            setSortBy(column);
            setSortDirection('desc');
        }
    };

    return (
        <div className="appointments">

            <h2 className="text-center mb-4">My Appointments</h2>
 
            {filteredAppointments.length === 0 && selectedDate && (
                <p className="text-center text-danger fw-bold">
                    No available appointments.
                </p>
            )}
            <div style={{ width:'95%',maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-striped table-bordered text-center" >
                <thead className="table-dark">
                    <tr>
                        <th>Appointment ID</th>
                        <th style={{ width: "120px" }}>Patient ID</th>
                        <th onClick={()=> handleSort('date')} style={{cursor:'pointer'}}>
                      
                            Date
                            {/* Clickable Filter Icon */}
                            <FaFilter
                                className="ms-2 text-light cursor-pointer"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            />
                            {sortBy === 'date' && (
                                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                            )}
                        </th>
                        <th>Time Slot</th>
                        <th style={{ width: "140px" }}>Status</th>
                        <th>Consultation</th>
                        <th>Medical History</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show Date Picker when Icon is clicked */}
                    {showDatePicker && (
                        <tr>
                            <td colSpan="7">
                                <div className="d-flex justify-content-center">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="form-control w-25"
                                    />
                                </div>
                            </td>
                        </tr>
                    )}
 
                    {filteredAppointments.map((appointment) => (
                        <tr key={appointment.availabilityId}>
                            <td>{appointment.appointmentId}</td>
                            <td>{appointment.patientId}</td>
                            <td>{appointment.date}</td>
                            <td>
                                {TimeslotsMapping[appointment.timeSlot] || appointment.timeSlot}{" "}
                            </td>
                            <td>{appointment.status}</td>
                            <td style={{ width: "150px" }}>
                                <div className="d-flex justify-content-center gap-3">
                                    <button style={{width:'65px',marginRight:'10px',backgroundColor:'orange'}}
                                        onClick={() => handleOpenModal(appointment.appointmentId)}
                                        className={`btn btn-sm ${
                                            consultationStatus[appointment.appointmentId]
                                                ? "btn-warning"
                                                : "btn-success"
                                        }`}
                                    >
                                        {consultationStatus[appointment.appointmentId]
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                </div>
                            </td>
 
                            <td>
                                <button  style={{width:'65px'}}
                                    className="btn btn-sm btn-info"
                                    onClick={() => fetchMedicalHistory(appointment.patientId)}
                                >
                                    View History
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            {/* Medical History Modal */}
            <div className={`modal ${showHistoryModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showHistoryModal ? 'block' : 'none' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Medical History (Patient ID: {selectedPatientId})</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowHistoryModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {historyData.length > 0 ? (
                                <ul>
                                    {historyData.map((record, index) => (
                                        <li key={index}>{record.healthHistory}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-danger fw-bold">
                                    Patient ID {selectedPatientId} has not created their medical
                                    history yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
 
            {isModalOpen && (
                isUpdate ? (
                    <UpdateConsultationForm
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        appointmentId={selectedAppointmentId}
                        onSubmit={handleUpdateConsultationFormSubmit}
                        token={token} //  submit handler
                    />
                ) : (
                    <ConsultationForm
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        appointmentId={selectedAppointmentId}
                        isUpdate={isUpdate}
                        onSubmit={handleConsultationFormSubmit} // submit handler
                        token={token}
                    />
                )
            )}
        </div>
    );
};
 
export default AppointmentList;