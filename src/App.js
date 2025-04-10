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
      {loggedIn ? (
        loginDetails && loginDetails.role === 'PATIENT' ? (
          <PatientDashBoard />
        ) : (
          <DoctorDashBoard />
        )
      ) : (
        <LoginandRegister setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;