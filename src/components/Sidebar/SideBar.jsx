import React, { useContext, useEffect, useState } from 'react';
import { CgProfile, CgUserList } from 'react-icons/cg';
import { TiMessages } from 'react-icons/ti';
import { IoIosContacts } from 'react-icons/io';
import { FaReact } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLogin, AiFillSetting } from 'react-icons/ai'
import './sidebar.css';
import { AuthContext } from '../../context/auth';
import { getUser } from '../../resource/Function';
import { Badge, DropdownButton } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { ref, set } from 'firebase/database';
import { collection, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import Profile from '../TabContent/Profile/Profile';
import ChatSession from '../TabContent/ChatSession/ChatSession';
import RequestList from '../TabContent/RequestList/RequestList';
import ContactList from '../TabContent/Contact/ContactList';

const SideBar = ({ setTabContent, setMessage }) => {

    const imgDefault = "https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png";
    const [active, setActive] = useState('profile');
    const { user } = useContext(AuthContext);
    const [currentUser, setUser] = useState(null);
    const navigate = useNavigate()
    const [requestQuantity, setRequestQuantity] = useState(0);

    useEffect(() => {
        getUser(user.uid)
            .then((res) => {
                setUser(res);
                setTabContent(<Profile currentUser={res} />)
            })
            .catch((err) => console.log(err.message));

    }, [user])

    useEffect(() => {
        const ref = collection(db, `users/${user.uid}/requestList`);
        const unsub = onSnapshot(ref, (docs)=>{
            setRequestQuantity(docs.docs.length);
        })
        return ()=> unsub();
    }, [])

    const handleSignout = async () => {

        await updateDoc(doc(db, "users", user.uid), {
            lastOnline: Timestamp.fromDate(new Date())
        });

        await signOut(auth);

        set(ref(`users/${user.uid}/isOnline`), false);
        set(ref(`users/${user.uid}/lastOnline`), Timestamp.fromDate(new Date()));
        navigate('login')
    };

    const handleProfileClick = () => {
        setActive('profile')
        setTabContent(<Profile currentUser={currentUser} />)

    }

    const handleMessagesClick = () => {
        setActive('messages')
        setTabContent(<ChatSession currentUser={currentUser} />)
    }

    const handleRequestListClick = () => {
        setActive('requestlist')
        setTabContent(<RequestList currentUser={currentUser} />)
    }

    const handleContactClick = () => {
        setActive('contacts')
        setTabContent(<ContactList currentUser={currentUser} setMessage={setMessage} />)
    }

    const handleSettingClick = () => {
        setActive('settings')
    }

    return (
        <div className='sidebar_wrapper'>
            <Link className='sidebar_logo' to='/'><FaReact /></Link>
            <ul className='list-tab-icon' style={{ 'listStyle': 'none' }}>
                <li className={`chat-tab ${active === 'profile' ? 'active' : null}`} onClick={handleProfileClick}>
                    <CgProfile />
                </li>
                <li className={`chat-tab ${active === 'messages' ? 'active' : null}`} onClick={handleMessagesClick}>
                    <TiMessages />
                </li>
                <li className={`chat-tab ${active === 'requestlist' ? 'active' : null}`} onClick={handleRequestListClick}>
                    <CgUserList />
                    { requestQuantity ? <Badge pill bg="danger">{requestQuantity}</Badge> : null }
                </li>
                <li className={`chat-tab ${active === 'contacts' ? 'active' : null}`} onClick={handleContactClick}>
                    <IoIosContacts />
                </li>
                <li className={`chat-tab ${active === 'settings' ? 'active' : null}`} onClick={handleSettingClick}>
                    <AiFillSetting />
                </li>
            </ul>
            <DropdownButton
                id={`sidebar_user_list`}
                drop={'up'}
                variant="transparent"
                style={{ 'padding': '0 !important' }}
                title={
                    <div className='sidebar-user'>
                        <img src={currentUser?.avtUrl || imgDefault} alt="" />
                    </div>
                }>
                <Dropdown.Item className='sidebar_user_action' eventKey="1" onClick={handleSignout}>Logout <AiOutlineLogin /></Dropdown.Item>
                <Dropdown.Item className='sidebar_user_action' eventKey="2" onClick={handleProfileClick}>Profile <CgProfile /></Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='sidebar_user_action' eventKey="3" onClick={handleSettingClick}>Setting <AiFillSetting /></Dropdown.Item>
            </DropdownButton>
        </div>
    );
}

export default SideBar;
