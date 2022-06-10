import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import CenteredContainer from "./CenteredContainer"
import { AppBar,Typography } from '@mui/material';
import {styled} from '@mui/system'

const AppBarStyles = styled(AppBar)(({theme}) => ({
  borderRadius: 15,
  margin: '40px 100px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '600px',
  border: '2px solid black',
  [theme.breakpoints.down('xs')]: {
    width: '90%',
  }
}));

const WrapperStyles = styled('div')(({theme}) => ({
  display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
}));

export default function Profile() {
  const [error, setError] = useState("")
  const {logout,currentuser}=useAuth()
  const navigate=useNavigate()
  async function handleLogout() {
    setError("")
    try {
      await logout()
      navigate("/login")
    } catch {
      setError("Failed to log out")
    }
  }
 
  return (
    <WrapperStyles>
    <AppBarStyles  position="static" >
    <Typography variant="h2" align="center">S-Drive</Typography>
    </AppBarStyles>
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentuser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <Link to="/" className="btn btn-primary w-100 mt-3">
            Dashboard
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </CenteredContainer>
    </WrapperStyles>
  )
}