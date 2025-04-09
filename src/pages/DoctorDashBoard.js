import React, { useState } from 'react';
import DoctorNavbar from '../components/DoctorNavbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import "../CssFiles/DoctorDashBoard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import EditProfile from '../components/EditProfile';
import Notifications from '../components/Notifications';

function DoctorDashBoard() {
    const [notificationTab, setNotificationTab] = useState(false);

    const handleBellClick = () => {
        setNotificationTab(!notificationTab);
        console.log('Notification tab state:', !notificationTab);
    };

    return (
        <Router>
            <div className='doctorDashBoard'>
                <div className='navbarforPatient'><DoctorNavbar/></div>
                <div className='dashBoardContent'>
                    <div className='topTab'>
                        <FontAwesomeIcon className="bell" icon={faBell} onClick={handleBellClick} />
                        {notificationTab && <Notifications tab={setNotificationTab}/>}
                    </div>
                    <div className='otherComponents'>
                        <Routes>
                            <Route path="/edit-profile" element={<EditProfile />} />
                            {/* Add more routes here as needed */}
                        </Routes>   
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default DoctorDashBoard;