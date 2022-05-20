import React, { useContext, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoIosAttach } from 'react-icons/io';
import { BsMic } from 'react-icons/bs';
import Microphone from './record/Microphone';
import { storage, db, auth } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, arrayUnion, collection, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/auth';
import { set, update } from 'firebase/database';

const MsgForm = ({ chatId, friend }) => {
    const { user } = useContext(AuthContext)

    const [chat, setChat] = useState();
    const [showRecord, setShowRecord] = useState(false);
    const [text, setText] = useState("");
    const [imgs, setImgs] = useState([]);
    const [voice, setVoice] = useState(null);
    const handleShow = () => setShowRecord(true);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newChatRef = doc(collection(db, "chatSession", chatId, "chat"));

        await setDoc(newChatRef, {
            id: newChatRef.id,
            text,
            from: user.uid,
            to: friend.uid,
            createdAt: Timestamp.fromDate(new Date()),
            media: []
        });

        const promises = [];

        for (var i = 0; i < imgs.length; i++) {
            // files.values contains all the files objects
            const file = imgs[i];
            const metadata = {
                contentType: "image/*"
            }
            const storageRef = ref(storage, "images/" + newChatRef.id + "/" + file.name);

            promises.push(uploadBytes(storageRef, file, metadata).then(uploadResult => { return getDownloadURL(uploadResult.ref) }))

        }

        const photos = await Promise.all(promises);
        await updateDoc(newChatRef, { media: photos });

        setText("");
        setImgs([]);
    };

    const setImages = (files) => {
        setImgs(files);
    }

    return (
        <div className="chat-form d-flex p-3">

            <input onChange={(e) => setImages(e.target.files)} id='input_files' type="file" accept="image/*" hidden multiple />

            <label htmlFor='input_files' className='btn btn_chat btn_attach'><IoIosAttach fontSize={20} /></label>
            <button onClick={handleShow} className='btn btn_chat btn_attach me-2 shadow-none'><BsMic fontSize={20} /></button>

            <div className="chat-input-wraper">
                <input id="chat-input" onChange={(e) => setText(e.target.value)} value={text} placeholder="Type your message..."
                    autoComplete="off" type="text" className="form-control form-control-lg chat-input form-control shadow-none" />
            </div>
            <button className='btn btn_send btn_chat shadow-none' onClick={handleSubmit}><IoSend /></button>

            <Microphone show={showRecord} setShow={setShowRecord} chatId={chatId} senderId={user.uid} recieverId={friend.uid} />
        </div>
    );
}

export default MsgForm;
