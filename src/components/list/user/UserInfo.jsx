import React from 'react'
import "./userInfo.css"

export default function UserInfo() {
  return (
    <div className='userInfo'>
        <div className='user'>
          <img src='/avatar.png'/>
          <h3>John Doe</h3>
        </div>
        <div className='icons'>
          <img src='/more.png' />
          <img src='/video.png' />
          <img src='/edit.png' />
        </div>
    </div>
  )
}
