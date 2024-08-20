import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchUserChats(uid){

    const docRef = doc(db,"userchats",uid)
    const userchats = await getDoc(docRef)
    return userchats

}
