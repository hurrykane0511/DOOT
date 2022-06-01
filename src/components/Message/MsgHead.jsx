import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

const MsgHead = ({ friend }) => {

    const [status, setStatus] = useState(null);

    useEffect(() => {
        const db = getDatabase();
   
        
        const refb = ref(db, 'users/' + friend.uid);
        const unsub = onValue(refb, (snapshot) => {

            if (snapshot.exists()) {
                setStatus(snapshot.val());
            }
            
        });
     
        return () => unsub();
    }, [friend])

    return (
        <div className='backdrop p-3'>
            <div className="msg_info d-flex align-items-center">
                <div className="msg_avatar">
                    <div className="img-wrap overflow-hidden rounded-pill">
                        <img src={friend.avtUrl} alt="" />
                    </div>
                    {status?.connections ? <div className="status_dot bg-success"></div> : <div className="status_dot bg-danger"></div>}
                  
                </div>
                <div className="ms-2">
                    <div className="name">{friend.name}</div>
                    <div className="msg_status">{status?.connections ? "Active" :
                        <Moment fromNow>{new Date(status?.lastOnline)}</Moment>}</div>
                </div>
            </div>
        </div>
    );
}

export default MsgHead;
