import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getUser, getUsers } from "./service/AuthService";
import axios from 'axios';

// const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"
const editUserUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/edituser"

const Friends = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState(getUsers())
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
            let f = user.friendlist;
            for (let i = 0; i < f?.length; i++) {
                if (f[i].request === "accepted") c.push({ name: f[i].name, username: f[i].username })
                else if (f[i].status === "received" && f[i].request !== "rejected") r.push({ name: f[i].name, username: f[i].username })
                else if (f[i].status === "sent" && f[i].request !== "rejected") s.push({ name: f[i].name, username: f[i].username })
            }
            setConnections(c)
            setReceived(r)
            setSent(s)
        }
    }, [user])

    const handleAccept = (sender) => {
        const requestBody = {
            "sender": sender.username,
            "receiver": user.username,
            "request": "accepted"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            // sessionStorage.setItem('user', JSON.stringify(response.data));
            // setUser(response.data)
            let newUser = { ...user }
            newUser.friendlist = newUser.friendlist.map((eachfriend) => {
                if (eachfriend.username === sender.username) {
                    eachfriend.request = "accepted"
                }
                return eachfriend
            })
            let newUsers = users.map((eachUser) => {
                if (eachUser.username === sender.username) {
                    eachUser.friendlist = eachUser.friendlist.map((friend) => {
                        if (friend.username === user.username) {
                            friend.request = "accepted"
                        }
                        return friend
                    })
                }
                return eachUser
            })
            sessionStorage.setItem('user', JSON.stringify(newUser))
            sessionStorage.setItem('recommendations', JSON.stringify(newUsers))
            setUser(newUser)
            setUsers(newUsers)
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
            "sender": sender.username,
            "receiver": user.username,
            "request": "rejected"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            // sessionStorage.setItem('user', JSON.stringify(response.data));
            // setUser(response.data)
            let newUser = { ...user }
            newUser.friendlist = newUser.friendlist.map((eachfriend) => {
                if (eachfriend.username === sender.username) {
                    eachfriend.request = "rejected"
                }
                return eachfriend
            })
            setUser(newUser)
            sessionStorage.setItem('user', JSON.stringify(newUser))
            let newUsers = users.map((eachUser) => {
                if (eachUser.username === sender.username) {
                    eachUser.friendlist = eachUser.friendlist.map((friend) => {
                        if (friend.username === user.username) {
                            friend.request = "rejected"
                        }
                        return friend
                    })
                }
                return eachUser
            })
            setUsers(newUsers)
            sessionStorage.setItem('recommendations', JSON.stringify(newUsers))
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
                        return <li key={fr.username}>{fr.name}</li>
                    })}
                </ul>
                <div>Sent</div>
                <ul>
                    {sent?.map((fr) => {
                        return <li key={fr.username}>{fr.name}</li>
                    })}
                </ul>
                <div>Received</div>
                <ul>
                    {received?.map((fr) => {
                        return <li key={fr.username} style={{ display: "flex" }}>
                            <div>{fr.name}</div>
                            <button onClick={() => handleAccept(fr)}>Accept</button>
                            <button onClick={() => handleReject(fr)}>Reject</button>
                        </li>
                    })}
                </ul>
            </div>
        )
}

export default Friends