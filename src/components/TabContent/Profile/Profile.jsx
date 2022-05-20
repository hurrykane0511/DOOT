import React, { useContext, useEffect, useState } from 'react';
import './profile.css';
import bgDefaut from '../../../resource/image/bguser.jpg'
import { AiOutlineUser, AiOutlineMail, AiOutlineContacts, AiFillHeart } from 'react-icons/ai';
import { AuthContext } from '../../../context/auth';
import { getUser } from '../../../resource/Function';

const Profile = ({ currentUser }) => {

    const { user } = useContext(AuthContext)

    // useEffect(() => {
    //     getUser(user.uid).then((res) => setUser(res)).catch((error)=> console.log(error));
    // }, [])

    return (
        <div className='profile_wrap'>
            <div className="profile_over_lay" style={{ 'backgroundImage': `url(${currentUser?.bgImg || bgDefaut})` }}></div>

            <div className="profile_infor mb-4">
                <div className="profile_avt mb-2">
                    <img src={currentUser?.avtUrl} alt="" />
                </div>
                <center className="profile_nickname">{currentUser?.name}</center>
                <center className="profile_job">{currentUser?.job || 'Freelancer'}</center>
            </div>
            <div className="profile_other_content px-4 py-4">
                <p className='description_self'>{currentUser?.description || 'No description'}</p>
                <p className='other_infor'><AiFillHeart /> &nbsp;&nbsp;&nbsp;{currentUser?.status || 'Single'}</p>
                <p className='other_infor'><AiOutlineUser /> &nbsp;&nbsp;&nbsp;{currentUser?.name}</p>
                <p className='other_infor email'><AiOutlineMail /> &nbsp;&nbsp;&nbsp;{currentUser?.email}</p>
                <p className='other_infor'><AiOutlineContacts /> &nbsp;&nbsp;&nbsp;{currentUser?.address || 'Unknown'}</p>
            </div>
        </div>
    );


}

export default Profile;
