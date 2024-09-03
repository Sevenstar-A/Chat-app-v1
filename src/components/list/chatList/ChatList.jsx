import React, { useEffect, useState } from 'react'
import './chatList.css'
import AddUser from './addUser/AddUser'
import { useUserStore } from '../../../lib/userStore'
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useChatStore } from '../../../lib/useChatStore'

export default function ChatList() {
  const [addMode, setMode] = useState(false)
  const [userChats, setChats] = useState([])
  const { currentUser, } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const ref = doc(db, "userchats", currentUser.id)
    const unSub = onSnapshot(ref, async (res) => {
      const userChatsList = res.data().chats

      const promises = userChatsList.map(async (userChat) => {
        const userRef = doc(db, "users", userChat.receiverId)
        const userDoc = await getDoc(userRef)
        const user = userDoc.data();
        return { ...userChat, user }

      });

      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));

      return () => { unSub() };

    })
  }, [currentUser.id])

  async function handleSelectChat(chat) {
    changeChat(chat.chatId, chat.user);
    const chats = userChats.map(item => {
      const { user, ...rest } = item; //
      return rest // select the chat objects only
    })

    // get the selected chat item
    const selectedIndex = chats.findIndex(i => { return i.chatId == chat.chatId })
    
    // Update the isSeen property of the selected
    chats[selectedIndex].isSeen = true

    // now save the updated 
    try {
      const userChatRef = doc(db, "userchats", currentUser.id)
      await updateDoc(userChatRef, {
        chats: chats
      })
    }
    catch (error) {
      console.log("Error while updating isSeen property of selected chat!")

    }




  }



  return (
    <div className='chatList'>

      {addMode && <AddUser />}

      {/* search bar */}
      <div className='search'>
        <div className='search-bar'>
          <img src='/search.png' />
          <input name='search-item' placeholder='Search' />
        </div>
        <img className='add' src={addMode ? '/minus.png' : '/plus.png'}
          onClick={() => setMode(prev => !prev)} />
      </div>

      {userChats.map((chat) => {
        return <div key={chat.chatId}
          style={chat.isSeen ? { background: "transparent" } : { background: "#5183fe" }}
          className={chatId == chat.chatId ? "item selected" : "item"}
          onClick={() => { handleSelectChat(chat) }}

        >
          <img src={chat.user.avatar || '/avatar.png'} />
          <div className='texts' >
            <span>{chat.user.username}</span>
            <p>{chat?.lastMessage }</p>
          </div>
        </div>
      })}



    </div>
  )
}
