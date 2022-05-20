import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Moment from 'react-moment';

const MyChat = () => {
    return (
        <div className='chat_ctn ms-auto'>
            <div className="me-2">
                <div className="list-image justify-content-end">
                    <div className="img_wraper">
                        <img src="https://rietveld-ict.nl/wp-content/uploads/2014/01/users.png" alt="" />
                    </div>
                    <div className="img_wraper">
                        <img src="https://rietveld-ict.nl/wp-content/uploads/2014/01/users.png" alt="" />
                    </div>
                </div>
                <p className='mymsg px-2 py-1 m-0 ms-auto me-2 my-2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quidem dolores voluptate, nam impedit ea cum beatae rerum at dignissimos doloribus ipsum maxime corporis cupiditate praesentium obcaecati vero deserunt voluptas!</p>
                <ReactAudioPlayer className='ms-auto d-block'
                    src="my_audio_file.ogg"
                    autoPlay
                    controls
                />
                <Moment className='time d-block text-end w-100'></Moment>
            </div>
            <div className="chat_avatar mt-auto">
                <div className="img-wrap overflow-hidden rounded-pill">
                    <img src="http://ativn.edu.vn/wp-content/uploads/2018/03/user.png" alt="" />
                </div>
                <div className="status_dot"></div>
            </div>
        </div>
    );
}

export default MyChat;
