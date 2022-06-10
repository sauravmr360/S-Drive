import React, { useContext, useEffect, useState } from 'react'
import {auth} from '../firebase'
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { sendPasswordResetEmail,updatePassword,updateEmail } from 'firebase/auth'
const AuthContext= React.createContext()

export  function useAuth()
{
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
  
  const [currentuser, setcurrentuser]= useState()
  const [loading, setloading]=useState(true)

  function signup(email, password)
  {
   return createUserWithEmailAndPassword(auth,email,password)
  }
  
  function login(email,password)
  {
    return signInWithEmailAndPassword(auth,email,password)
  }

  function logout()
  {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth,email)
  }

  
  function updateemail(email) {
    return updateEmail(currentuser,email)
  }

  function updatepassword(password) {
    return updatePassword(currentuser,password)
  }

 useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(user)=>{
      setcurrentuser(user)
      setloading(false)
    })
    return unsubscribe
  },[])
  const value={
      currentuser,
      signup,
      login,
      logout,
      resetPassword,
      updateemail,
      updatepassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
