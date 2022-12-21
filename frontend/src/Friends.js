import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getUser } from "./service/AuthService";
import axios from 'axios';

const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"

const Friends = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());
    const [connections, setConnections] = useState([])
    const [sent, setSent] = useState([])
    const [received, setReceived] = useState([])
    useEffect(() => {
        if (!user) {
            navigate("/login")
        } else {
            let c = []
            let s = []
            let r = []
            let f = user.friendList;
            console.log(user);
            for (let i = 0; i < f?.length; i++) {
                if (f[i].request === "accepted") c.push(f[i].name)
                else if (f[i].status === "received" && f[i].request !== "rejected") r.push(f[i].name)
                else if (f[i].status === "sent" && f[i].request !== "rejected") s.push(f[i].name)
            }
            setConnections(c)
            setReceived(r)
            setSent(s)
        }
    }, [user])

    const handleAccept = (sender) => {
        const requestBody = {
            "sender": sender,
            "receiver": user.username,
            "request": "accepted"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            sessionStorage.setItem('scanResult', JSON.stringify(response.data));
            const data = response.data;
            let i;
            for (i = 0; i < data.length; i++) {
                if (data[i].username === user.username) {
                    sessionStorage.setItem('user', JSON.stringify(data[i]));
                    break
                }
            }
            setUser(data[i])
            alert('Request Accepted');
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert(error.response.data.message);
            } else {
                alert('Backend server error');
            }
        })
    }

    const handleReject = (sender) => {
        const requestBody = {
            "sender": sender,
            "receiver": user.username,
            "request": "rejected"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            sessionStorage.setItem('scanResult', JSON.stringify(response.data));
            const data = response.data;
            let i;
            for (i = 0; i < data.length; i++) {
                if (data[i].username === user.username) {
                    sessionStorage.setItem('user', JSON.stringify(data[i]));
                    break
                }
            }
            setUser(data[i])
            alert('Request Rejected');
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert(error.response.data.message);
            } else {
                alert('Backend server error');
            }
        })
    }

    if (user)
        return (
            <div>
                <div>My Connections</div>
                <ul>
                    {connections?.map((fr) => {
                        console.log(fr);
                        return <li key={fr}>{fr}</li>
                    })}
                </ul>
                <div>Sent</div>
                <ul>
                    {sent?.map((fr) => {
                        return <li key={fr}>{fr}</li>
                    })}
                </ul>
                <div>Received</div>
                <ul>
                    {received?.map((fr) => {
                        return <li key={fr} style={{ display: "flex" }}>
                            <div>{fr}</div>
                            <button onClick={() => handleAccept(fr)}>Accept</button>
                            <button onClick={() => handleReject(fr)}>Reject</button>
                        </li>
                    })}
                </ul>
            </div>
        )
}

export default Friends