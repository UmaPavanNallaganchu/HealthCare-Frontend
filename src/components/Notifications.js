import React, { useEffect, useState } from "react";
import "../CssFiles/notifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const Notifications = ({ tab, userType ,token,userId}) => {
  const [notifications, SetNotifications] = useState([]);
  const timeMap = {
    "NINE_TO_ELEVEN": "9:00 am - 11:00 am",
    "ELEVEN_TO_ONE": "11:00 am - 1:00 pm",
    "TWO_TO_FOUR": "2:00 pm - 4:00 pm",
    "FOUR_TO_SIX": "4:00 pm - 6:00 pm",
   
};
const extractTimeSlotFromMessage = (message) => {
    for (let key in timeMap) {
        if (message.includes(key)) {
            return key; // Return the matching key (e.g., "TWO_TO_FOUR")
        }
    }
    return null; // Return null if no time slot is found
};


// Replace the time slot enum in the message with the readable format
const mapTimeSlotInMessage = (message, timeSlot) => {
    if (!timeSlot) return message; // Handle undefined/null timeSlot
    if (timeMap[timeSlot]) {
        return message.replace(timeSlot, timeMap[timeSlot]);
    }
    return message; // Default fallback
};

  useEffect(() => {
    try {
      const HandleNotification = async () => {
        // const userId = JSON.parse(localStorage.getItem('userLoggedIn'));
        const apiUrl =
          userType === "DOCTOR"
            ? `http://localhost:8089/notifications/fetchByDoctorOrPatient?doctorId=${userId}`
            : `http://localhost:8089/notifications/fetchByDoctorOrPatient?patientId=${userId}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        });
        if (response.ok) {
          console.log("Notifications fetched successfully");
          const data = await response.json();
          SetNotifications(data);
        }
      };
      HandleNotification();
    } catch (error) {
      console.log("unable to load notifications", error);
    }
  }, []);

  const handleRedirect = () => {
    if (userType === 'PATIENT') {
        window.location.href = '/manage-bookings';
    } else if (userType === 'DOCTOR') {
        window.location.href = '/consultations';
    }
};
  const notificationMessage = notifications.map((noti) => {
    const msg = noti.message;
    const slot = extractTimeSlotFromMessage(msg);
    console.log(slot); // Output: "TWO_TO_FOUR"

    const updatedMessage = mapTimeSlotInMessage(msg, slot);
    return (
        <div>
        <div style={{ display: "flex", justifyContent: "left", width: "100%" }}>
          <p>{updatedMessage}</p>
          <FontAwesomeIcon icon={faEye} onClick={handleRedirect}/>
        </div>
        <div
          className="divider"
          style={{
            borderBottom: "1px solid #757474",
            margin: "10px 0px",
            width: "100%",
          }}
        ></div>
      </div>
    );
});

  return (
    <div className="tab">
      <div className="notificationsMessages">
        <div> {notificationMessage}</div>
        <button
          className="closetab"
          onClick={() => {
            tab(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default Notifications;
