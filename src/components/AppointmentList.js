import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa"; //  Import filter icon
import "bootstrap/dist/css/bootstrap.min.css"; //  Import Bootstrap
import ConsultationForm from "./ConsultationForm";
import UpdateConsultationForm from "./UpdateConsultation";
import Modal from "react-bootstrap/Modal"; //  Bootstrap Modal for pop-up
 
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
 
    const TimeslotsMapping = {
        "NINE_TO_ELEVEN": "9:00 am - 11:00 am",
        "ELEVEN_TO_ONE": "11:00 am - 1:00 pm",
        "TWO_TO_FOUR": "2:00 pm - 4:00 pm",
        "FOUR_TO_SIX": "4:00 pm - 6:00 pm"
    };
   
    useEffect(() => {fetch(`http://localhost:8065/appointments/viewByDoctor/${doctorId}`,{
        method:'GET',
        headers:{
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Appointments:", data);
                setAppointments(data.data || []);
                setFilteredAppointments(data.data || []);
                checkConsultationStatus(data.data || []);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
                setAppointments([]);
            });
    }, []);
 
    useEffect(() => {
        if (appointments.length > 0) {
            checkConsultationStatus(appointments);
        }
    }, [appointments]);
 
    const checkConsultationStatus = async (appointments) => {
        let statusMap = {};
        for (const appointment of appointments) {
            statusMap[appointment.availabilityId] = await fetchConsultationStatus(appointment.availabilityId);
        }
        setConsultationStatus(statusMap);
    };
 
    const fetchConsultationStatus = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:8050/consultation/appointment/${appointmentId}`,{
                method:'GET',
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
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
 
    const handleDeleteConsultation = async (appointmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
        if (!confirmDelete) return;
 
        try {
            const response = await fetch(`http://localhost:8050/consultation/delete/appointment/${appointmentId}`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
 
            if (data.success) {
                alert("Consultation deleted successfully!");
                setConsultationStatus(prevStatus => ({
                    ...prevStatus,
                    [appointmentId]: false
                }));
            } else {
                alert("Failed to delete consultation: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting consultation:", error);
            alert("An error occurred while deleting consultation.");
        }
    };
 
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
 
        if (event.target.value) {
            const filtered = appointments.filter(app => app.date === event.target.value);
            setFilteredAppointments(filtered.length > 0 ? filtered : []);
        } else {
            setFilteredAppointments(appointments);
        }
    };
 
    const fetchMedicalHistory = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:8050/history/patient/${patientId}`,{
                method:'GET',
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const historyRecords = data.data || [];
 
            setSelectedPatientId(patientId);
 
            if (historyRecords.length === 0) {
                alert(`Patient ID ${patientId} has not created their medical history yet.`);
                return;
            }
           
            setHistoryData(historyRecords);
            setShowHistoryModal(true);
        } catch (error) {
            alert(`Patient ID ${patientId} has not created their medical history yet.`);
            setHistoryData([{ healthHistory: "Failed to retrieve medical history." }]);
            setShowHistoryModal(true);
        }
    };
   
 
    return (
        <div className="container mt-4">
            <h4 className="text-center mb-4">ID: <span className="text-primary">{doctorId}</span></h4>
            <h2 className="text-center mb-4">My Appointments</h2>
 
            {filteredAppointments.length === 0 && selectedDate && (
                <p className="text-center text-danger fw-bold">No available appointments.</p>
            )}
 
            <table className="table table-striped table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Appointment ID</th>
                        <th style={{ width: "120px" }}>Patient ID</th>
                        <th>
                            Date  
                            {/* Clickable Filter Icon */}
                            <FaFilter
                                className="ms-2 text-light cursor-pointer"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            />
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
                            <td colSpan="6">
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
                            <td>{TimeslotsMapping[appointment.timeSlot] || appointment.timeSlot} </td>
                            <td>{appointment.status}</td>
                            <td style={{ width: "150px" }}>
                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(appointment.availabilityId)}
                                        className={`btn btn-sm ${consultationStatus[appointment.availabilityId] ? "btn-warning" : "btn-success"}`}
                                    >
                                        {consultationStatus[appointment.availabilityId] ? "Update" : "Create"}
                                    </button>
                                    {consultationStatus[appointment.availabilityId] && (
                                        <button
                                            onClick={() => handleDeleteConsultation(appointment.availabilityId)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td>
                                <button
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
 
            {/*  Medical History Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Medical History (Patient ID: {selectedPatientId})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {historyData.length > 0 ? (
                        <ul>
                            {historyData.map((record, index) => (
                                <li key={index}>{record.healthHistory}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-danger fw-bold">Patient ID {selectedPatientId} has not created their medical history yet.</p>)}
                </Modal.Body>
            </Modal>
 
            {isUpdate ? (
           
            <UpdateConsultationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointmentId={selectedAppointmentId}
                token={token}
            /> )
            : (
            <ConsultationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointmentId={selectedAppointmentId}
                isUpdate={isUpdate}
                token={token}
            />
            )}
        </div>
    );
};
 
export default AppointmentList;