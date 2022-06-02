import { Modal } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import './modal.css';
import { db } from "../../../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import Notification from './Notification';


const RequestModal = ({ showModal, setShowModal, currentUser }) => {

    const [showToast, setShowToast] = useState(false);
    const [email, setEmail] = useState('');
    const [invatation, setInvatation] = useState('');
    const userRef = collection(db, 'users');

    const btnInvite = useRef(null);
    const handleClose = () => setShowModal(false);

    useEffect(() => {

        const checkEmail = async () => {
            const queryUserSnapshot = query(userRef, where('email', '==', email), where('uid', '!=', currentUser.uid));
            const userDocs = await getDocs(queryUserSnapshot);
            if (userDocs.docs.length) {

                const userData = userDocs.docs.at(0).data();
                const ref = collection(db, `users/${currentUser.uid}/requestSent`);
                const q = query(ref, where('receiver.uid', '==', userData.uid));
                const req = await getDocs(q);

                if (!req.docs.length) {

                    const ref = collection(db, `users/${userData.uid}/requestSent`);
                    const q = query(ref, where('receiver.uid', '==', currentUser.uid));
                    const req = await getDocs(q);

                    if (!req.docs.length) {
                    
                        const listRef = collection(db, `users/${currentUser.uid}/listFriend`);
                        const q1 = query(listRef, where('thatId', '==', userData.uid));
                        const list = await getDocs(q1);

                        if (!list.docs.length) {
                            addEvent();
                        }
                        else{
                            clearEvent();
                        }
                    }
                }
            }
        }
        checkEmail();

        return () => clearEvent();
    }, [email]);

    const addEvent = () => {
        if (btnInvite.current) {
            btnInvite.current.disabled = false
            btnInvite.current.addEventListener("click", handleSendRequest)
        }
    }

    const clearEvent = () => {
        if (btnInvite.current) {
            btnInvite.current.disabled = true
            btnInvite.current.removeEventListener("click", handleSendRequest)
        }
    }


    const handleSendRequest = async () => {

        const queryUserSnapshot = query(userRef, where('email', '==', email));
        const userDocs = await getDocs(queryUserSnapshot);
        const friend = userDocs.docs.at(0).data();
        console.log(invatation);
        try {
            const fColRef = doc(collection(db, `/users/${friend.uid}/requestList`))
            const uColRef = doc(collection(db, `/users/${currentUser.uid}/requestSent`))

            await setDoc(fColRef, {
                sender: {
                    uid: currentUser.uid,
                    name: currentUser.name,
                    avtUrl: currentUser.avtUrl,
                },
                sentRef: uColRef.id,
                reqRef: fColRef.id,
                invatation: invatation,
                createdAt: Timestamp.fromDate(new Date()),
            
            })

            await setDoc(uColRef, {
                receiver: {
                    uid: friend.uid,
                    name: friend.name,
                    avtUrl: friend.avtUrl,
                },
                sentRef: uColRef.id,
                invatation: invatation,
                reqRef: fColRef.id,
                seen: false,
                createdAt: Timestamp.fromDate(new Date()),
   
            })

            setInvatation('');
            setShowToast(true);
            setShowModal(false);
        }
        catch (error) {
            console.log(error);
        }

    }

    const changeInvatation = (e) =>{
        setInvatation(e.target.value);
    }

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='modal-title__custom'>Add Contact</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="mb-3 modal-input">
                        <label htmlFor='modalEmail' className='form-label'>Email</label>
                        <input type={'email'} id={'modalEmail'} className='form-control form-control shadow-none' onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter Email' />
                    </div>

                    <div className="mb-3 modal-input">
                        <label htmlFor='modalInvatationMessage' className='form-label'>Invatation Message</label>
                        <textarea id='modalInvatationMessage' className='form-control form-control shadow-none' onChange={changeInvatation}
                            placeholder='Enter Message' rows={5} />
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-close-custom shadow-none' onClick={handleClose}>
                        Close
                    </button>
                    <button className='btn btn-invite shadow-none' disabled ref={btnInvite}>
                        Invite
                    </button>
                </Modal.Footer>
            </Modal>

            <Notification setShowToast={setShowToast} showToast={showToast} />
        </>
    );
}

export default RequestModal;
