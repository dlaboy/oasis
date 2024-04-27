import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';


const ADMIN_USERNAME = import.meta.env.VITE_REACT_APP_ADMIN_USERNAME
const ADMIN_PASSWORD = import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD

const EMPLOYEE_USERNAME = import.meta.env.VITE_REACT_APP_EMPLOYEE_USERNAME
const EMPLOYEE_PASSWORD = import.meta.env.VITE_REACT_APP_EMPLOYEE_PASSWORD

function Home() {
  
  const [loginSuccessfull, setLoginSuccessfull] = useState(false);
  const [loginMessage, setLoginMessage] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [incorrect,isIncorrect] = useState(false)

  const [admin, isAdmin] = useState(false)

  const handleLogin = (event) => {
    event.preventDefault();
    if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
      isAdmin(true)
      setLoginSuccessfull(true)
    }
    else if(username == EMPLOYEE_USERNAME && password == EMPLOYEE_PASSWORD){
      isAdmin(false)
      setLoginSuccessfull(true)
    }
    else{
      isIncorrect(true)
      setLoginSuccessfull(false)

    }
  }

  const handleUsernameChange = (event) =>{
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) =>{
    setPassword(event.target.value)
    
  }
  
  return (
    <div className='  justify-content-center bg-light  align-items-center d-flex flex-column' style={{height:"100vh"}}>
        <div className="">
            <h1>
            Oasis POS System
            </h1>
        </div>

        {loginSuccessfull ? <div className='d-flex flex-column text-center'>
          <Nav>
            <Nav.Link to='/terminal' as={NavLink} className='btn  p-3 '>Terminal</Nav.Link>
            <Nav.Link to='/queue' as={NavLink} className='btn p-3'>Queue</Nav.Link>
            { admin && <Nav.Link to='/sales' as={NavLink} className='btn p-3'>Sales</Nav.Link>}
            
        </Nav>
        </div> : 
        <div className='d-flex flex-column'> 
            { incorrect && <div className='text-danger text-center'>Incorrect Credentials</div> }
           <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="text" placeholder="Username" className='m-1'value={username} onChange={handleUsernameChange}/>
              <Form.Control type="password" placeholder="Password" className='m-1' value={password} onChange={handlePasswordChange}/>
            </Form.Group>
              <button className='btn btn-outline-primary rounded-pill p-2 w-100' onClick={handleLogin}>Login</button>
          </Form>
        </div> }
        
    </div>
  )
}

export default Home