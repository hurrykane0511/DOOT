import { useEffect, useState } from "react";

const useRecord = () => {

    const [audioURL, setAudioURL] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [blob, setBlob] = useState(null);

    useEffect(() => {
        // Lazily obtain recorder first time we're recording.
        if (recorder === null) {
            if (isRecording) {
                requestRecorder().then(setRecorder, console.error);
            }
            return;
        }

        // Manage recorder state.
        if (isRecording) {
            recorder.start();
        } else {
            recorder.stop();
        }

        let chunks = [];

        const handleData = e => {
            chunks.push(e.data);
            if (recorder.state == 'inactive') {
                let blob = new Blob(chunks, { 'type': 'audio/webm' })
                setBlob(blob);
                setAudioURL(URL.createObjectURL(blob));
            }
        };

        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    return [audioURL, setAudioURL, startRecording, stopRecording, blob];

};

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
}


export default useRecord;