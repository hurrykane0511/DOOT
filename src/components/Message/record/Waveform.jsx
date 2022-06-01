import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FiPlay, FiPause } from 'react-icons/fi'
import { AiOutlineSend, AiOutlineReload } from 'react-icons/ai';

const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: "#cdedff",
    progressColor: "#1AAFFF",
    scrollParent: false,
    barWidth: 3,
    barRadius: 3,
    responsive: true,
    height: 100,
    normalize: true,
    partialRender: true
});

const Waveform = ({ url, setAudioURL, handleSend, isChat }) => {

    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const timeRef = useRef(null);
    const totalTimeRef = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);


    useEffect(() => {

        if (url) {
            setPlay(false);

            const options = formWaveSurferOptions(waveformRef.current);
            wavesurfer.current = WaveSurfer.create(options);

            wavesurfer.current.load(url);

            wavesurfer.current.on("ready", function () {
                if (wavesurfer.current) {
                    wavesurfer.current.setVolume(volume);
                    setVolume(volume);
                    totalTimeRef.current.textContent = timeCalculator(wavesurfer.current.getDuration());
                }
            });

            wavesurfer.current.on("audioprocess", function (e) {
                timeRef.current.textContent = timeCalculator(e)
            });
            wavesurfer.current.on("finish", function (e) {
                setPlay(false);
            });
            return () => wavesurfer.current.destroy();
        }
    }, [url]);

    const handlePlayPause = () => {
        setPlay(!playing);
        wavesurfer.current.playPause();
    };

    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;

        if (newVolume) {
            setVolume(newVolume);
            wavesurfer.current.setVolume(newVolume || 1);
        }
    };
    const handleColorRange = (e) => {
        var value = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100
        e.target.style.background = 'linear-gradient(to right, #6a5dcae6 0%, #6a5dcae6 ' + value + '%, #fff ' + value + '%, white 100%)'
    }
    const timeCalculator = function (value) {
        let minute = Math.floor(value / 60);
        let second = Math.floor(value - minute * 60);
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    };
    
    return (
        <div className="waveform d-flex flex-column bg-light px-3 py-2 rounded">
            {isChat ?
                <>
                    <p style={{ 'color': 'rgb(118 107 204 / 1)' }} className='text-center'>
                        <span ref={timeRef}>0:00</span>/<span ref={totalTimeRef}></span></p>
                    <div className="d-flex py-1">
                        <div id="waveform" className="w-100" ref={waveformRef} />
                        <div className="controls ms-3">
                            <button className="btn-play" onClick={handlePlayPause}>{playing ? <FiPause /> : <FiPlay />}</button>
                        </div>
                    </div>
                    <div className="volumn_container ps-3">
                        <input type="range" id="volume" name="volume" min="0.01" max="1" step=".025" onInput={handleColorRange}
                            onChange={onVolumeChange}
                            defaultValue={volume} />
                    </div>
                </>
                :
                <>
                    <p style={{ 'color': 'rgb(118 107 204 / 1)' }} className='text-center'>
                        <span ref={timeRef}>0:00</span>/<span ref={totalTimeRef}></span></p>
                    <div className="d-flex py-1">
                        <div id="waveform" className="w-100" ref={waveformRef} />
                        <div className="controls ms-3">
                            <button className="play" onClick={handlePlayPause}>{playing ? <FiPause /> : <FiPlay />}</button>
                        </div>
                    </div>
                    <div className="volumn_container ">
                        <input type="range" id="volume" name="volume" min="0.01" max="1" step=".025" onInput={handleColorRange}
                            onChange={onVolumeChange}
                            defaultValue={volume} />
                    </div>
                    <div className="text-end card-footer bg-transparent mt-2 px-0">
                        <button className="btn btn-record me-2" onClick={() => setAudioURL('')}>Re-record <AiOutlineReload fontSize={16} /></button>
                        <button className="btn btn-send text-light" onClick={() => { handleSend(); setAudioURL(''); }}>Send <AiOutlineSend fontSize={16} color={'#fff'} /></button>
                    </div>
                </>
            }
        </div>
    );
}

export default Waveform;