import React from "react";
import Signup from "./Authentication/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Profile from "./Authentication/Profile";
import Login from "./Authentication/Login";
import PrivateRoute from "./Authentication/privateRoute";
import Forgotpassword from './Authentication/Forgotpassword'
import UpdateProfile from "./Authentication/UpdateProfile";
import Dashboard from "./Drive/Dashboard";
function App() {
  return (
        <Router>
        <AuthProvider>
          <Routes>
            <Route exact path='/' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route exact path='/folder/:folderId' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route path='/user' element={<PrivateRoute><Profile /></PrivateRoute>}/>
            <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>} />
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forgot-password' element={<Forgotpassword/>}/>
          </Routes>
        </AuthProvider>
        </Router>
  )
}

export default App;
