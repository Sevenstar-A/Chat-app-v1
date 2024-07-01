import React from 'react'
import './list.css'
import ChatList from './chatList/ChatList'
import UserInfo from './user/UserInfo'


export default function List() {
  return (
    <div className='list'>
        <UserInfo />
        <ChatList />
    </div>
  )
}
