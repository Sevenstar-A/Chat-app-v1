import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import upload from '../../lib/upload'
import './login.css'

export default function Login() {

  const [avatar, setAvatar] = useState({ file: null, url: "" })
  const [loading, setLoading] = useState(false);
  const logout = ()=>signOut(auth);
  
  useEffect(() => {
    console.log("rerendering Login Page!")
    
  })

  function LoadingSetter(s,e){
     /**
      * @remarks
      * If true: will disable form inputs
      * If false: will enable form inputs and clear the fields
      * */

    const formElements = Array.from(e.target.elements);
    setLoading(s);
    if (s){
      // clear form inputs
      formElements.filter(ele => { ele.tagName == 'input' || ele.tagName == 'file' })
      formElements.forEach(ele => {
        ele.disabled = true;
      });

    }

    else{
      formElements.filter(ele => { ele.tagName == 'input' || ele.tagName == 'file' })
      formElements.forEach(ele => {
        ele.disabled = false;
        ele.value = '';
      });

      // clear the form without rerendering 
      // document.getElementById('file').value = ''
      document.getElementById('id_avatar').value = ''
      document.getElementById('id_avatar').src = './avatar.png'
    }

  }

  const handleAvatar = e => {
    if (e.target.files) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
    }
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    
    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    try {
      LoadingSetter(true,e);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);
      // creating objects on firestore using setDoc ( doc(db, collection_name, document_id), data:{} )
      await setDoc(
      //doc(db, collection_name, document_id) 
       doc(db, 'users', res.user.uid),
        {
          username,
          email,
          avatar:imgUrl,
          id:res.user.uid,
          blocked:[]
        }
      )

      await setDoc( doc(db, "userchats", res.user.uid), {
        chats:[]
      } )

      toast.success("Account successfully created!")

    }
    catch (error) {
      toast.error("There is an error : " + error)
    }
    finally{
      LoadingSetter(false,e);

    }

  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const {email, password} = Object.fromEntries(formData)
    LoadingSetter(true,e);

    try{
      const login = await signInWithEmailAndPassword(auth,email,password)
      toast.success("Logging in as "+login.user.email)
    }
    catch (e){
      toast.error('Error while login '+e)
    }
    finally{
      LoadingSetter(false,e);
    }
  
    
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name='email' placeholder='Email' />
          <input type="password" name="password" id="password" placeholder='Password' />
          <button disabled={loading}> {loading ? "Logging In" : "Sign In"} </button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an Account</h2>
        <form id="create-form" className="create-form" onSubmit={handleRegister}>
          <label htmlFor="file" className="image-label">
            <img src={avatar.url || "./avatar.png"} className='avatar-image' id='id_avatar' />
            Upload Image
          </label>
          <input type="file" name="image" id="file" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" name="username" id="" placeholder='Username' />
          <input type="text" name="email" id="" placeholder='Email' />
          <input type="password" name="password" id="" placeholder='Password' />
          <button disabled={loading}>Sign Up</button>
        </form>

      </div>

    </div>
  )
}
