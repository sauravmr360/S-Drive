import React from "react"
import { Navbar, Nav,Container } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"

export default function NavbarComponent() {
   const {currentuser}=useAuth()
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container style={{ marginLeft:"1rem" }}>
      <Navbar.Brand as={Link} to="/">
        <img alt="" src="/logo192.png" width="30" height="30" className="d-inline-block align-top"/>
         &nbsp;&nbsp;S Drive
      </Navbar.Brand>
    </Container>
      <Navbar.Collapse className="justify-content-end" style={{ marginRight:"1rem" }}>
        <Nav.Link as={Link} to="/user">
         <h6>{currentuser.email}</h6>
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}