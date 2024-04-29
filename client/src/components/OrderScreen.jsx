import React, { useSyncExternalStore } from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../context/ItemContext';
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CurrencyFormatter from './CurrencyFormatter';


const LOCAL_NAME_KEY = import.meta.env.VITE_REACT_APP_LOCAL_NAME_KEY;
const LOCAL_TYPE_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TYPE_KEY;
const LOCAL_INGS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_INGS_KEY;
const LOCAL_TOPS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TOPS_KEY;
const LOCAL_QTY_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_QTY_KEY;
const LOCAL_CMTS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_CMTS_KEY;
const LOCAL_ITEM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ITEMS_KEY;
const LOCAL_ORDER_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ORDER_KEY
const LOCAL_PM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_PM_KEY;

function OrderScreen() {


  // RELOAD CHANNEL
  const reloadChannel = new BroadcastChannel('reload-channel');
  
  // USESTATE HOOKS
  const [currentOrders,setCurrentOrders] = useState(null)
  const [metodoModal, showMetodoModal] = useState(false);
  const [itemVisibility, setItemVisibility] = useState({});
  const [editEnable, isEditEnable] = useState({})
  const [orderSubmitted,isOrderSubmited] = useState(false)

  const itemCosts = {
    rolls : 4.00,
    shakes : 5.00,
    banana : 6.00,
    puppy : 3.00
  }


  // CONTEXT
  const {order, setOrder} = useContext( ItemContext )
  const {name, setName} = useContext( ItemContext );
  const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext );
  const { itemCounter, setItemCounter } = useContext( ItemContext );
  const {metodo, setMetodo} = useContext( ItemContext );
  const {newItem, setNewItem} = useContext( ItemContext );
  const {totalToPay,setTotalToPay} = useContext(ItemContext)
  const {type , setType} = useContext( ItemContext);
  const {typeCounter, setTypeCounter} = useContext( ItemContext );


  






  // MODAL HANDLERS
  const handleShow = () => showMetodoModal(true)
  const handleClose = () => showMetodoModal(false)

  // MODAL PAYMENT HANDLER 
    const handlePayment = (event) => {
      if(event.target.value === "ATH"){
          setMetodo("ATH")
      }
      else{
          setMetodo("CASH")
      }
  }

  // USEEFFECT HOOKS

  useEffect(()=>{
    axios.get('/orders').then(response=>{
      // console.log("Response", response.data)
      setCurrentOrders(response.data)
    }).catch(error =>{
      console.log("Error", error)
    })
  },[renderOrdersKey])



  useEffect(()=>{
    setItemCounter(itemCounter + 1)
  },[newItem])
  useEffect(()=>{
    if(orderSubmitted == true){ 
      setNewItem({})
      setOrder({})
      setName("")
      isOrderSubmited(false) 
      
      localStorage.clear()      
    }
  },[orderSubmitted])

  // TOGGLE EDIT 
  const toggleEdit = (itemId) => {
    isEditEnable(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  // TOGGLE VISIBILITY OF ORDER DETAILS
  const toggleVisibility = (itemId) => {
    setItemVisibility(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };
  // DELETE ALL ORDERS IN DB
  const handleOrderClear = async () =>{

    try {
      
      const response = axios.delete("/orders",)
      console.log(response.data)
    } catch (error) {
      console.log("error:", error)
    }

    setRenderOrdersKey(prevKey => prevKey + 1)


    reloadChannel.postMessage({ action: 'reload' });
  }

  // DELETE ITEM FROM ORDER IN DB
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

 
  // POST ORDER TO DB
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
            'payment_method': JSON.parse(localStorage.getItem(LOCAL_PM_KEY)),
            'total': totalToPay
        })

        // const response = await axios.get('/orders');
        console.log('Response:', response.headers);
    } catch(error){
        console.error('Error', error)
    }
    showMetodoModal(false)

    setTotalToPay(0)
    setTypeCounter(typeCounter -1)
    isOrderSubmited(true)
    setRenderOrdersKey(prevKey => prevKey + 1);
    
    reloadChannel.postMessage({ action: 'reload' });

  }
   // DELETE ITEM FROM ORDER IN LOCAL STORAGE
   const handleDeleteItem = (id)=>{
    console.log(order['items'])
    order['items'].map(i=>{
      if(i.item_id === id){
        console.log('deleting item from '+ order['name'] + 'order')
        const updatedOrder = order['items'].filter(i => i.item_id !== id)
        setOrder(previous => ({
          ...previous,
          items: updatedOrder,
        }));
  
        
        localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))

        
        var sumToSubstract = itemCosts[i.type] * i.qty
        
        setTotalToPay(totalToPay - sumToSubstract)
        console.log("Total Updated")
        location.reload()
        
      }
      
      else{
        console.log('item not found')
      }
    })
  }
  // DELETE ORDER FROM CURRENT ORDER IN LOCALSTORAGE
  const handleClear = () => {
    setNewItem({})
    localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
    setOrder({})
    setItemCounter(0)
    setTotalToPay(0)
    setType("")
    setName("")
    setTypeCounter(typeCounter -1)

    setRenderOrdersKey(prevKey => prevKey + 1);

    location.reload()
    
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
  
  // 



  return (
    <div className='m-2 bg-light' style={{height:'95vh',width:'30vw'}}>
        <div    className="">
          <div className="d-flex flex-column text-center">
            <Nav>
              <Nav.Link to='/' as={NavLink} className='btn b p-3   w-100  text-center'>Home</Nav.Link>
            </Nav>
            <div className='d-flex flex-row w-100 justify-content-between p-3 text-start'>
                <div className="">
                Queued Orders
                </div>
                <button className='rounded-3 bg-light border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-2' onClick={handleOrderClear}>Clear</button>
            </div>

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
                    <div className={itemVisibility[order._id] ? 'd-flex  p-3 flex-column':'d-none  flex-column'}>
                      <div className="d-flex flex-column w-100 overflow-scroll bg-secondary-subtle p-3">
                        {order?.items && order.items.map(item =>(
                        <div className="border-bottom border-dark w-100">
                          <div className="d-flex flex-column w-100 justify-content-around">
                            <div className='fw-bold'> Type:  </div> 
                            <div className="">
                              <ul>
                              {item.type}
                              </ul>
                           
                            {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={item.type} />):(<div></div>)}
                                </div> */}
                              </div> 
                          </div>
                          <div className="d-flex flex-column w-100 justify-content-around">
                            <div className="fw-bold">
                              Ingredients: 
                            </div>
                            <ul className="d-flex flex-column">
                              {item && item.ings.map((ing=>(  
                                <li>{ing}
                                {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                </div> */}
                                </li>
                              )))}
                            </ul>
                          </div>
                          <div className="d-flex flex-column w-100 justify-content-around">
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
                          <div className="d-flex flex-column w-100 justify-content-around ">
                            <div className="fw-bold ">
                              Quantity: 
                            </div>
                            <ul className="">
                              {item.qty}
                            
                            </ul>
                          </div>
                          <div className="d-flex flex-column pb-2 w-100 justify-content-around">
                            <div className="fw-bold">
                              Comments: 
                            </div>
                            <ul className="">
                              
                              {item.comments}
                             
                            </ul>
                          </div>
                            
                        </div>
                      ))}
                      </div>
                      <div className="d-flex flex-column bg-light">
                        <div className="fw-bold d-flex flex-row w-100">
                          <div className="">
                            Payment Method:
                          </div>
                          <div className="fw-normal d-flex justify-content-center align-items-center">
                            {order.payment_method}
                          </div>
                        </div>
                        <div className={editEnable[order._id] ? 'd-flex justify-content-center align-items-center h-100 ':'d-none'}>
                          <div className="">
                            <button className='btn btn-primary'onClick={()=>handleUpdate(order._id, order.name, order.items, order.payment_method)} >Save</button>
                          </div>

                        </div>

                      </div>
                      <div className="fw-bold d-flex flex-row w-100 bg-light">
                          <div className="">
                            Total to Pay:
                          </div>
                          <div className="fw-normal d-flex justify-content-center align-items-center">
                            {<CurrencyFormatter value={order.total} />}
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
            <button className='rounded-3 bg-light border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-2' onClick={handleClear}>Clear</button>
          </div>
          <div  className=" w-100  p-3 d-flex flex-column">
              <div className="">
              Client: {name}
              </div>
              <div className="">
              Total: {<CurrencyFormatter value={totalToPay} currency='USD'/>}
              </div>
              {/* <div className="">
              Items In Order: { totalItems }
              </div> */}

          </div>
          <div>
       
            
            <div style={order.items ? {height:'20vh'}: {height:'0vh'}} className="m-3 overflow-scroll ">
              { order ? ( order?.items &&

                order.items.map(item =>  (
                  <div key={item.item_id} className='border-bottom border-dark d-flex flex-row m-2'>
                    <div className="w-100 p-3">
                      <div className="d-flex flex-column">
                        <div className="">
                          Type: 
                        </div>
                        <ul className="">
                          {item.type}
                        </ul>
                      </div>
                      Ingredients
                      <ul className="">
                        {item && item.ings.map((ing=>(  
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
                      <div className="d-flex flex-column">
                        <div className="">
                          Qty: 
                        </div>
                        <ul className="">
                          {item.qty}
                        </ul>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="">
                          Comments: 
                        </div>
                        <ul className="">
                          {item.comments}
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center w-25">
                      <button className="btn text-secondary" onClick={()=>handleDeleteItem(item.item_id)}>
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
          <div className="d-flex align-items-center justify-content-center" >
            <button type='button' onClick={handleShow} className='btn btn-outline-primary rounded-pill p-3'>Send Order</button>
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