import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function PrivateRoute({ children })
  {
    const { currentuser } = useAuth()
    if (!currentuser) {
      return <Navigate to='/login'/>
    }
    return children;
  }


