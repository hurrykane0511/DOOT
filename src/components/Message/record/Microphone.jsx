import { Button, Modal } from 'react-bootstrap';
import useRecord from './useRecord';
import { collection, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BsFillRecordCircleFill, BsFillStopFill } from 'react-icons/bs';
import {IoSend} from 'react-icons/io5';

const Microphone = ({ show, setShow, chatId, senderId, recieverId }) => {

    let [audioURL, isRecording, startRecording, stopRecording, blob] = useRecord();

    const handleClose = () => setShow(false);

    const handleSend = async () => {

        const newChatRef = doc(collection(db, "chatSession", chatId, "chat"));

        const audioRef = ref(
            storage,
            `audio/senderId-${new Date().getTime()}`
          );

        const snap = await uploadBytes(audioRef, blob);
        const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

        await setDoc(newChatRef, {
            id: newChatRef.id,
            text: '',
            from: senderId,
            to: recieverId,
            createdAt: Timestamp.fromDate(new Date()),
            media: [],
            audioURL: dlUrl
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
                <Modal.Footer className='justify-content-center'>
                    {audioURL && 
                    <IoSend onClick={handleSend} disabled={isRecording} style={{'lineHeight' : '30px', 'color': 'red'}}
                    className='btn-voice mx-2 border-1 border-danger'  fontSize={30} />}
                    <BsFillRecordCircleFill style={{'lineHeight' : '30px', 'color': 'red'}} className='btn-voice mx-2'
                    fontSize={30} onClick={startRecording} disabled={isRecording}/>
                    <BsFillStopFill onClick={stopRecording} disabled={!isRecording} style={{'lineHeight' : '30px', 'color': 'red'}} 
                    className='btn-voice mx-2 border-1 border-danger' 
                    fontSize={30}/>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default Microphone;