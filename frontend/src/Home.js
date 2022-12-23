// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUser, resetUserSession, getUsers } from './service/AuthService';
// import axios from 'axios';

// // const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"
// const editUserUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/edituser"

// const Home = () => {
//     const navigate = useNavigate();
//     const user = getUser();
//     const [users, setUsers] = useState(getUsers())
//     // 
//     const [searchUser, setUser] = useState('');
//     const name = user !== 'undefined' && user ? user.name : '';

//     useEffect(() => {
//         if (!user) {
//             navigate("/login")
//         }
//     }, [user])

//     const logoutHandler = () => {
//         resetUserSession();
//         navigate('/login');
//     }

//     const submitHandler = (event) => {
//         event.preventDefault();
//         if (searchUser.trim() === '') {
//             return;
//         }
//     }

//     const handleClick = (receiver) => {
//         const requestBody = {
//             "sender": user.username,
//             "receiver": receiver,
//             "request": "pending"
//         }
//         axios.post(editUserUrl, requestBody).then(response => {
//             sessionStorage.setItem('scanResult', JSON.stringify(response.data));
//             const data = response.data;
//             for (let i = 0; i < data.length; i++) {
//                 if (data[i].username === user.username) {
//                     sessionStorage.setItem('user', JSON.stringify(data[i]));
//                     break
//                 }
//             }
//             setUsers(response.data)
//             alert('Request sent succesfully');
//         }).catch(error => {
//             if (error.response.status === 401 || error.response.status === 403) {
//                 alert(error.response.data.message);
//             } else {
//                 alert('Backend server error');
//             }
//         })
//     }

//     const checkSent = (friends) => {
//         for (let i = 0; i < friends.length; i++) {
//             if (friends[i].name === user.username && friends[i].status === "received") {
//                 return true
//             }
//         }
//         return false
//     }

//     const checkReceived = (friends) => {
//         for (let i = 0; i < friends.length; i++) {
//             if (friends[i].name === user.username && friends[i].status === "sent") {
//                 return true
//             }
//         }
//         return false
//     }

//     if (user) {
//         return (
//             <div>

//                 <div class="alert alert-success alert-dismissible fade show" role="alert">
//                 <strong>Hello {name}!</strong> You have been logged in.
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//                 </div>

//                 <form onSubmit={submitHandler}>
//                     <div class="input-group mb-3">
//                         <input type="text" value={searchUser} onChange={event => setUser(event.target.value)} class="form-control" placeholder="Search a user directly.." aria-label="Search text" aria-describedby="button-search"/>
//                         <button class="btn btn-outline-secondary" type="submit" id="button-search">Search</button>
//                     </div>
//                 </form>

//                 <h3 class="mb-30">Here are some recommendations for you.</h3>

//                 <ul>
//                     {users.filter((u) => {
//                         let fr = user.friendlist;
//                         let found = false;
//                         for (let i = 0; i < fr.length; i++) {
//                             if (fr[i].name === u.username && (fr[i].request === "accepted" || fr[i].request === "rejected")) {
//                                 found = true
//                             }
//                         }
//                         if (u.username === user.username) {
//                             found = true
//                         }
//                         if (!found) return u
//                     }).map((receiver) => {
//                         return <li key={receiver.username} style={{ display: "flex" }}>
//                             <div>
//                                 {receiver.username}
//                             </div>
//                             {checkSent(receiver.friendlist) ?
//                                 <button disabled>Sent</button> :
//                                 checkReceived(receiver.friendlist) ?
//                                     <button disabled>Received Request</button> :
//                                     <button onClick={() => handleClick(receiver.username)}>Add Friend</button>

//                             }

//                         </li>
//                     })}
//                 </ul>
//                 <input class="btn btn-secondary" type="button" value="Logout" onClick={logoutHandler} />
//             </div>
//         )
//     }
// }

// export default Home;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, resetUserSession, getUsers } from './service/AuthService';
import axios from 'axios';

const searchUsers = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/home";
// const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"
const editUserUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/edituser"

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());
    //TODO: Commented this line
    var [users, setUsers] = useState(getUsers())
    // 
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
        // alert(document.getElementById("key").value);
        // alert(document.getElementById("value").value);
        // TODO: Make a call to the /search API
        // if (searchUser.trim() === '') {
        //     return;
        // }
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

        var jsonData = {};
        jsonData['age'] = parseInt(loggedInUser['age']);
        jsonData['sex'] = loggedInUser['sex'];
        jsonData['orientation'] = loggedInUser['orientation'];
        jsonData['diet'] = loggedInUser['diet'];
        jsonData['drinks'] = loggedInUser['drinks'];
        jsonData['drugs'] = loggedInUser['drugs'];
        jsonData['ethnicity'] = loggedInUser['ethnicity'];
        jsonData['income'] = loggedInUser['income'];
        jsonData['location'] = loggedInUser['location'];
        jsonData['pets'] = loggedInUser['pets'];
        jsonData['smokes'] = loggedInUser['smokes'];
        jsonData['speaks'] = loggedInUser['speaks'];

        let responseList
        axios.post(searchUsers, jsonData).then(response => {
            // TODO: Attach the response to the users that are displayed in the page
            responseList = response.data.recommendations;
            responseList = responseList.map((friend) => {
                if (friend.friendlist["S"] == "[]") {
                    friend.friendlist = []
                }
                return friend
            })
            sessionStorage.setItem('scanResult', JSON.stringify(responseList));
            console.log(responseList);
            setUsers(responseList);

        });
    }

    const handleClick = (receiver) => {
        const requestBody = {
            "sender": user.username,
            "receiver": receiver,
            "request": "pending"
        }
        axios.post(editUserUrl, requestBody).then(response => {
            console.log(response);
            sessionStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data)
            let newUsers = users.map((eachUser) => {
                if (eachUser.username === receiver) {
                    eachUser.friendlist.push({ name: user.name, username: user.username, request: "pending", status: "received" })
                }
                return eachUser
            })
            setUsers(newUsers)
            sessionStorage.setItem('scanResult', JSON.stringify(newUsers));
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
            if (friends[i].username === user.username && friends[i].status === "received") {
                return true
            }
        }
        return false
    }

    const checkReceived = (friends) => {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].username === user.username && friends[i].status === "sent") {
                return true
            }
        }
        return false
    }

    if (user && users) {
        return (
            <div>

                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Hello {name}!</strong> You have been logged in.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <form onSubmit={submitHandler}>
                    <input type="text" name="By" id="key" />
                    <input type="text" name="Value" id="value" />
                    <input type="submit" value="Search" />
                </form>

                <h3 class="mb-30">Here are some recommendations for you.</h3>

                <ul>
                    {users.filter((u) => {

                        let fr = user.friendlist;
                        let found = false;
                        for (let i = 0; i < fr.length; i++) {
                            if (fr[i].username === u.username && (fr[i].request === "accepted" || fr[i].request === "rejected")) {
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
                                {receiver.name}
                            </div>
                            {checkSent(receiver.friendlist) ?
                                <button disabled>Sent</button> :
                                checkReceived(receiver.friendlist) ?
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