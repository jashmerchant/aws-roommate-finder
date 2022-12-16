import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession } from './service/AuthService'

const Home = () => {
    const navigate = useNavigate();
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])
    const logoutHandler = () => {
        resetUserSession();
        navigate('/login');
    }
    if (user) {
        return (
            <div>
                Hello {name}! You have been logged in! <br />
                <input type="button" value="Logout" onClick={logoutHandler} />
            </div>
        )
    }
}

export default Home;