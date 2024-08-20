import React from 'react'
import "./userInfo.css"
import { useUserStore } from '../../../lib/userStore';

export default function UserInfo() {

  const {currentUser} = useUserStore(); 
  return (
    <div className='userInfo'>
        <div className='user'>
          <img src={currentUser.avatar || './avatar.png'} />
          <h3>{currentUser.username}</h3>
        </div>
        <div className='icons'>
          <img src='/more.png' />
          <img src='/video.png' />
          <img src='/edit.png' />
        </div>
    </div>
  )
}
