import React from 'react';
import { Badge } from 'react-bootstrap';

const Chat = () => {

    return (
        <div className='chat_info d-flex py-2 px-3 active'>
            <div className="position-relative">
                <div className="avatar">
                    <img src="https://cachtrongrausach.vn/this-page-isn-t-working/imager_2_16115_700.jpg" alt="" />
                </div>
                <div className="status"></div>
            </div>
            <div className="info ms-3">
                <div className="name">Hồng ngọc</div>
                <div className="last_message">Me: asdsad</div>
            </div>
            <Badge bg="danger" className='badge position-absolute'>5</Badge>
        </div>
    );
    
}

export default Chat;
