import React,{useRef, useState} from 'react'
import {Form, Button,Card,Alert} from 'react-bootstrap'
import {useAuth } from '../../contexts/AuthContext'
import {Link,useNavigate} from 'react-router-dom'
import CenteredContainer from './CenteredContainer'
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

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const {signup} =useAuth()
  const [error,setError] = useState('')
  const [loading, setloading]=useState(false)
  const navigate=useNavigate()

  async function handlesubmit(e)
  {
    e.preventDefault()
     
    if(passwordRef.current.value!==passwordConfirmRef.current.value)
      return setError("Password do not match")

    try{
      setError('')
      setloading(true)
      await signup(emailRef.current.value,passwordRef.current.value)
      navigate('/')
    } catch {
      setError('Failed to create an account')
    }
    setloading(false)
  }
  return (
    <WrapperStyles>
    <AppBarStyles  position="static" >
    <Typography variant="h2" align="center">S-Drive</Typography>
    </AppBarStyles>
    <CenteredContainer>
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handlesubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} required />
          </Form.Group>
          <br></br>
          <Button disabled ={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
      </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
      Already have an account? <Link to='/login'>Log In</Link>
    </div>
  </CenteredContainer>
  </WrapperStyles>
  )
}
