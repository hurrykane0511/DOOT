import React from 'react';
import Moment from 'react-moment';

const Chat = () => {
    
    return (
        <div className='chat_ctn'>

            <div className="chat_avatar mt-auto">
                <div className="img-wrap overflow-hidden rounded-pill">
                    <img src="http://ativn.edu.vn/wp-content/uploads/2018/03/user.png" alt="" />
                </div>
                <div className="status_dot"></div>
            </div>

            <div className="ms-2">
                <div className="list-image ">
                    <div className="img_wraper">
                        <img src="https://rietveld-ict.nl/wp-content/uploads/2014/01/users.png" alt="" />
                    </div>
                    <div className="img_wraper">
                        <img src="https://rietveld-ict.nl/wp-content/uploads/2014/01/users.png" alt="" />
                    </div>
                </div>
                <p className='msg px-2 py-1 m-0 me-auto me-2 my-2'>Hello kitty</p>
                <Moment className='time d-block text-start w-100'></Moment>
            </div>

        </div>
    );
}

export default Chat;
