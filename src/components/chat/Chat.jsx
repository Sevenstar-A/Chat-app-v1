import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import "./chat.css"

export default function Chat() {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [text, setText] = useState("");
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    
    useEffect(()=>{
      // scroll to the last message
      scrollRef.current?.scrollIntoView({behavior: "smooth"});
      
      // focus on the input
      inputRef.current?.focus();
      
    },[])

    

  const handleEmojiClick = e => {
    console.log(e, e.emoji);

    setText(prev => prev + e.emoji);
    setOpenEmoji(false);
  }

  return (
    <div className='chat' >
      <div className="top">
        <div className="user">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem Ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />

        </div>
      </div>


      <div className="center">
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message own">
          
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message own">
          
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>1 min ago</span>
          </div>
        </div>

        {/* use scrollRef on the last item */}
        <div className="message own" ref={scrollRef}>
          
          <div className="texts">
            <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ikFbXGafVdsDDCJAzrvfBg@2x.png" alt="" />
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quisquam quia velit nulla, tempore quae excepturi libero voluptatum accusantium in quo facilis maiores temporibus culpa corporis laudantium, dolor fuga officia!</p>
            <span>2 min ago</span>
          </div>
        </div>



      </div>



      {/* Bottom */}
      <div className="bottom" >
        <div className="icons">
          <img src="/img.png" alt="" />
          <img src="/camera.png" alt="" />
          <img src="/mic.png" alt="" />
        </div>
        <input type="text" ref={inputRef} placeholder='Text' value={text} onChange={e => setText(e.target.value)} />

        <img src="/emoji.png" alt="" className="emoji"
          onClick={() => setOpenEmoji(prev => !prev)} />

        <div className="emoji">
          <EmojiPicker className='picker' open={openEmoji} onEmojiClick={handleEmojiClick} />

        </div>

        <button className="sendButton">Send</button>

      </div>
    </div>
  )
}
