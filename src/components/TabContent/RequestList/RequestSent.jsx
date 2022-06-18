import { getDatabase, onValue, ref } from 'firebase/database';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { AuthContext } from '../../../context/auth';
import { db } from '../../../firebase';

const RequestSent = ({ request }) => {

    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const db = getDatabase();
        const refb = ref(db, 'users/' + request.receiver.uid);

        const unsub = onValue(refb, (snapshot) => {
            if (snapshot.exists()) {
                setStatus(snapshot.val());
            }
        });

        return () => unsub();
    }, [])



    const handleSkip = () => {

        const reqRef = doc(db, 'users', request?.receiver.uid, 'requestList', request.reqRef);
        const sentRef = doc(db, 'users', user.uid, 'requestSent', request.sentRef);

        deleteDoc(reqRef);
        deleteDoc(sentRef);
    }

    return (
        <div className='request_info d-flex py-4 px-3 active'>
            <div className="position-relative d-flex">
                <div className="avatar">
                    <img src={request?.receiver.avtUrl || 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png'} alt="" />
                </div>
                <div className={`status ${status?.connections ? 'bg-success' : 'bg-danger'}`}></div>

            </div>
            <div className="info ms-3">
                <div className="name">{request?.receiver.name}</div>
                <div className={'invatation'}>{status?.connections ? 'online' : 'offline'}</div>
                <Moment className='request_time' fromNow date={request?.createdAt.toDate()} />
                {/* <Moment className='request_time' fromNow date={listSent.createdAt.toDate()} /> */}
            </div>
            <div className="controls">
                <button className='btn-skip' onClick={handleSkip}>Skip</button>
            </div>
        </div>
    );
}

export default RequestSent;
