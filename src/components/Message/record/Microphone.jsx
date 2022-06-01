import { Button, Modal } from 'react-bootstrap';
import useRecord from './useRecord';
import { collection, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './Microphone.css';
import Waveform from "./Waveform";


const Microphone = ({ show, setShow, chatId, senderId, recieverId }) => {

    let [audioURL, setAudioURL, startRecording, stopRecording, blob] = useRecord();

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

    const handleRecord = (e) => {
        if (e.target.checked) {
            startRecording()
        }
        else {
            stopRecording()
        }
    }

    return (

        <Modal centered show={show} className='record-area' onHide={handleClose}>

            {audioURL ? <Waveform url={audioURL} handleSend={handleSend} setAudioURL={setAudioURL} isChat={false}/> : null}

            {
                !audioURL ?
                    <div className="frame" hidden={false}>

                        <input type="checkbox" name="toggle" id="record-toggle" onChange={handleRecord} />

                        <svg viewBox="0 0 100 100" className='mic-svg'>
                            <circle cx="50%" cy="50%" r={45} className="circle-svg" />
                        </svg>
                        <div className="mic">
                            <div className="mic__head" />
                            <div className="mic__neck" />
                            <div className="mic__leg" />
                        </div>
                        <div className="recording">
                            <div className="round" />
                            <div className="round" />
                            <div className="round" />
                        </div>
                        <label htmlFor="record-toggle" className="toggle-label" />
                    </div> : null
            }

        </Modal>

    );
}

export default Microphone;