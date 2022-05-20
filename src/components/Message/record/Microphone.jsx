import { Button, Modal } from 'react-bootstrap';
import useRecord from './useRecord';
import { useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthContext } from '../../../context/auth';

const Microphone = ({ show, setShow, chatId, senderId, recieverId }) => {

    let [audioURL, isRecording, startRecording, stopRecording, blob] = useRecord();

    const handleClose = () => setShow(false);

    const handleSend = async () => {

        const storageRef = ref(storage, `audio/${chatId}-${senderId}-${new Date().toString()}`);
        const linkDownload = uploadBytes(storageRef, blob).then(uploadResult => { return getDownloadURL(uploadResult.ref) })
        const newChatRef = doc(collection(db, "chatSession", chatId, "chat"));

        await setDoc(newChatRef, {
            id: newChatRef.id,
            text: '',
            from: senderId,
            to: recieverId,
            createdAt: Timestamp.fromDate(new Date()),
            voiceUrl: linkDownload,
        });

        setShow(false);
    }

    return (
        <>
            <Modal centered show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>Record</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <div className="text-center"><audio src={audioURL} controls /></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {audioURL && <Button onClick={handleSend} disabled={isRecording}>Send</Button>}
                    <Button onClick={startRecording} disabled={isRecording}>start</Button>
                    <Button onClick={stopRecording} disabled={!isRecording}>Stop</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Microphone;