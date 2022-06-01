import { Modal } from 'react-bootstrap';
import React from 'react';
import { useEffect } from 'react';
import { MdCallEnd } from 'react-icons/md';

const ModalVideoCall = ({ call, setCall, friend }) => {

    const handleClose = () => {
        setCall(false);
    }
    useEffect(() => {

    }, [])

    return (
        <>
            <Modal
                show={call}
                onHide={handleClose}
                backdrop="static"
                centered
                keyboard={false}
            >
                <div className="call_box">

                    <div className="image-container overflow-hidden">
                        <img src={friend.avtUrl} className='w-100' alt="" />
                    </div>
                    <div className="call_box-footer w-100">
                        <button className='hang-up'><MdCallEnd /></button>
                    </div>

                </div>

            </Modal>
        </>

    );
}

export default ModalVideoCall;
