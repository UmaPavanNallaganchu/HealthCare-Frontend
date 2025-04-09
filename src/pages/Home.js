import React from 'react';

const Home = (props) =>{

    const handleLogOut = () =>{
        localStorage.clear();
    }
    return (
       <div>
        <p>hello u have logged In successfully {props.userdata.userId}</p>
        <button onClick={handleLogOut}>LogOut</button>
       </div>
       );
}
export default Home;