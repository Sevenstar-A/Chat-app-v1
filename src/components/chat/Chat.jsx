import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import "./chat.css"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/useChatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';
import { format } from "timeago.js";


export default function Chat() {
  const [chat, setChat] = useState();
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [imgFile, setImgFile] = useState({ file: null, url: "" })


  useEffect(() => {
    // scroll to the last message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // focus on the input
    inputRef.current?.focus();
  }, [])

  useEffect(() => {
    console.log("Rendering Chat Detail Page")
    const ref = doc(db, "chats", chatId)
    const unSub = onSnapshot(ref, (res) => {
      setChat(res.data());
    })

    return () => {
      unSub();
    }
  }, [chatId])



  const handleEmojiClick = e => {
    console.log(e, e.emoji);
    setText(prev => prev + e.emoji);
    setOpenEmoji(false);
  }

  const handleImageSelect = e => {
    if (e.target.files) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(e.target.files[0])
      console.log(file, " ", url)
      setImgFile({ file, url })
    }
    else {
      alert("no image selected")
    }

  }

  const removeImg = () => {
    if (confirm("Are you sure you want to remove this img?")) {
      setImgFile({ file: null, url: "" })
    }
  }

  const handleSend = async () => {
    if (text !== "" || imgFile.file) {
      try {
        let uploadImgUrl = null
        if (imgFile.file){
          uploadImgUrl = await upload(imgFile.file);
        }

        await updateDoc(doc(db, "chats", chatId,), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text: text,
            createdAt: Date.now(),
            img: uploadImgUrl  
          })
        })
      }
      catch (error) {
        console.log(error)
      }

      const userIds = [currentUser.id, user.id]
      userIds.forEach(async (user_id) => {

        const userChatRef = doc(db, "userchats", user_id)
        const snapShot = await getDoc(userChatRef)
        // snapShot => {chats [ {chatId, lastMessage, receiverId, updatedAt, isSeen}, ...]}
        if (snapShot.exists()) {
          const snapShotData = snapShot.data();
          // this is the id of the chat, from all the user chats
          const index = snapShotData.chats.findIndex(i => i.chatId == chatId)

          snapShotData.chats[index].lastMessage = text
          snapShotData.chats[index].updatedAt = Date.now()
          snapShotData.chats[index].isSeen = user_id == currentUser.id ? true : false

          await updateDoc(userChatRef, {
            chats: snapShotData.chats
          })

        }

      })


    }

    setText("");
    setImgFile({file:null, url:""})

  }


  return (
    <div className='chat' >
      <div className="top">
        <div className="user">
          <img src={user.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />

        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => (
          ((message.text !== "" && message.text !== "None") || (message.img != null)  ) && <>
            <div
              className={
                message.senderId === currentUser?.id ? "message own" : "message"
              }
              key={message.createAt}
            >
              <div className="texts">
                {message?.img && <img src={message.img} alt="" />}
                {message?.text && <p>{message.text}</p>}
                <span>{format(message.createdAt)}</span>
              </div>
            </div>
          </>

        ))}

        {/* img selector */}
        {
          imgFile.file &&
          <div className='sent-img-container'>
            <img src="/cancel.png" alt=""  className='cancel-img' onClick={removeImg} />
            <img src={imgFile.url} alt=""  className='img-to-sent' onClick={() => {window.open(imgFile.url)}} />
          </div>
        }


      </div>

      {/* Bottom */}

      <div className="bottom" >

        <div className="icons">
          <input id='id_img' name="img_file" type='file' style={{ display: 'none' }} onChange={handleImageSelect} />
          <label htmlFor='id_img'>
            <img src="/img.png" alt="" />
          </label>
          <img src="/camera.png" alt="" />
          <img src="/mic.png" alt="" />
        </div>
        <input type="text" ref={inputRef} placeholder='Text' value={text} onChange={e => setText(e.target.value)} />

        <img src="/emoji.png" alt="" className="emoji"
          onClick={() => setOpenEmoji(prev => !prev)} />

        <div className="emoji">
          <EmojiPicker className='picker' open={openEmoji} onEmojiClick={handleEmojiClick} />
        </div>

        <button className="sendButton" onClick={handleSend}>Send</button>

      </div>
    </div>
  )
}
