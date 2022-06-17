import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Moment from 'react-moment';
import { AuthContext } from '../../../context/auth';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { MdBlock } from 'react-icons/md';
import MsgWrap from '../../Message/MsgWrap';
import { getUser } from '../../../resource/Function';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';


const Contact = ({ friend, setMessage, selected, setSelected}) => {
  
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState(null)
    
    const isFirstRun = useRef(true);
    
    useEffect(() => {
        const db = getDatabase();

        const refb = ref(db, 'users/' + friend.thatId);
        const unsub = onValue(refb, (snapshot) => {
            if (snapshot.exists()) {
                setStatus(snapshot.val());
            }
        });

        return () => unsub();
    }, [])

    useEffect(()=>{
        
    },[])

    const handleGotoChat = async () => {

        setMessage(null)

        const userData = await getUser(user.uid);

        const userObj = {
            uid: userData.uid,
            name: userData.name,
            avtUrl: userData.avtUrl
        }

        const friendobj = {
            uid: friend.thatId,
            name: friend.name,
            avtUrl: friend.avtUrl
        }
        
        isFirstRun.current = true

        setMessage(<MsgWrap chatId={friend.chatId} friend={friendobj} user={userObj} isFirstRun={isFirstRun}/>);
      
        setSelected(friend.thatId);
       
    }

    return (
        <div className={`contact d-flex py-2 px-3 ${selected == friend.thatId ? 'active' : null}`} onClick={handleGotoChat}>

            <div className="position-relative d-flex">
                <div className="avatar">
                    <img src={friend.avtUrl} alt="" />
                </div>
                <div className={`status ${status?.connections ? 'bg-success' : 'bg-danger'}`}></div>

            </div>
            <div className="info ms-3">
                <div className="name">{friend.name}</div>
                <div className="invatation">
                    {!status?.connections ?
                        <Moment fromNow date={new Date(status?.lastOnline)} /> :
                        <time>Active</time>}
                </div>
            </div>
            <div className="controls">
                <DropdownButton variant="transparent" drop={'up'} title={<BiDotsVerticalRounded />} id="dropdown-menu-align-end">

                    <Dropdown.Item eventKey="1">Profile <CgProfile /></Dropdown.Item>
                    <Dropdown.Item eventKey="1">Unfriend <AiOutlineUserDelete /></Dropdown.Item>
                    <Dropdown.Item eventKey="2">Block <MdBlock /></Dropdown.Item>

                </DropdownButton>
            </div>

        </div>
    );
}

export default Contact;
