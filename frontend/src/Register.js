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

        const isEmpty = (element) => {
            return (!element.value.trim() || element.value.trim() === "")
        }

        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || name.trim() === '' || password.trim() === '') {
            setMessage('All fields required');
            return;
        }
        for (let ele of event.target.elements) {
            if (isEmpty(ele)) {
                setMessage('All fields required')
                return;
            }
        }


        setMessage(null);
        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password,
        }
        for (let ele of event.target.elements) {
            if (ele.name !== "") {
                requestBody[ele.name] = ele.value
            }
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
                age: <input type="number" name='age' /> <br />
                sex: <input type="radio" value="female" name='sex' />Female
                <input type="radio" value="male" name='sex' />Male<br />
                orientation:
                <select name="orientation">
                    <option value="straight">straight</option>
                    <option value="bisexual">bisexual</option>
                </select><br />
                diet: <input type="text" name="diet" /> <br />
                drinks:
                <select name='drinks'>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                    <option value="sometimes">sometimes</option>
                </select><br />
                drugs:
                <select name="drugs">
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                    <option value="sometimes">sometimes</option>
                </select><br />
                education: <input type="text" name="education" /> <br />
                ethnicity: <input type="text" name="ethnicity" /> <br />
                income: <input type="text" name="income" /> <br />
                location: <input type="text" name="location" /> <br />
                pets: <input type="text" name="pets" /> <br />
                smokes:
                <select name="smokes">
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                    <option value="sometimes">sometimes</option>
                </select><br />
                speaks: <input type="text" name="speaks" /> <br />
                username: <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br />
                <input type="submit" value="Register" />
            </form>
            {message && <p className='message'>{message}</p>}
        </div>
    )
}

export default Register;