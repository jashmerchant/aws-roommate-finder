import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from './service/AuthService'
import axios from 'axios';

const registerUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/register"

const Register = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    //If user authenticated, redirect them
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user])

    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || name.trim() === '' || password.trim() === '') {
            setMessage('All fields required');
            return;
        }


        setMessage(null);
        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password
        }
        axios.post(registerUrl, requestBody).then(response => {
            setMessage('Registeration succesful');
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Backend server error');
            }
        })
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <h5>Register</h5>
                name: <input type="text" value={name} onChange={event => setName(event.target.value)} /> <br />
                email: <input type="email" value={email} onChange={event => setEmail(event.target.value)} /> <br />
                username: <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br />
                <input type="submit" value="Register" />
            </form>
            {message && <p className='message'>{message}</p>}
        </div>
    )
}

export default Register;