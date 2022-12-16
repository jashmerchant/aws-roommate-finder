import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from './service/AuthService';
import { getUser } from './service/AuthService'
import axios from 'axios';

const loginUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/login";

const Login = (props) => {
    const navigate = useNavigate();
    const user = getUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    //If user authenticated, redirect them
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user])

    // If user not authenticated, show them login form
    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage('All fields required');
            return;
        }

        setErrorMessage(null);
        const requestBody = {
            username: username,
            password: password
        }
        axios.post(loginUrl, requestBody).then((response) => {
            setUserSession(response.data.user, response.data.token);
            // props.history.push('/premium-content');
            navigate('/premium-content');
            console.log("Logged in")
        }).catch((error) => {
            // console.log(error)
            if (error.response.status === 401 || error.response.status === 403) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Backend server error');
            }
        })
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <h5>Login</h5>
                username: <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br />
                <input type="submit" value="Login" />
            </form>
            {errorMessage && <p className='message'>{errorMessage}</p>}
        </div>
    )
}

export default Login;