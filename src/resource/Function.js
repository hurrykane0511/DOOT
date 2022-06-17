import { doc, getDoc,setDoc } from "firebase/firestore";
import { db } from "../firebase";


const CustomError = (error_code) => {

    switch (error_code) {
        case "auth/invalid-email":
            return "Email is invalid"
        case "auth/internal-error":
            return "Email or password is wrong"
        case "auth/email-already-exists":
            return "Email already exists"
        case "auth/missing-email":
            return "Email not exists"
        default:
            return error_code
    }

}


async function getUser(uid) {
    const ref = doc(db, "users", uid);
    const userDoc = await getDoc(ref);
    return userDoc.data();
}

const updateProfle = async (uid, user) =>{
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        name: user.name,
        avtUrl: user.avtUrl,
    }, {
        merge: true
    })
}

const updateFriendInList = async (uid, friend) => {

}
export { CustomError, getUser, updateProfle }