import { async } from '@firebase/util';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import Chat from './Chat';
import MyChat from './MyChat';
import AuthContext from '../../context/auth'

const MsgBody = ({ chatId, friend }) => {
    
    // const {user} = useContext(AuthContext)

    const [chats, setChats] = useState([]);
    
    useEffect(() => {
        const getChat = async () => {
            const chatRef = collection(db, `chatSession/${chatId}/chat`);
            const chatQuery = query(chatRef, orderBy('createdAt', 'desc'));
            const chatDocs = await getDocs(chatQuery);
            let chatArray = []
            chatDocs.forEach(doc => {
                chatArray.unshift(doc.data());
            })
            setChats(chatArray);
            console.log(chatArray);
        }
        getChat();
    }, [])

    return (
        <div className='d-flex flex-column justify-content-end h-100 px-3 py-2'>
            {
                chats.map(chat => chat.from == friend.uid ? <Chat /> : <MyChat />)
            }

        </div>
    );
}

export default MsgBody;
