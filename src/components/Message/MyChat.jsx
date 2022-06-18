import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Moment from 'react-moment';

const MyChat = ({ chatObj, user }) => {

    return (
        <div className='chat_ctn ms-auto'>
            <div className="me-2">
                {
                    chatObj?.media ? <div className="list-image justify-content-end">
                        {
                            chatObj.media.map((img, idx) =>
                                <div key={idx} className="img_wraper">
                                    <img src={img} alt="" />
                                </div>
                            )
                        }
                    </div> : null
                }
                {chatObj?.text ? <p className='mymsg px-2 py-1 m-0 ms-auto me-2 my-2'>{chatObj.text}</p> : null}
                {chatObj?.audioURL ? <ReactAudioPlayer src={chatObj.audioURL} controls /> : null}
                {chatObj?.createdAt ? <Moment className='time d-block text-end w-100' fromNow>{chatObj.createdAt.toDate()}</Moment> : null}

            </div>
            <div className="chat_avatar mt-auto mb-5">
                <div className="img-wrap overflow-hidden rounded-pill">
                    <img src={user?.avtUrl || 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png'} alt="" />
                </div>
            </div>
        </div>
    );

}

export default MyChat;
