import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineArrowRight, AiFillLock, AiFillGithub, AiFillFacebook, AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, GithubAuthProvider, getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { AuthContext } from '../context/auth';
import { doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'; import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BiRefresh } from "react-icons/bi";
import { CustomError, getUser } from '../resource/Function';
import { update } from 'firebase/database';

const LoginForm = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [err, setErr] = useState(null);
    const [load, setLoad] = useState(false);

    const handleSignInWithGithub = async () => {
        const provider = new GithubAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const userData = getUser(result.user.uid)
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name: userData?.name || result.user.displayName,
                email: userData?.email || result.user.email,
                avtUrl: userData?.avtUrl || result.user.photoURL,
                createdAt: userData?.createdAt || Timestamp.fromDate(new Date()),
            });
            navigate('/');
        }
        catch (error) {
            setErr(CustomError(error.code))
        }

    }

    const handleSignInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userData = getUser(result.user.uid)

            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name: userData?.name || result.user.displayName,
                email: userData?.email || result.user.email,
                avtUrl: userData?.avtUrl || result.user.photoURL,
                createdAt: userData?.createdAt || Timestamp.fromDate(new Date()),
            });

            navigate('/');
        }
        catch (error) {
            setErr(CustomError(error.code))
        }
    }

    const handleSignInWithFacebook = async () => {

        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userData = getUser(result.user.uid)
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name: userData?.name || result.user.displayName,
                email: userData?.email || result.user.email,
                avtUrl: userData?.avtUrl || result.user.photoURL,
                createdAt: userData?.createdAt || Timestamp.fromDate(new Date()),
            });
            navigate('/');
        }
        catch (error) {
            setErr(CustomError(error.code))
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoad(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass)
            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            });
            setEmail('');
            setPass('');
            setLoad(false);
        }
        catch (error) {
            setErr(CustomError(error.code))
            setLoad(false)
        }

    };


    if (!user)
        return (
            <div className="container_">
                <div className="screen">

                    <div className="screen__content">

                        <form className="login" onSubmit={handleSubmit}>
                            <div className="login__field">
                                <AiOutlineUser className="login__icon fas fa-user" />
                                <input type="text" className="login__input" autoComplete='off' placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="login__field">
                                <AiFillLock className="login__icon fas fa-lock" />
                                <input type="password" className="login__input" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
                            </div>
                            <button className="button login__submit" type='submit'>
                                {
                                    load ? <>Loading... <BiRefresh className='wheel' fontSize={30} /></> :
                                        <><span className="button__text">Log In Now</span>
                                            <AiOutlineArrowRight className="button__icon fas fa-chevron-right" /></>
                                }
                            </button>
                            <div><Link className='link-forgot-pass' to={'/forgot'}>Forgot password</Link></div>
                        </form>
                        <div className="social-login">
                            <h3>log in via</h3>
                            <div className="social-icons">
                                <a href="#" onClick={handleSignInWithGithub} className="social-login__icon fab fa-instagram"><AiFillGithub /></a>
                                <a href="#" onClick={handleSignInWithFacebook} className="social-login__icon fab fa-facebook"><AiFillFacebook /></a>
                                <a href="#" onClick={handleSignInWithGoogle} className="social-login__icon fab fa-twitter"><AiFillGoogleCircle /></a>
                            </div>
                        </div>
                    </div>
                    <div className="screen__background">
                        <span className="screen__background__shape screen__background__shape4" />
                        <span className="screen__background__shape screen__background__shape3" />
                        <span className="screen__background__shape screen__background__shape2" />
                        <span className="screen__background__shape screen__background__shape1" />
                    </div>
                    <div className="bottom-link">
                        <Link to={'/register'}>Create new account ?</Link>
                    </div>
                    {err ? <div className='display__err'>{err}</div> : null}
                </div>

            </div>

        );
    else return <Navigate to={'/'} />
}

export default LoginForm;
