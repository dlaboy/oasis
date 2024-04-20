import React from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

function Home() {
  return (
    <div className='container  justify-content-center  align-items-center d-flex flex-column' style={{height:"100vh"}}>
        <div className="">
            <h1>
            Oasis POS System
            </h1>
        </div>
        <Nav>
            <Nav.Link to='/terminal' as={NavLink} className='btn  p-3 '>Terminal</Nav.Link>
            <Nav.Link to='/queue' as={NavLink} className='btn p-3'>Queue</Nav.Link>
        </Nav>
    </div>
  )
}

export default Home