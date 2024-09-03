import { useEffect, useState } from 'react'
import { Detail, List, Chat, Login, Notification } from './components'
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore, } from './lib/userStore'
import { useChatStore } from './lib/useChatStore';
function App() {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore()
  useEffect(() => {
    // onAuthStateChanged is an authentication listener from firebase
    const unSub = auth.onAuthStateChanged(user=>{
      console.log("App.jsx : Logged in user : ", user?.email);
      fetchUserInfo(user?.uid);
      
    })

    return () => {
      unSub();
    }

  }, [fetchUserInfo])

  useEffect(()=>{
    console.log("updated user store : ", useUserStore.getState())
      // Expose the store to the global window object
      if (process.env.NODE_ENV === 'development') {
        window.userStore = useUserStore.getState();
      }
  },[currentUser,isLoading,fetchUserInfo])

  if (isLoading) return <div style={{ background: 'blue', color: 'white', padding: "20px", borderRadius: "10px" }}>Loading ... </div>

  return <div className='container' >
    {/* if there is a user go to chat page else go to login page */}
    {currentUser ?
      <>
        <List></List>
        {/* If there is a selected chat, show chat and user detail sections */}
        {chatId ?
          <>
            <Chat></Chat>
            <Detail></Detail>
          </> :
          <div style={{ padding: "40px 10px" }}>Select Chat</div>
        }

      </> :
      // Else show Login page
      <Login />

    }
    <Notification />


  </div>

}

export default App
