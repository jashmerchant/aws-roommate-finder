import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession, getUsers } from './service/AuthService';
import axios from 'axios';

// const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"
const editUserUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/edituser"

const Home = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [users, setUsers] = useState(getUsers())
    // console.log("Users:", users)
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

    const handleClick = (receiver) => {
        const requestBody = {
            "sender": user.username,
            "receiver": receiver,
            "request": "pending"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            sessionStorage.setItem('scanResult', JSON.stringify(response.data));
            const data = response.data;
            for (let i = 0; i < data.length; i++) {
                if (data[i].username === user.username) {
                    sessionStorage.setItem('user', JSON.stringify(data[i]));
                    break
                }
            }
            setUsers(response.data)
            alert('Request sent succesfully');
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert(error.response.data.message);
            } else {
                alert('Backend server error');
            }
        })
    }

    const checkSent = (friends) => {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].name === user.username && friends[i].status === "received") {
                return true
            }
        }
        return false
    }

    const checkReceived = (friends) => {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].name === user.username && friends[i].status === "sent") {
                return true
            }
        }
        return false
    }

    if (user) {
        return (
            <div>

                <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Hello {name}!</strong> You have been logged in.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <form onSubmit={submitHandler}>
                    <div class="input-group mb-3">
                        <input type="text" value={searchUser} onChange={event => setUser(event.target.value)} class="form-control" placeholder="Search a user directly.." aria-label="Search text" aria-describedby="button-search"/>
                        <button class="btn btn-outline-secondary" type="submit" id="button-search">Search</button>
                    </div>
                </form>

                <h3 class="mb-30">Here are some recommendations for you.</h3>

                <ul>
                    {users.filter((u) => {
                        let fr = user.friendList;
                        let found = false;
                        for (let i = 0; i < fr.length; i++) {
                            if (fr[i].name === u.username && (fr[i].request === "accepted" || fr[i].request === "rejected")) {
                                found = true
                            }
                        }
                        if (u.username === user.username) {
                            found = true
                        }
                        if (!found) return u
                    }).map((receiver) => {
                        return <li key={receiver.username} style={{ display: "flex" }}>
                            <div>
                                {receiver.username}
                            </div>
                            {checkSent(receiver.friendList) ?
                                <button disabled>Sent</button> :
                                checkReceived(receiver.friendList) ?
                                    <button disabled>Received Request</button> :
                                    <button onClick={() => handleClick(receiver.username)}>Add Friend</button>

                            }

                        </li>
                    })}
                </ul>
                <input class="btn btn-secondary" type="button" value="Logout" onClick={logoutHandler} />
            </div>
        )
    }
}

export default Home;