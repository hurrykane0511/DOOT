import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import Loading from '../components/loading/Loading';
import { Timestamp } from "firebase/firestore";
import { getDatabase, ref, onDisconnect, onValue, push, get, set, serverTimestamp } from "firebase/database";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
        });
        
        if (user?.uid) {

            const db = getDatabase();
            const lastOnlineRef = ref(db, `users/${user.uid}/lastOnline`);
            const connectionRef = ref(db, `users/${user.uid}/connections`);
            const connectedRef = ref(db, '.info/connected');
    
            onValue(connectedRef, (snap) => {
                if (snap.val() === true) {

                    const con = push(connectionRef);
                    onDisconnect(con).remove();
                    set(con, true);
                    onDisconnect(lastOnlineRef).set(serverTimestamp());
                   
                }
            });
        }

    }, [user]);


    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );

};

export default AuthProvider;

