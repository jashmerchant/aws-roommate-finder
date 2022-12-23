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
    const handleChat = (friend) => {
        navigate(`/chat/${friend}`)
    }
    if (user)
        return (
            <div>
                <h3 class="mb-30">My Connections</h3>
                <ul class="mb-30 list-group list-group-flush">
                    {connections?.map((fr) => {
                        return <li class="list-group-item" key={fr.username}>
                            {fr.name}<button onClick={() => handleChat(fr.username)}>Chat</button>
                        </li>
                    })}
                </ul>
                <h5 >Sent</h5>
                <ul class=" mb-30 list-group list-group-flush">
                    {sent?.map((fr) => {
                        return <li class="list-group-item" key={fr.username}>{fr.name}</li>
                    })}
                </ul>
                <h5 >Received</h5>
                <ul class="mb-30 list-group list-group-flush">
                    {received?.map((fr) => {
                        return <li class="list-group-item flex-center" key={fr.username} style={{ display: "flex" }}>
                            <div>{fr.name}</div>
                            <div>
                                <button class="btn btn-outline-primary" onClick={() => handleAccept(fr)}>Accept</button>
                                <button class="btn btn-outline-primary ml-20" onClick={() => handleReject(fr)}>Reject</button>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        )
}

export default Friends