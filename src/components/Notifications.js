import React, { useEffect, useState } from 'react';
import "../CssFiles/notifications.css";
const Notifications = ({tab}) =>{
    const [notifiations,SetNotifications]=useState([]);
    useEffect(()=>{
        try{
            const HandleNotification = async() =>{
               // const userId = JSON.parse(localStorage.getItem('userLoggedIn'));
                const userId = "81ac810e-95d5-473e-abe9-37129b26d9a7";
                const apiUrl =`http://localhost:8089/notifications/fetchByDoctorOrPatient?doctorId=${userId}`;
                    const response = await fetch(apiUrl,{
                        method:'GET',
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    });
                    if(response.ok){
                        console.log("Notifications fetched successfully");
                        const data = await response.json();
                        SetNotifications(data);
                    }
            }
            HandleNotification();
        }
        catch(error){
            console.log("unable to load notifications",error);
        }
    },[])
    const notifiationMessage = notifiations.map( noti =><div><p>{noti.message}</p><div className='divider'></div></div>);
    return(
        <div className='tab'>
            <div className='notificationsMessages'>
               <div> {notifiationMessage}</div>
                <button className="closetab" onClick={()=>{tab(false)}}>Close</button> 
            </div>
        </div>
    );
}
export default Notifications;