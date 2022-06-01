import { async } from '@firebase/util';
import { collection, getDocs, onSnapshot, orderBy, query, startAt, limit, doc, startAfter } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import MyChat from './MyChat';
import Chat from './Chat';

const MsgBody = ({ friend, user, chats }) => {

    
  

    useEffect(() => {
        document.querySelector('.message_wraper .body').scrollTo({
            behavior: 'smooth',
            top: document.querySelector('.message_wraper .body').scrollHeight
        })
    }, [chats])
    return (
        <div className='msg_container px-3 py-2' >
        <div className="mb-auto"></div>
            {
                chats.map(chat => chat.from == user.uid ? <MyChat key={chat.id} chatObj={chat} user={user} /> :
                    <Chat key={chat.id} chatObj={chat} friend={friend} />)
            }
        </div>
    );
}

export default MsgBody;
