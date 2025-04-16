import React, { useState, useEffect } from 'react';
import "../CssFiles/generalCss.css";
const EditProfile = ({userdata,token}) => {
    const [userName, setUserName] = useState('');
    const [userEmailId, setUserEmailId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState('');
    const [userId, setUserId] = useState('');
    const [gender, setGender] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [errors, setErrors] = useState({});
    useEffect(() => {
        console.log('Fetching user data...');
        const HandleGetData = async () => {
            const apiUrl = (userdata.role === 'DOCTOR') ? 
                `http://localhost:8086/api/doctor/${userdata.userId}` : 
                `http://localhost:8086/api/patient/${userdata.userId}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                console.log('User data fetched:', data);
                setUserId(userdata.userId);
                setUserName(data.data.name);
                setUserEmailId(data.data.email);
                setPhoneNumber(data.data.phoneNumber);
                if (userdata.role === 'PATIENT') {
                    setGender(data.data.gender);
                    setAddress(data.data.address);
                    setAge(data.data.age);
                } else {
                    setSpecialization(data.data.specialization);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        HandleGetData();
    }, []);

    const validateForm = () => {
        let formErrors = {};
        if (!userName) formErrors.userName = "Name is required";
        if (!userEmailId) {
            formErrors.userEmailId = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userEmailId)) {
            formErrors.userEmailId = "Email is invalid";
        }
        if (!phoneNumber) {
            formErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            formErrors.phoneNumber = "Phone number is invalid";
        }
        if (userdata.role === 'PATIENT' && (!age || isNaN(age))) {
            formErrors.age = "Age must be a number";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const HandleUpdate = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        const token = localStorage.getItem('jwtToken');
        const apiUrl = (userdata.role === 'DOCTOR') ? 
            `http://localhost:8086/api/doctor/update` : 
            `http://localhost:8086/api/patient/update`;
        const updateData = (userdata.role === 'DOCTOR') ? {
            doctor_id: userId,
            email: userEmailId,
            name: userName,
            phoneNumber: phoneNumber,
            specialization: specialization
        } : {
            patient_id: userId,
            email: userEmailId,
            name: userName,
            phoneNumber: phoneNumber,
            gender: gender,
            age: age,
            address: address
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Updated Successfully", data);
                alert("Updated Successfully");
            } else {
                const data = await response.json();
                console.log("Update failed", data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className='editProfile'>
            <form onSubmit={HandleUpdate}>
            <div className='sub'> <label>UserId:</label>
              <input type='text' value={userId} readOnly/></div>
               <div className='sub'> <label>Username:</label>
                <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
                {errors.userName && <span className='error'>{errors.userName}</span>}
                </div>
                <div className='sub'><label>EmailId:</label>
                <input type='text' value={userEmailId} onChange={(e) => setUserEmailId(e.target.value)}/>
                {errors.userEmailId && <span className='error'>{errors.userEmailId}</span>}
                </div>
                <div className='sub'><label>Phone Number:</label>
                <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                {errors.phoneNumber && <span className='error'>{errors.phoneNumber}</span>}
                </div>

                {userdata.role === 'PATIENT' && (
                    <>
                        <div className='sub'><label>Age:</label>
                        <input type='text' value={age} onChange={(e) => setAge(e.target.value)} />
                        {errors.age && <span className='error'>{errors.age}</span>}
                        </div>
                        <div className='sub'> <label>Gender:</label>
                        <select id='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Others</option>
                        </select></div>
                        <div className='sub'><label>Address:</label>
                        <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                    </>
                )}

                {userdata.role === 'DOCTOR' && (
                    <label>Specialization: {specialization}</label>
                )}

               <div className='buttons'>
                <button type='submit'>Update</button> </div>
            </form>

        </div>
    );
};

export default EditProfile;