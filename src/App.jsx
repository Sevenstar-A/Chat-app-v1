import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Detail, List, Chat } from './components'


function App() {
  
  return  <div className='container' >
              <List></List>
              <Chat></Chat>
              <Detail></Detail>
          
            </div>
  
}

export default App
