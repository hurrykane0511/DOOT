import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoIosAttach } from 'react-icons/io';
import { BsMic } from 'react-icons/bs';
import Microphone from './record/Microphone';
import { storage, db, auth } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, arrayUnion, collection, doc, getDoc, increment, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/auth';
import { push, set, update } from 'firebase/database';
import { Promise } from 'bluebird';
import { IoMdClose } from 'react-icons/io';
import { getUser } from '../../resource/Function'


const MsgForm = ({ chatId, friend }) => {
    const { user } = useContext(AuthContext)
    const [userData, setUserData] = useState(null);
    const [showRecord, setShowRecord] = useState(false);
    const [text, setText] = useState("");
    const [imgs, setImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);
    const chatRef = doc(db, "chatSession", chatId);

    useEffect(() => {
        return () => (async () => {
            const u = await getUser(user.uid)
            setUserData(u)
            setText("");
            setImgs([]);
        })();
    }, [friend])

    const handleShow = () => setShowRecord(true);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setText("");
        setImgs([]);
        setPreviewImgs([]);
        imgInputRef.current.value = null;
        if (!text.trim() && !imgs.length) {
            return;
        }

        const newChatRef = doc(collection(db, "chatSession", chatId, "chat"));

        const promises = [];
        for (let i = 0; i < imgs.length; i++) {
            // files.values contains all the files objects
            const file = imgs[i];
            const metadata = {
                contentType: "image/*"
            }
            const storageRef = ref(storage, "images/" + newChatRef.id + "/" + file.name);

            promises.push(uploadBytes(storageRef, file, metadata).then(uploadResult => { return getDownloadURL(uploadResult.ref) }))
        }
        const photos = await Promise.all(promises);
        await setDoc(newChatRef, {
            id: newChatRef.id,
            text,
            from: user.uid,
            to: friend.uid,
            createdAt: Timestamp.fromDate(new Date()),
            media: [...photos],
            audioURL: ''
        });

        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
            await setDoc(chatRef, {
                text,
                from: user.uid,
                to: friend.uid,
                createdAt: Timestamp.fromDate(new Date()),
                unseenUser: friend.uid,
                numChat: increment(1),
                audioURL: ''
            }, {
                merge: true
            })
        }
        else {
            await setDoc(chatRef, {
                chatId,
                text,
                from: user.uid,
                to: friend.uid,
                createdAt: Timestamp.fromDate(new Date()),
                unseenUser: friend.uid,
                numChat: increment(1),
                audioURL: '',
                users: [
                    {
                        uid: friend.uid,
                        name: friend.name,
                        avtUrl: friend.avtUrl
                    },
                    {
                        uid: userData.uid,
                        name: userData.name,
                        avtUrl: userData.avtUrl,
                    }]
            }, {
                merge: true
            })
        }
     

    };

    const setImages = (e) => {

        let files = [...e.target.files];

        let previewImg = files.map(file =>{
            return URL.createObjectURL(file)
        });
        
        setPreviewImgs(previewImg);
        setImgs(files)
       
    }

    const handleRemoveImage = (src, id) => {
        setPreviewImgs(images => images.filter((img) => { return img != src }));
        setImgs(images => images.filter((img, i) => { return i != id }))
        imgInputRef.current.value = null;
    }

    const Image = ({ src, id }) => {
        return (
            <div className="position-relative me-4">
                <div className="close-btn" onClick={() => handleRemoveImage(src, id)}><IoMdClose /></div>
                <img src={src} className='rounded-3' style={{ height: 100 }} alt="" />
            </div>
        );
    }

    const focusForm = async () => {
        await setDoc(chatRef, {
            numChat: 0
        }, {
            merge: true
        })
    }
    const imgInputRef = useRef(null)
    return (
        <div className={` border-1 px-3 pb-4 pt-2 ${previewImgs.length ? 'bg-white' : null}`}>
            {
                previewImgs.length ? <div className='preview-image px-4 py-2 d-flex'>
                    {
                        previewImgs.map((src, i) => <Image key={src} src={src} id={i} />)
                    }
                </div> : null
            }
            <form className="chat-form d-flex" onSubmit={handleSubmit} onFocus={focusForm}>

                <input onInput={(e) => setImages(e)} id='input_files' type="file" accept="image/*" ref={imgInputRef} hidden multiple />

                <label htmlFor='input_files' className='btn btn_chat btn_attach'><IoIosAttach fontSize={20} /></label>
                <div onClick={handleShow} className='btn btn_chat btn_attach me-2 shadow-none'><BsMic fontSize={20} /></div>

                <div className="chat-input-wraper">
                    <input id="chat-input" required onChange={(e) => setText(e.target.value)} value={text} placeholder="Type your message..."
                        autoComplete="off" type="text" className="form-control form-control-lg chat-input form-control shadow-none" />
                </div>

                <button className='btn btn_send btn_chat shadow-none ms-2' type='submit' onClick={handleSubmit}><IoSend /></button>
            </form>

            <Microphone show={showRecord} setShow={setShowRecord} chatId={chatId} senderId={user.uid} recieverId={friend.uid} />

        </div>
    );
}

export default MsgForm;
