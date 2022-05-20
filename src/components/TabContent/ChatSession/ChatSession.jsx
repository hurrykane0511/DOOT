import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import RequestModal from '../Modal/RequestModal';
import Chat from './Chat';
import './chatsession.css';

const ChatSession = ({ currentUser }) => {

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () =>{
        setShowModal(true)
    }
    return (

        <div className='chat_session_wrap'>

            <div className="chat_session_header px-3 pt-4">

                <div className="tab_title fs-5 mb-3">
                    <span>Chats</span>
                    <button className='btn shadow-none rounded-pill' onClick={handleShowModal}><AiOutlinePlus /></button>
                </div>

                <div className="input-group mb-3 search-input">
                    <input type="text" className="form-control bg-light border-0 shadow-none pe-0" placeholder="Search here.."
                        aria-label="Example text with button addon" aria-describedby="searchbtn-addon" />
                    <button type="button" id="searchbtn-addon" className="btn btn-light btn btn-secondary shadow-none"> <AiOutlineSearch /></button>
                </div>
                
            </div>

            <div className="chat_container pt-4">
                <Chat />
            </div>
            <RequestModal showModal={showModal} setShowModal={setShowModal} currentUser={currentUser} />
        </div>
    );
}

export default ChatSession;
