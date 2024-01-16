import React from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../context/ItemContext';
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const LOCAL_NAME_KEY = import.meta.env.VITE_REACT_APP_LOCAL_NAME_KEY;
const LOCAL_PM_KEY = import.meta.env.VITE_REACT_APP_LOCAL_PM_KEY;




function OrderScreen() {
  
  const [currentOrders,setCurrentOrders] = useState(null)

  const {order, setOrder} = useContext( ItemContext )

  
  const [metodoModal, showMetodoModal] = useState(false);
  
  const handleShow = () => showMetodoModal(true)
  const handleClose = () => showMetodoModal(false)

  

  const {name, setName} = useContext( ItemContext );

  const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext );

  const { itemCounter, setItemCounter } = useContext( ItemContext );

  const {metodo, setMetodo} = useContext( ItemContext );

 


  useEffect(()=>{
    axios.get('/orders').then(response=>{
      console.log("Response", response.data)
      setCurrentOrders(response.data)
    }).catch(error =>{
      console.log("Error", error)
    
    })

    setName("")

  },[renderOrdersKey])



  const {newItem, setNewItem} = useContext( ItemContext );


 

  const [itemVisibility, setItemVisibility] = useState({});
  const [editEnable, isEditEnable] = useState({})

  
  const toggleEdit = (itemId) => {
    isEditEnable(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };


  const toggleVisibility = (itemId) => {
    setItemVisibility(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const reloadChannel = new BroadcastChannel('reload-channel');


  const handleDelete = async (orderId) => {
    try{
      console.log(orderId)
      const response = await axios.delete('/orders',{data:{ id: orderId }})
      console.log('Item deleted:', response.data);
    }
    catch(error){
      console.log('error:', error)
    }

    setRenderOrdersKey(prevKey => prevKey + 1)


    reloadChannel.postMessage({ action: 'reload' });

  }

  const handlePayment = (event) => {
    if(event.target.value === "ATH"){
        setMetodo("ATH")
    }
    else{
        setMetodo("CASH")
    }
}



  // const handleUpdate = async (orderId) =>{
  //   try{
  //     console.log(orderId)
  //     const response = await axios.put('/orders',{data:{id:orderId,order:{}}})

  //   }
  //   catch(error){
  //     console.log('error', error)
  //   }
  // }

  const LOCAL_ITEM_KEY = import.meta.env.VITE_REACT_APP_LOCAL_ITEMS_KEY;
  const LOCAL_ORDER_KEY = import.meta.env.VITE_REACT_APP_LOCAL_ORDER_KEY



  const handleClear = () => {
    setName("")
    setOrder({})
    localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
  }

  const handleDeleteItem = (id)=>{
    console.log(order['items'])
    order['items'].map(i=>{
      if(i._id === id){
        console.log('deleting item from '+ order['name'] + 'order')
        const updatedOrder = order['items'].filter(i => i._id !== id)
        setOrder(updatedOrder)
        localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))

      }
      else{
        console.log('item not found')

      }
    })
    
 
  }

  const handleOrder = async (event) =>{
    setOrder(previous => ({
        ...previous,
        name: JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
        metodo: JSON.parse(localStorage.getItem(LOCAL_PM_KEY))
    }));


    var storedOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
    var storedItems = storedOrder.items;

    try{
        const response = await axios.post('/orders', {
            'name': JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
            'items': storedItems,
            'payment_method': JSON.parse(localStorage.getItem(LOCAL_PM_KEY))
        })

        // const response = await axios.get('/orders');
        console.log('Response:', response.headers);
    } catch(error){
        console.error('Error', error)
    }
    showMetodoModal(false)

    setOrder({})
    setNewItem({})
    setItemCounter(0)


    setRenderOrdersKey(prevKey => prevKey + 1);
    // console.log(renderOrdersKey)




    reloadChannel.postMessage({ action: 'reload' });

}

  return (
    <div className='m-2 bg-secondary-subtle w-25' style={{height:'100vh'}}>
        <div    className="">
          <div className="d-flex flex-column text-center">
            <Nav>
              <Nav.Link to='/' as={NavLink} className='btn b p-3   w-100  text-center'>Home</Nav.Link>
            </Nav>
            <div className='p-3 text-start'>Queued Orders</div>
          </div>
          <div style={{height:'25vh'}} className="overflow-scroll">

            {currentOrders ? (
              <div className='list-group h-100 '> 
                {currentOrders.map(order =>(
                  <div key={order._id} >
                    <div className='list-group-item list-group-item-action p-3 d-flex flex-row justify-content-between'>
                      <button className='btn' onClick={() => toggleVisibility(order._id)}>
                        {order.client_name} 
                      </button>
                      <div className="">
                        {/* <button className='btn text-secondary' onClick={()=>toggleEdit(order._id)}>Edit</button> */}
                        <button className='btn text-secondary' onClick={() => handleDelete(order._id)}>Delete</button>
                      </div>
                    </div>
                    <div className={itemVisibility[order._id] ? 'd-flex bg-primary-subtle p-3 ':'d-none bg-primary-subtle '}>
                      <div className="d-flex flex-column w-100 ">
                        {order.items.map(item =>(
                        <div className=" border-bottom border-dark w-100">
                          <div className="d-flex flex-row">
                            <div className='fw-bold'> Type:  </div> 
                            <div className="">
                            {item.type}
                            {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={item.type} />):(<div></div>)}
                                </div> */}
                              </div> 
                          </div>
                          <div className="d-flex flex-column">
                            <div className="fw-bold">
                              Ingredients: 
                            </div>
                            <ul className="d-flex flex-column">
                              {item.ings.map((ing=>(  
                                <li>{ing}
                                {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                </div> */}
                                </li>
                              )))}
                            </ul>
                          </div>
                          <div className="d-flex flex-column">
                            <div className="fw-bold">
                              Toppings: 
                            </div>
                            <ul className="d-flex flex-column">

                              {item.tops.map((top=>(
                                <li className=''>{top}
                                  {/* <div className="text-secondary">
                                  {editEnable[order._id] ? (<input  className='w-75' defaultValue={top}/>):(<div></div>)}
                                  </div> */}
                                </li>
                              )))}
                            </ul>
                          </div>
                          <div className="d-flex flex-column">
                            <div className="fw-bold">
                              Quantity: 
                            </div>
                            <ul className="col d-flex flex-row w-100 justify-content-between">
                              {item.qty}
                              {/* {editEnable[order._id] ? (
                                <input type="text" className='w-25' defaultValue={item.qty}/>
                              ):( 
                              <div className="col">
                              {item.qty}
                              </div>)
                              } */}
                          </ul>
                          </div>
                          <div className="d-flex flex-column pb-2">
                            <div className="fw-bold">
                              Comments: 
                            </div>
                            <ul className="d-flex flex-column">
                              
                              {item.comments}
                              {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-100' defaultValue={item.comments}/>):(<div></div>)}
                                </div> */}
                            </ul>
                          </div>
                            
                        </div>
                      ))}
                      </div>
                      <div className="d-flex flex-column">
                        <div className="fw-bold d-flex flex-row w-100">
                          <div className="">
                            Payment Method:
                          </div>
                          <div className="fw-normal d-flex justify-content-center align-items-center">
                            {order.payment_method}
                          </div>
                        </div>
                        <div className={editEnable[order._id] ? 'd-flex justify-content-center align-items-center h-100':'d-none'}>
                          <div className="">
                            <button className='btn btn-primary'onClick={()=>handleUpdate(order._id, order.name, order.items, order.payment_method)} >Save</button>
                          </div>

                        </div>

                      </div>
                      
                    </div>
                  </div>
            
                )
                )}
              </div>):(
                <div className="bg-white">No Orders</div>
                
              )
            }
          </div>
        </div>
        <div className="">
          <div className="p-3 d-flex justify-content-between">
            <div>Current Order</div>
            <button className='btn btn-outline-dark p-2' onClick={handleClear}>Clear</button>
          </div>
          <div className="bg-white">
            <div  className=" w-100 shadow p-3 d-flex flex-column">
              <div className="">
              Client: {name}
              </div>
              <div className="">
              Items In Order: { itemCounter }
              </div>
            </div>
            
            <div style={{height:'25vh'}} className="m-3 overflow-scroll ">
              { order.items ? (

                order.items.map(item =>  (
                  <div key={item._id} className='border-bottom border-dark d-flex flex-row m-2'>
                    <div className="w-100 p-3">
                      <div className="">
                        Type: {item.type}
                      </div>
                      Ingredients
                      <ul className="">
                        {item.ings.map((ing=>(  
                                <li>{ing}
                                {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                </div> */}
                                </li>
                              )))}
                      </ul>
                      <div className="">
                        Tops: 
                        <ul>
                            {item.tops.map((top=>(
                                <li className=''>{top}
                                  {/* <div className="text-secondary">
                                  {editEnable[order._id] ? (<input  className='w-75' defaultValue={top}/>):(<div></div>)}
                                  </div> */}
                                </li>
                              )))}
                        </ul>
                      </div>
                      <div className="">
                        Qty: {item.qty}
                      </div>
                      <div className="">
                        Comments: {item.comments}
                      </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center w-25">
                      <button className="btn text-secondary" onClick={()=>handleDeleteItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ):(
                <div className=""></div>
              ) }
              
            
            </div>
            
          </div>
          <div className="d-flex align-items-center justify-content-center h-100">
            <button type='button' onClick={handleShow} className='btn btn-primary p-3'>Send Order</button>
          </div>

          <Modal show={metodoModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                        <Modal.Title>Método de Pago</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='w-100'>
                            <button className="btn btn-warning w-50" onClick={handlePayment} value={"ATH"}>ATH Móvil</button>
                            <button className="btn btn-success w-50" onClick={handlePayment} value={"CASH"}>CASH</button>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleOrder}>
                            Send Order
                        </Button>
                        </Modal.Footer>
                    </Modal>
        </div>

    </div>
  )
}

export default OrderScreen