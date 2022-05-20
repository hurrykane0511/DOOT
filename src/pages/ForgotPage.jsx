import { async } from '@firebase/util';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineArrowRight, AiFillLock, AiFillInstagram, AiFillFacebook, AiFillGoogleCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { CustomError } from '../resource/Function';

const ForgotPage = () => {


    const [email, setEmail] = useState('');
    const [load, setLoad] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await sendPasswordResetEmail(auth, email)

        } 
        catch (err) {
            setError(CustomError(err.code))
        }
    }

    return (
        <div className="container">
            <div className="screen">
              
                <div className="screen__content">
                    <form className="login" onSubmit={handleSubmit}>
                        <div className="login__field" >
                            <AiOutlineUser className="login__icon fas fa-user" />
                            <input type="text" className="login__input" autoComplete='off' placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <button className="button login__submit" type='submit'>
                            {
                                load ? "Loading" : <><span className="button__text">Send request</span>
                                    <AiOutlineArrowRight className="button__icon fas fa-chevron-right" /></>
                            }
                        </button>
                        <div className="red"></div>
                    </form>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4" />
                    <span className="screen__background__shape screen__background__shape3" />
                    <span className="screen__background__shape screen__background__shape2" />
                    <span className="screen__background__shape screen__background__shape1" />
                </div>
                <div className="bottom-link">
                    <Link to={'/login'}>Back to login ?</Link>
                </div>
                {error ? <div className='display__err'>{error}</div> : null}
            </div>
        
        </div>
    );
}

export default ForgotPage;
