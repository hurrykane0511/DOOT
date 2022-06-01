import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import RequestModal from '../Modal/RequestModal';
import { AiOutlinePlus } from 'react-icons/ai';
import './requestlist.css'
import RequestFriend from './RequestInfo';
import RequestSent from './RequestSent';

const RequestList = ({ currentUser }) => {
    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState([]);
    const [listSent, setListSent] = useState([]);

    useEffect(() => {

        const ref = collection(db, `users/${currentUser.uid}/requestList`);

        const unsub = onSnapshot(ref, (docs) => {
            let reqs = [];
            docs.forEach((doc) => {
                reqs.push(doc.data());
            })
            setList(reqs);
        });

        return () => unsub();
    }, [])

    useEffect(() => {

        const ref = collection(db, `users/${currentUser.uid}/requestSent`);

        const unsub = onSnapshot(ref, (docs) => {
            let reqs = [];
            docs.forEach((doc) => {
                reqs.push(doc.data());
            })
            setListSent(reqs);
        });

        return () => unsub();
    }, [])

    const handleShowModal = () => {
        setShowModal(true)
    }
    return (
        <div className='request_list'>

            <div className="request_list_header py-4 px-3">

                <div className="tab_title fs-5 mb-3">
                    <span>Requests List</span>
                    <button className='btn shadow-none rounded-pill' onClick={handleShowModal}><AiOutlinePlus /></button>
                </div>

            </div>
            <div className="request_list_items">
                {
                    list.length ? list.map((elm) => <RequestFriend key={elm.sender.uid} requestInfo={elm} />)
                        : <div className="px-4">
                            Request Friend is Empty
                            <hr />
                        </div>
                }

            </div>

            <div className="request_list_header py-4 px-3">

                <div className="tab_title fs-5 mb-3">
                    <span>Requests Sent</span>
                </div>

            </div>
            <div className="request_list_items">
                {
                    listSent.length ? listSent.map(request =>
                        <RequestSent key={request?.receiver.uid} request={request} />
                    ) : <div className="px-4">
                        Request Sent is Empty
           
                    </div>
                }
            </div>
            <RequestModal showModal={showModal} setShowModal={setShowModal} currentUser={currentUser} />

        </div>
    );
}

export default RequestList;
