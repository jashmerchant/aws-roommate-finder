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

const getRecommendations = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/home";
// const editUserUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/edituser"
const editUserUrl = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/edituser"
var searchUsers = "https://ao9v2ya7ci.execute-api.us-east-1.amazonaws.com/deploy/search";
const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());
    //TODO: Commented this line
    var [users, setUsers] = useState(getUsers())
    // console.log("Users:", users)
    const [searchUser, setSearchUser] = useState('');
    const name = user !== 'undefined' && user ? user.name : '';


    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])
    React.useEffect(() => loadRecommendations(), [])
    const logoutHandler = () => {
        resetUserSession();
        navigate('/login');
    }

    const loadRecommendations = (event) => {
        const loadedRecommendations = JSON.parse(sessionStorage.getItem('recommendations'));
        if (loadedRecommendations == undefined && user) {
            console.log("In load recommendations \n");
            const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
            console.log("Logged in user is \n");
            console.log(loggedInUser);
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
            console.log("Json data is\n");
            console.log(jsonData);
            axios.post(getRecommendations, jsonData).then(response => {
                console.log(response.data.recommendations);
                sessionStorage.setItem("recommendations", JSON.stringify(response.data.recommendations));
                setUsers(response.data.recommendations);
            });
        }
        else {
            setUsers(loadedRecommendations);
        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        var key = document.getElementById("key").value;
        var value = document.getElementById("value").value;
        // TODO: Make a call to the /search API

        // if (searchUser.trim() === '') {
        //     return;
        // }
        console.log("Url for search is ", searchUsers + "?" + key + "=" + value);
        axios.get(searchUsers + "?" + key + "=" + value).then((response) => {
            console.log("Search users response is\n");
            console.log(response);
            var arr = [];
            if (response.data != undefined) {
                var loadedRecommendations = JSON.parse(sessionStorage.getItem('searchedusers'));
                if (loadedRecommendations == null) {
                    loadedRecommendations = [];
                }
                loadedRecommendations.push(response.data);
                sessionStorage.setItem("searchedusers", JSON.stringify(loadedRecommendations));
                arr.push(response.data);
                setUsers(arr);
            }
            else {
                alert("No users with the given username found");
            }
        })
        /* const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        console.log("Logged in user is \n");
        console.log(loggedInUser);
        var jsonData = {};
            jsonData['age'] = parseInt(loggedInUser['age']);
            jsonData['sex']= loggedInUser['sex'];
            jsonData['orientation']= loggedInUser['orientation'];
            jsonData['diet']= loggedInUser['diet'];
            jsonData['drinks']= loggedInUser['drinks'];
            jsonData['drugs']= loggedInUser['drugs'];
            jsonData['ethnicity']= loggedInUser['ethnicity'];
            jsonData['income']= loggedInUser['income'];
            jsonData['location']= loggedInUser['location'];
            jsonData['pets']= loggedInUser['pets'];
            jsonData['smokes']= loggedInUser['smokes'];
            jsonData['speaks']= loggedInUser['speaks'];
            console.log("Json data is\n");
            console.log(jsonData);
            axios.post(getRecommendations, jsonData).then(response => {
                // TODO: Attach the response to the users that are displayed in the page
                for(var index in response.data.recommendations)
                {
                    var recommendation = response.data.recommendations[index];
                    console.log(recommendation['friendlist'])
                    recommendation['friendlist'] = recommendation['friendlist'].replace(/'/g, '"');
                    recommendation['friendlist'] = JSON.parse(recommendation['friendlist']);
                }
                console.log(response.data.recommendations);
                setUsers(response.data.recommendations);
                
            }); */
    }
    let number = 0;
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
            sessionStorage.setItem('recommendations', JSON.stringify(newUsers));
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
        if (friends != undefined) {
            for (let i = 0; i < friends.length; i++) {
                if (friends[i].username === user.username && friends[i].status === "received") {
                    return true
                }
            }
        }
        return false
    }

    const checkReceived = (friends) => {
        if (friends != undefined) {
            for (let i = 0; i < friends.length; i++) {
                if (friends[i].username === user.username && friends[i].status === "sent") {
                    return true
                }
            }
        }
        return false
    }

    if (user && users) {
        return (
            <div class="mb-5">

                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Hello {name}!</strong> You have been logged in.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <form onSubmit={submitHandler}>
                     <div class="input-group mb-3">
                        <label class="input-group-text" for="key">Search By</label>
                        <select class="form-select mybasis" id="key" name="By">
                            <option value="username" selected>Username</option>
                            {/* <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option> */}
                        </select>
                        <input type="text" name="Value" id="value" class="form-control" placeholder="Search.." />
                        <button class="btn btn-outline-secondary"  value="Search" type="submit" id="button-search">Search</button>
                     </div>
                 </form>

                <h3 class="mb-30">Here are some recommendations for you.</h3>
                <div class="mycontainer">
                {users.filter((u) => {
                    let fr = user.friendlist;
                    let found = false;
                    console.log("Friendlist is \n");
                    console.log(fr);
                    if (fr != undefined) {
                        for (let i = 0; i < fr.length; i++) {
                            if (fr[i].username === u.username && (fr[i].request === "accepted" || fr[i].request === "rejected")) {
                                found = true
                            }
                        }
                    }
                    if (u.username === user.username) {
                        found = true
                    }
                    if (!found) return u
                }).map((receiver) => {
                    number += 1;
                    var link = "my-profile?uname=" + receiver.username;
                    return <div class="col-5 myitems">
                        {/* <div class="col-sm-6"> */}
                            <div class="card ">
                            <div class="card-body">
                                <h5 class="card-title">{receiver.name} ( <a href={link}>{receiver.username}</a> )</h5>
                                <p class="card-text">{receiver.location}<br/>{receiver.sex == "m" ? "Male" : "Female"}</p>

                                {checkSent(receiver.friendlist) ?
                                            <button class="btn btn-outline-primary" disabled>Sent</button> :
                                            checkReceived(receiver.friendlist) ?
                                                <button class="btn btn-outline-primary" disabled>Received Request</button> :
                                                <button class="btn btn-outline-primary" onClick={() => handleClick(receiver.username)}>Add Friend</button>
                                        }

                            </div>
                            </div>
                    </div>
                })}
                </div>
                <input class="btn btn-secondary" type="button" value="Logout" onClick={logoutHandler} />
            </div>
        )
    } else {
        return <div class="d-flex align-items-center">
        <strong>Loading your Recommendations...</strong>
        <div class="spinner-border ml-20" role="status" aria-hidden="true"></div>
      </div>
    }
}

export default Home;
