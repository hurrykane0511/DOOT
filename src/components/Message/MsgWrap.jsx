import React, { useEffect, useRef, useState } from 'react';
import MsgHead from './MsgHead';
import MsgForm from './MsgForm';
import MsgBody from './MsgBody';
import './message.css';
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const MsgWrap = ({ chatId, friend, user, isFirstRun }) => {

    const chatRef = collection(db, `chatSession/${chatId}/chat`);
    const [chats, setChats] = useState([]);
    const chatsRef = useRef([]);

    useEffect(() => {
        
        const getChat = async () => {
            const chatQuery = query(chatRef, orderBy('createdAt', 'desc'), limit(15));
            const chatDocs = await getDocs(chatQuery);
            let chatArray = [];
            chatDocs.forEach(doc => {
                chatArray.unshift(doc.data());
            })
            chatArray.pop();
            chatsRef.current = [...chatArray];
            setChats(chatArray)
            isFirstRun.current = false;
        }

        if (isFirstRun.current) {
            getChat();
        }

    }, [friend])

    useEffect(() => {
        const q = query(collection(db, "chatSession", chatId, "chat"), orderBy('createdAt', 'desc'), limit(1));

        const unsubscribe = onSnapshot(q, (docs) => {
            docs.forEach((doc) => {
                chatsRef.current = [...chatsRef.current, doc.data()]
                setChats(chatsRef.current)
            })
        });

        return () => unsubscribe();
    }, [friend])

    return (
        <div className='message_wraper'>
            <div className="header position-absolute">
                <MsgHead friend={friend} />
            </div>

            <div className="body position-relative" id='bodyChat'>
                <MsgBody friend={friend} user={user} chatId={chatId}  chats={chats} />
            </div>
            
            <div className="footer">
                <MsgForm chatId={chatId} friend={friend} />
            </div>
        </div>
    );
}

export default MsgWrap;





