import React from 'react';
import { ToastContainer, Toast, ProgressBar } from 'react-bootstrap';

const Notification = ({showToast, setShowToast}) => {

    return (
        <ToastContainer className='custom_toast'>
            <Toast  onClose={() => setShowToast(false)} show={showToast} autohide delay={1000}>
                <Toast.Header className='bg-success text-light' >
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto" >Sent success</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>
                    <p>Thanks for your request</p>
                    <ProgressBar variant="success" animated striped  now={60} />
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default Notification;
