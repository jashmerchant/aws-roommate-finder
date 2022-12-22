import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from './service/AuthService';
import { getUser } from './service/AuthService'
import axios from 'axios';

// const loginUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/login";
const loginUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/login"

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
            console.log(response.data.scanResult);
            setUserSession(response.data.user, response.data.token, response.data.scanResult);
            // props.history.push('/premium-content');
            navigate('/');
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
        <form class="w-80" onSubmit={submitHandler}>
        <h3 class="mb-30">Login</h3>

            <div class="w-50 mb-3">
            <label for="username" class="form-label">Username</label>
            <input placeholder="Enter your username" id="username" type="text" class="form-control" required value={username} onChange={event => setUsername(event.target.value)} /> <br />
            <label for="password" class="form-label">Password</label>
            <input placeholder="Enter your password" id="password" type="password" class="form-control" required value={password} onChange={event => setPassword(event.target.value)} /> <br />
            <input class=" btn btn-primary" type="submit" value="Login" />
            </div>
        </form>

          {errorMessage && <p class="message"> {errorMessage} </p> }
    </div>
    )
}

export default Login;