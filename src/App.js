import React, { useState, useEffect } from 'react';
import './CssFiles/App.css';
import LoginandRegister from './components/SignInandSignUp';
import DoctorDashBoard from './pages/DoctorDashBoard';
import PatientDashBoard from './pages/PatientDashBoard';
//import Home from './pages/Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState(null);

  useEffect(() => {
    const userdata = localStorage.getItem('userLoggedIn');
    if (userdata) {
      setLoginDetails(JSON.parse(userdata));
      console.log(userdata);
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <p className='copyright'>&copy; 2025 HealthCare Management </p>
      {loggedIn ? (
        loginDetails && loginDetails.role === 'PATIENT' ? (
          <PatientDashBoard />
        ) : (
          <DoctorDashBoard />
        )
      ) : (
        <LoginandRegister setLoggedIn={setLoggedIn}  setLoginDetails={setLoginDetails}/>
      )}
    </div>
  );
}

export default App;