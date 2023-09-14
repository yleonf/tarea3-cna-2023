// src/MessageWindow.jsx

import React, { useEffect } from 'react'
import './MessageWindow.css'
import { Timeline } from 'flowbite-react';
import { BiSolidUser } from 'react-icons/bi'
import { CiUser } from 'react-icons/ci'

const Message = ({ text, username, self }) => (
    <Timeline.Item>
        <Timeline.Point icon={self ? BiSolidUser : CiUser} />
        <Timeline.Content></Timeline.Content>
        <Timeline.Title>{username}</Timeline.Title>
        <Timeline.Body>{text}</Timeline.Body>
    </Timeline.Item>
)

const MessageWindow = ({ messages = [], username }) => {
    let messageWindow = React.createRef()

    useEffect(() => {
    })
    return (
        <Timeline>
            {messages.slice(-5).map((msg, i) => {
                return <Message key={i} text={msg.text} username={msg.username} self={username === msg.username} />
            })}
        </Timeline>
    )
}

export default MessageWindow
