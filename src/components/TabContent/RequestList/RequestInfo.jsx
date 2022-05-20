import { get, getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { TiTick } from 'react-icons/ti';
import { GrFormClose } from 'react-icons/gr';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../../context/auth';
import { db } from '../../../firebase';
import { getUser } from '../../../resource/Function';

const RequestFriend = ({ requestInfo }) => {

    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const db = getDatabase();
        const refb = ref(db, 'users/' + requestInfo.sender.uid);

        const unsub = onValue(refb, (snapshot) => {
            if (snapshot.exists()) {
                setStatus(snapshot.val());
            
            }
        });

        return () => unsub();
    }, [])

    const handleAccept = async () => {

        const uFriendRef = doc(collection(db, 'users', user.uid, 'listFriend'));
        const fFriendRef = doc(collection(db, 'users', requestInfo.sender.uid, 'listFriend'));
        const newChatRef = doc(collection(db, `chatSession`));

        const userData = await getUser(user.uid);
  
        await setDoc(uFriendRef, {
            thisListID: uFriendRef.id,
            thatListID: fFriendRef.id,
            name: requestInfo.sender.name,
            avtUrl: requestInfo.sender.avtUrl,
            thisId: user.uid,
            thatId: requestInfo.sender.uid,
            chatId: newChatRef.id
        })

        await setDoc(fFriendRef, {
            thisListID: fFriendRef.id,
            thatListID: uFriendRef.id,
            name: userData.name,
            avtUrl: userData.avtUrl,
            thisId: requestInfo.sender.uid,
            thatId: user.uid,
            chatId: newChatRef.id
        })
     
        await setDoc(newChatRef, {
                      chatId: newChatRef.id,
                      users: [user.uid, requestInfo.sender.uid],
                      
                  });

        const reqRef = doc(db, 'users', user.uid, 'requestList', requestInfo.reqRef);
        const sentRef = doc(db, 'users', requestInfo.sender.uid, 'requestSent', requestInfo.sentRef);

        deleteDoc(reqRef);
        deleteDoc(sentRef);
    }

    const handleSkip = () => {

        const reqRef = doc(db, 'users', user.uid, 'requestList', requestInfo.reqRef);
        const sentRef = doc(db, 'users', requestInfo.sender.uid, 'requestSent', requestInfo.sentRef);

        deleteDoc(reqRef);
        deleteDoc(sentRef);

    }

    return (
        <div className='request_info d-flex py-4 px-3 active'>
            <div className="position-relative d-flex">
                <div className="avatar">
                    <img src={requestInfo?.sender.avtUrl} alt="" />
                </div>
                <div className={`status ${status?.connections ? 'bg-success' : 'bg-danger'}`}></div>

            </div>
            <div className="info ms-3">
                <div className="name">{requestInfo?.sender.name}</div>
                <div className="invatation">{requestInfo.invatation || "Can you be my friend ?"}</div>
                <Moment className='request_time' fromNow date={requestInfo.createdAt.toDate()} />
            </div>
            <div className="controls">
                <button className='btn-skip me-1' onClick={handleSkip}><GrFormClose fontSize={16} /></button>
                <button className='btn-accept' onClick={handleAccept}><TiTick  fontSize={16}/></button>
            </div>
        </div>
    );
}

export default RequestFriend;
