import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession } from './service/AuthService'

const MyProfile = () => {
    const navigate = useNavigate();
    const user = getUser();
    console.log(user)
    const name = user !== 'undefined' && user ? user.name : '';
    const username = user !== 'undefined' && user ? user.username : '';
    const email = user !== 'undefined' && user ? user.email : '';

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    if (user) {
        return (
            <div>
                Name: {name} <br />
                Username: {username} <br />
                Email: {email}
            </div >
        )
    }
}

export default MyProfile