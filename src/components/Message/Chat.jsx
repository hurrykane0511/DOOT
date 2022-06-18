import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Moment from 'react-moment';

const Chat = ({ chatObj, friend  }) => {

    const [stt, setStatus] = useState(null);

    useEffect(() => {
        const db = getDatabase();

        const refb = ref(db, 'users/' + friend.uid);
        const unsub = onValue(refb, (snapshot) => {
            if (snapshot.exists()) {
                setStatus(snapshot.val());
            }
        });

        return () => unsub();
    }, [])

   

    return (
        <div className='chat_ctn'>
            <div className="chat_avatar mt-auto mb-4">
                <div className="img-wrap overflow-hidden rounded-pill">
                    <img src={friend?.avtUrl || 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png'} alt="" />
                </div>
                {stt?.connections ? <div className="status_dot bg-success"></div> : <div className="status_dot bg-danger"></div>}
            </div>

            <div className="ms-2">
                {
                    chatObj?.media ? <div className="list-image">
                        {
                            chatObj.media.map((img, idx) =>
                                <div key={idx} className="img_wraper ">
                                    <img src={img} className='img-thumbnail' alt=""/>
                                </div>
                            )
                        }
                    </div> : null
                }
                {chatObj?.text ? <p className='msg px-2 py-1 m-0 me-auto me-2 my-2'>{chatObj.text}</p> : null}
                {chatObj?.audioURL ? <ReactAudioPlayer src={chatObj.audioURL} controls /> : null}
                <Moment className='time d-block text-start w-100' fromNow>{chatObj?.createdAt.toDate()}</Moment>
            </div>

        </div>
    );
}

export default Chat;
