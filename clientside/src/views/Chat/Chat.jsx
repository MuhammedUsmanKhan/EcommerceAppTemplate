import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { collapseSidebar } from "../../store/slices/SidebarSlice";

import TextContainer from '../../Components/TextContainer/TextContainer';
import Messages from '../../Components/Messages/Messages';
import InfoBar from '../../Components/InfoBar/InfoBar';
import Input from '../../Components/Input/Input';

import './Chat.css';

const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

let socket;

const Chat = ({ location }) => {

    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location?.search);

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location?.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }



    return (
        <div className={` ${isCollapsed ? "sm:ml-[15.3rem]" : "ml-[4.3rem]"}`}>
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
}

export default Chat;
