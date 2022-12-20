import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession } from './service/AuthService'

const Home = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [searchUser, setUser] = useState('');
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

    const submitHandler = (event) => {
        event.preventDefault();
        if (searchUser.trim() === '') {
            return;
        }
    }

    if (user) {
        return (
            <div>
                Hello {name}! You have been logged in! <br />

                <form onSubmit={submitHandler}>
                    Search Users: <input type="text" value={searchUser} onChange={event => setUser(event.target.value)} />
                    <input type="submit" value="Search" />
                </form>

                <input type="button" value="Logout" onClick={logoutHandler} />
            </div>
        )
    }
}

export default Home;