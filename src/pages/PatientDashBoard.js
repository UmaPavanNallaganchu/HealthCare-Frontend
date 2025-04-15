import React ,{useState}from 'react';
import PatientNavBar from '../components/PatientNavbar';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import "../CssFiles/PatientDashBoard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';
import EditProfile from '../components/EditProfile';
import Notifications from '../components/Notifications';
import MedicalHistory from '../components/MedicalHisotry';
import PatientConsultations from '../components/PatientConsultations';
import HomePage from './HomePage';
function PatientDashBoard(){
    const [notificationTab, setNotificationTab] = useState(false);
    const userdata = JSON.parse(localStorage.getItem('userLoggedIn'));
    const token = localStorage.getItem('jwtToken');
        const handleBellClick = () => {
            setNotificationTab(!notificationTab);
            console.log('Notification tab state:', !notificationTab);
        };
    return (
        
        <Router>
        <div className='patientDashBoard'>
            <div className='navbarforPatient'><PatientNavBar userdata={userdata}/></div>
            <div className='dashBoardContent'>
                <div className='topTab'>
                <FontAwesomeIcon className="bell" icon={faBell} onClick={handleBellClick} />
                {notificationTab && <Notifications tab={setNotificationTab} userType={userdata.role} token={token} userId={userdata.userId}/>}
                </div>
                <div className='otherComponents'>
                <Routes>
                        <Route path="/edit-profile" element={<EditProfile userdata={userdata} token={token}/>} />
                            {/* Add more routes here as needed */}
                        <Route path="/manage-bookings" element={<HomePage patientId ={userdata.userId} token={token}/>}></Route>
                        <Route path='/myConsultations' element={<PatientConsultations token={token} patientId={userdata.userId}/>}></Route>
                        <Route path="/medicalHistory" element={<MedicalHistory userId={userdata.userId} token={token}/>}/>
                        </Routes> 
                </div>
            </div>
        </div>
        </Router>
    );
}

export default PatientDashBoard;