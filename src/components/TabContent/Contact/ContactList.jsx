import { get, getDatabase } from 'firebase/database';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { db } from '../../../firebase';
import RequestModal from '../Modal/RequestModal';
import Contact from './Contact';
import './contact.css';
import { ref } from 'firebase/database';

const ContactList = ({ currentUser, setMessage }) => {

    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    
    useEffect(() => {
        const listRef = collection(db, 'users', currentUser.uid, 'listFriend');
        const unsub = onSnapshot(listRef, (docs) => {
            let arrContacts = [];

            docs.forEach(async (doc) => {
                arrContacts.push(doc.data())
            });
       
            setList(arrContacts);
        });

        return () => unsub();
    }, [])

    const handleShowModal = () => {
        setShowModal(true)
    }

    return (
        <div className="contact_list">

            <div className="request_list_header py-4 px-3">

                <div className="tab_title fs-5 mb-3">
                    <span>Contacts </span>
                    <button className='btn shadow-none rounded-pill' onClick={handleShowModal}><AiOutlinePlus /></button>
                </div>

            </div>
            <div className="contacts">
                {
                    list.map(friend => <Contact key={friend.thatListID} friend={friend} setMessage={setMessage}
                    selected={selected} setSelected={setSelected} />)
                }
            </div>
            <RequestModal showModal={showModal} setShowModal={setShowModal} currentUser={currentUser} />
        </div>
    );
}

export default ContactList;
