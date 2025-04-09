import React ,{useState}from 'react';
import PatientNavBar from '../components/PatientNavbar';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import "../CssFiles/PatientDashBoard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';
import EditProfile from '../components/EditProfile';
import Notifications from '../components/Notifications';
function PatientDashBoard(){
    const [notificationTab, setNotificationTab] = useState(false);
    
        const handleBellClick = () => {
            setNotificationTab(!notificationTab);
            console.log('Notification tab state:', !notificationTab);
        };
    return (
        
        <Router>
        <div className='patientDashBoard'>
            <div className='navbarforPatient'><PatientNavBar/></div>
            <div className='dashBoardContent'>
                <div className='topTab'>
                <FontAwesomeIcon className="bell" icon={faBell} onClick={handleBellClick} />
                {notificationTab && <Notifications tab={setNotificationTab}/>}
                </div>
                <div className='otherComponents'>
                <Routes>
                            <Route path="/edit-profile" element={<EditProfile/>} />
                            {/* Add more routes here as needed */}
                        </Routes> 
                </div>
            </div>
        </div>
        </Router>
    );
}

export default PatientDashBoard;