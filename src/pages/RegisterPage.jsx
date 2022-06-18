import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineArrowRight, AiFillLock, AiOutlineMail } from 'react-icons/ai';
import { AuthContext } from '../context/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
const RegisterPage = () => {

    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [err, setErr] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {

            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                pass
            );

            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                avtUrl: 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png',
                createdAt: Timestamp.fromDate(new Date()),
            });

            setEmail('');
            setName('');
            setErr(null);

            navigator('/login')

        } catch (err) {
            setErr(err);
        }
    }

    if (!user)
        return (
            <div className="container_">

                <div className="screen">
                    <div className="screen__content" onSubmit={handleSubmit}>
                        <form className="login">
                            <div className="login__field">
                                <AiOutlineUser className="login__icon fas fa-user" />
                                <input type="text" className="login__input" placeholder="Nick Name" autoComplete='off' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="login__field">
                                <AiOutlineMail className="login__icon fas fa-user" />
                                <input type="text" className="login__input" placeholder="Email" autoComplete='off' onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="login__field">
                                <AiFillLock className="login__icon fas fa-lock" />
                                <input type="password" className="login__input" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
                            </div>
                            <button className="button login__submit">
                                <span className="button__text">Sign Up Now</span>
                                <AiOutlineArrowRight className="button__icon fas fa-chevron-right" />
                            </button>
                        </form>
                    </div>

                    <div className="screen__background">
                        <span className="screen__background__shape screen__background__shape4" />
                        <span className="screen__background__shape screen__background__shape3" />
                        <span className="screen__background__shape screen__background__shape2" />
                        <span className="screen__background__shape screen__background__shape1" />
                    </div>

                    <div className="bottom-link">
                        <Link to={'/login'}>Already have an account ?</Link>
                    </div>
                    {err ? <div className='display__err'>{err}</div> : null}
                </div>
            </div>
        );

    else return <Navigate to={'/'} />
}

export default RegisterPage;
