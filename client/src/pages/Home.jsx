import React, {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { Nav, Button, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import './Home.css'
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';



const ADMIN_USERNAME = import.meta.env.VITE_REACT_APP_ADMIN_USERNAME
const ADMIN_PASSWORD = import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD

const EMPLOYEE_USERNAME = import.meta.env.VITE_REACT_APP_EMPLOYEE_USERNAME
const EMPLOYEE_PASSWORD = import.meta.env.VITE_REACT_APP_EMPLOYEE_PASSWORD

const USERNAME = import.meta.env.VITE_REACT_APP_USERNAME
const PASSWORD = import.meta.env.VITE_REACT_APP_PASSWORD

function Home() {
  
  const [loginSuccessfull, setLoginSuccessfull] = useState(false);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [incorrect,isIncorrect] = useState(false)
  const [admin, isAdmin] = useState(false)


  useEffect(()=>{
    var storedUsername = localStorage.getItem(USERNAME)
    var storedPassword = localStorage.getItem(PASSWORD)
    if (storedUsername != undefined && storedPassword != undefined){
      setUsername(storedUsername)
      setPassword(storedPassword)
      setLoginSuccessfull(true)
      if (storedUsername == 'admin' && storedPassword == 'admin'){
        isAdmin(true)
      }
    }
  },[])

  const handleLogin = (event) => {
    event.preventDefault();
    if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
      isAdmin(true)
      setLoginSuccessfull(true)
      localStorage.setItem(USERNAME,username)
      localStorage.setItem(PASSWORD,password)
      
    }
    else if(username == EMPLOYEE_USERNAME && password == EMPLOYEE_PASSWORD){
      isAdmin(false)
      setLoginSuccessfull(true)
      localStorage.setItem(USERNAME,username)
      localStorage.setItem(PASSWORD,password)
    }
    else{
      isIncorrect(true)
      setLoginSuccessfull(false)

    }
  }

  const handleSignOut = (event) => {
    event.preventDefault();
    setLoginSuccessfull(false)


  }

  const handleUsernameChange = (event) =>{
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) =>{
    setPassword(event.target.value)

  }
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Do something with form data
     const form = e.target;
  const formData = new FormData(form);

  const name = formData.get('name');
  const message = formData.get('message');
    console.log({ name, message });
    console.log('Form submitted!');
    toast.success("Mensaje sometido, Puedes cerrar el menu")
    const response = await axios.post('/sales', {
                        'nombre': name,
                        'mensaje': message, 
    })
    console.log(response)
    
    handleClose();
  };
    
  
  return (
    <div className='  justify-content-center  align-items-center d-flex flex-column home' style={{height:"100vh"}}>
      {/* <div class="overlay"></div> */}
        <div className="">
            <h1 className='fw-bold text-light'>
            Oasis POS System
            </h1>
        </div>

        {loginSuccessfull ? <div className='d-flex flex-column text-center'>
          <Nav>
            <Nav.Link to='/terminal' as={NavLink} className='btn btn-outline-primary text-light m-3'>Terminal</Nav.Link>
            <Nav.Link to='/queue' as={NavLink} className='btn btn-outline-primary text-light m-3'>Queue</Nav.Link>
            <Nav.Link to='https://oasis-i2.herokuapp.com' as={NavLink} className='btn btn-outline-primary text-light m-3'>Inventory</Nav.Link>
            { admin && <Nav.Link to='/ventas' as={NavLink} className='btn btn-outline-primary text-light m-3'>Sales</Nav.Link>}
            {/* {admin && <Nav.Link to='/cameras' as={NavLink} className='btn btn-outline-primary text-light m-3'>Cameras</Nav.Link>} */}
            {/* {admin && <Nav.Link to='/customer' as={NavLink} className='btn btn-outline-primary text-light m-3'>Customers</Nav.Link>} */}
        </Nav>
        <button className='btn rounded-pill btn-outline-light' onClick={handleSignOut}>Sign Out</button>
        
        { admin &&     <div className='mt-5'style={{
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1050 // ensures it's above other content
}}>
      <Button variant="primary" onClick={handleShow}>
        No vas a abrir hoy? Deja registrado porque
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Toaster position="top-right" />
        
        <Modal.Header closeButton>
          <Modal.Title>Motivo de cierre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group  className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="name" type="text" placeholder="Nombre" required />
            </Form.Group>

            <Form.Group name="name" className="mb-3" controlId="formMessage">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control name="message" type="text" placeholder="Mensaje" required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Someter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
      }
        
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