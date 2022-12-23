import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getUser } from './service/AuthService'

const Chat = () => {
    const box = useRef()
    const user = getUser()
    const { friend } = useParams()
    const addMessage = (type, message) => {
        const outerDiv = document.createElement("div")
        const innerDiv = document.createElement("div")
        innerDiv.textContent = message
        outerDiv.className = type
        outerDiv.appendChild(innerDiv)
        box.current?.appendChild(outerDiv)
    }
    const socket = io('http://localhost:3001')
    socket.on("connect", () => {
        console.log(`You are connected with id: ${socket.id}`);
        socket.emit("join", user.username, message => console.log(message))
        socket.on("receive-message", message => {
            addMessage("receive", friend + " : " + message)
            console.log(message);
        })
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        const message = document.getElementById("message");
        socket.emit('send-message', message.value, friend)
        addMessage("send", "Me : " + message.value)
        message.value = ''
    }
    return (
        <div>
            <div className="chatbox" id="chatbox" ref={box}>

            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" id="message" />
                <input type="submit" value="Send" />
            </form>
        </div>
    )
}

export default Chat