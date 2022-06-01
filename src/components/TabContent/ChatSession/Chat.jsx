import { getDatabase, onValue, ref } from 'firebase/database';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { AuthContext } from '../../../context/auth';
import { db } from '../../../firebase';
import { getUser } from '../../../resource/Function';
import MsgWrap from '../../Message/MsgWrap';

const Chat = ({ chatInfo, setMessage, setSelected, selected }) => {

    const [friend, setFriend] = useState(null);
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState(null)
    const [numChat, setNumChat] = useState(0)
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (chatInfo?.users.length == 2) {
            chatInfo.users[0].uid !== user.uid ? setFriend(chatInfo.users[0]) : setFriend(chatInfo.users[1]);
        }
       
    }, [friend])

    useEffect(() => {
        if (friend?.uid) {
            const db = getDatabase();
            const refb = ref(db, 'users/' + friend.uid);
            const unsub = onValue(refb, (snapshot) => {
                if (snapshot.exists()) {
                    setStatus(snapshot.val());
                }
            });
            return () => unsub()
        }
    }, [friend])
    
    const handleGotoChat = async () => {
        setMessage(null)

        const userData = await getUser(user.uid);

        const userObj = {
            uid: userData.uid,
            name: userData.name,
            avtUrl: userData.avtUrl
        }

        const friendobj = {
            uid: friend.uid,
            name: friend.name,
            avtUrl: friend.avtUrl
        }

        isFirstRun.current = true
        setMessage(<MsgWrap chatId={chatInfo.chatId} friend={friendobj} user={userObj} isFirstRun={isFirstRun}/>);
        setSelected(chatInfo.chatId);

        await setDoc(doc(db, 'chatSession', chatInfo.chatId),{
            numChat: 0
        }, 
        {
            merge: true
        })
    }

    return (
        <div className={`chat_info d-flex py-2 px-3 align-items-center ${selected == chatInfo.chatId ? 'active' : null}`} onClick={handleGotoChat}>
            <div className="position-relative" >
                <div className="avatar">
                    <img src={friend?.avtUrl ? friend.avtUrl : 'https://cachtrongrausach.vn/this-page-isn-t-working/imager_2_16115_700.jpg'} alt="" />
                </div>
                <div className={`status ${status?.connections ? 'bg-success' : 'bg-danger'}`} ></div>
            </div>
            <div className="info ms-3">
                <div className="name">{friend?.name}</div>
                {chatInfo?.text ?
                    <div className="last_message">{chatInfo?.from == user.uid ? <b>Me: </b> : null} {chatInfo.text}</div> :
                    <div className="last_message">Say hello</div>
                }
                {/* <Moment fromNow style={{ fontSize: 12, marginLeft: 'auto' }}>{chatInfo.createdAt.toDate()}</Moment> */}
            </div>
            {chatInfo.numChat && chatInfo.to == user.uid ? <Badge bg="danger" className='badge position-absolute'>{chatInfo.numChat}</Badge> : null}
        </div>
    );

}

export default Chat;
