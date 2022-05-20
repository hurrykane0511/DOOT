import React, { useContext, useEffect, useState } from 'react';
import MsgHead from './MsgHead';
import MsgForm from './MsgForm';
import MsgBody from './MsgBody';
import './message.css';

const MsgWrap = ({ chatId, friend }) => {

    return (
        <div className='message_wraper'>
            <div className="header position-absolute">
                <MsgHead friend={friend} />
            </div>
            <div className="body  overflow-auto">
                <MsgBody friend={friend} chatId={chatId}  />
            </div>
            <div className="footer">
                <MsgForm chatId={chatId} friend={friend}  />
            </div>
        </div>
    );
}

export default MsgWrap;





