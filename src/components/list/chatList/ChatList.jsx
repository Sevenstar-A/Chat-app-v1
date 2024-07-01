import React, { useState } from 'react'
import './chatList.css'

export default function ChatList() {
  const [addMode, setMode] = useState(false)
  const chat_messages = () => {
    const array = []
    for (let index = 0; index < 8; index++) {
      array[index] = index;
    }
    return array

  }
  

  return (
    <div className='chatList'>

      {/* search bar */}
      <div className='search'>
        <div className='search-bar'>
          <img src='/search.png' />
          <input name='search-item' placeholder='Search' />
        </div>
        <img className='add' src={addMode ? '/plus.png' : '/minus.png'}
          onClick={() => setMode(prev => !prev)} />
      </div>

      {chat_messages().map(() => {
        return <div className='item'>
          <img src='/avatar.png' />
          <div className='texts'>
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
      })}
      


    </div>
  )
}
