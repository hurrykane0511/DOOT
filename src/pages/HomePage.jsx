import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import SideBar from '../components/Sidebar/SideBar';

import TabContent from '../components/TabContent/TabContent';
import MsgWrap from '../components/Message/MsgWrap';
import bg from '../resource/image/bg.png';

const HomePage = () => {

    const { user } = useContext(AuthContext);

    const [tabContent, setTabContent] = useState(null);
    const [message, setMessage] = useState(null);

    if (user)
        return (

            <div className="homepage_visual">
                <div className="sidebar">
                    <SideBar setTabContent={setTabContent} setMessage={setMessage} />
                </div>
                <div className="chat-leftsidebar">
                    <TabContent tabContent={tabContent} />
                </div>
                <main>
                    <div className="bg" style={{ 'backgroundImage': `url("${bg}")` }}></div>
                    <div className="user-chat" style={{ 'zIndex': 99 }}>
                        {message ? message : null}
                    </div>

                </main>
            </div>

        );
    else return <Navigate to={'login'} />
}

export default HomePage;
