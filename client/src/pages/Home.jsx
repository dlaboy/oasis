import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

function Home() {
  const [loginSuccessfull, setLoginSuccessfull] = useState(false);
  const [loginMessage, setLoginMessage] = useState("")

  const handleLogin = (event) => {
    setLoginSuccessfull(true)
    setLoginMessage("Login Successfull")

    
  }
  
  return (
    <div className='  justify-content-center bg-light  align-items-center d-flex flex-column' style={{height:"100vh"}}>
        <div className="">
            <h1>
            Oasis POS System
            </h1>
        </div>

        {loginSuccessfull ? <div className='d-flex flex-column text-center'>
          <div>{loginMessage}</div>

          <Nav>
            
            <Nav.Link to='/terminal' as={NavLink} className='btn  p-3 '>Terminal</Nav.Link>
            <Nav.Link to='/queue' as={NavLink} className='btn p-3'>Queue</Nav.Link>
        </Nav>
        </div> : <div className='d-flex flex-column'> <input placeholder='Username' name='username' className='shadow m-1' type="text" />  <input placeholder='Password' name='password' className='shadow m-1' type="password" /> <button onClick={handleLogin} className='btn btn-outline-primary rounded-pill'>Login</button> </div> }
        
    </div>
  )
}

export default Home