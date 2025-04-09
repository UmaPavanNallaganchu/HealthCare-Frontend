import React, { useState } from 'react';
import '../CssFiles/LoginRegister.css';
import SignIn from './SignIn';
import SignUp from './SignUp';

const LoginandRegister = ({ setLoggedIn }) =>{
    const [clickbutton,setClickButton] = useState('SignIn');
    const handlebuttonClick = (event) => {
        setClickButton(event.target.name)
    }
    return(<div className='switching'>
           <div className='switchingbuttons'><button name='SignIn'  className={clickbutton === 'SignIn' ? 'active' : 'inactive'} onClick={handlebuttonClick}>SignIn</button>
            <button name='SignUp' onClick={handlebuttonClick}  className={clickbutton === 'SignUp' ? 'active' : 'inactive'}>SignUp</button></div> 
            {clickbutton === 'SignIn' && <SignIn setLoggedIn={ setLoggedIn }/>}
            {clickbutton === 'SignUp' && <SignUp/>}
    </div>);
};
export default LoginandRegister;