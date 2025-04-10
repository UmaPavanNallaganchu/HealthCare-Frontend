import React, { useState } from "react";
import Modal from "react-modal";
 
const ConsultationForm = ({ isOpen, onClose, appointmentId, isUpdate ,token}) => {
    const [notes, setNotes] = useState("");
    const [prescription, setPrescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const consulData = {
            appointmentId,
            notes,
            prescription,
        };
 
        try {
            let response;
            if (isUpdate) {
                response = await fetch(`http://localhost:8050/consultation/update/consul/${appointmentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(consulData),
                });
                if (response.ok) {
                    setMessage("Consultation updated successfully!");
                } else {
                    throw new Error("Failed to update consultation");
                }
            } else {
                response = await fetch(`http://localhost:8050/consultation/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(consulData),
                });
                if (response.ok) {
                    setMessage("Consultation created successfully!");
                } else {
                    throw new Error("Failed to create consultation");
                }
            }
            const responseData = await response.json();
            console.log("Response:", responseData);
            setTimeout(() => {
                setNotes("");
                setPrescription("");
                setLoading(false);
                onClose();
            }, 2000);
        } catch (err) {
            setMessage("Error processing consultation. Please try again.");
            console.error("Error:", err);
            setLoading(false);
        }
    };
 
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Consultation">
            <div
                style={{
                    padding: "20px",
                    width: "400px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                }}
            >
                <h2 style={{ color: "#333", textAlign: "center" }}>🩺 Create Consultation</h2>
                {message && (
                    <p
                        style={{
                            color: message.includes("success") ? "green" : "red",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </p>
                )}
 
                <form onSubmit={handleSubmit}>
                    <label>
                        <strong>Appointment ID:</strong> {appointmentId}
                    </label>
                    <br />
 
                    <label>Notes:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter consultation notes..."
                        required
                        maxLength={500}
                        style={{
                            width: "100%",
                            height: "80px",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <br />
 
                    <label>Prescription:</label>
                    <input
                        type="text"
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="Enter prescribed medicine..."
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <br />
 
                    <button
                        type="submit"
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            width: "100%",
                            backgroundColor: loading ? "#888" : "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Consultation"}
                    </button>
 
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            marginTop: "10px",
                            padding: "10px",
                            width: "100%",
                            backgroundColor: "#bbb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </Modal>
    );
};
 
export default ConsultationForm;