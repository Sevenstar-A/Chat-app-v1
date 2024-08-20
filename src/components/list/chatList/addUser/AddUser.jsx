import React, { useState } from 'react'
import "./addUser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/userStore';

export default function AddUser() {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore()


    const handleSearch = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get('username')

        try {
            const userRef = collection(db, "users")
            const q = query(userRef, where("username", "==", username))
            const querySnapShot = await getDocs(q)
            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }

        } catch (error) {
            console.log("Searching user error : ", error)

        }

    }

    const handleAddUser = async () => {
        const chatRef = collection(db, "chats")
        const userChatsRef = collection(db, "userchats")

        const newChatRef = doc(chatRef)
        await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: []
        })

        await updateDoc(doc(userChatsRef, user.id),
            {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })

            })

        await updateDoc(doc(userChatsRef, currentUser.id),
            {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })

            })




    }
    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" name="username" id="" placeholder='Username' />
                <button>Search User</button>
            </form>
            <>
                {

                    user && <div className="user">
                        <div className="detail">
                            <img src={user.avatar || "./avatar.png"} alt="" />
                            <span>{user.username || "Name"}</span>
                        </div>
                        <button onClick={handleAddUser}>Add User</button>
                    </div>

                }
            </>


        </div>
    )
}
