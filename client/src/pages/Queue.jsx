import React from 'react'
import { useEffect, useState , useContext} from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Nav, Button, Modal } from 'react-bootstrap'
import { ItemContext } from '../../context/ItemContext';
import CurrencyFormatter from '../tools/CurrencyFormatter'




export default function Queue() {
    const [currentOrders,setCurrentOrders] = useState(null)

    const reloadChannel = new BroadcastChannel('reload-channel');

    reloadChannel.onmessage = (event) => {
        if (event.data.action === 'reload') {
          // Reload the page in response to the message
          location.reload();
        }
      };

    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext );
    const {newOrderCounter, increaseNewOrderCounter} = useContext(ItemContext);

    

    useEffect(()=>{
    axios.get('/orders').then(response=>{
        console.log("Response", response.data)
        setCurrentOrders(response.data)
    }).catch(error =>{
        console.log("Error", error)

    })

    },[])
    useEffect(()=>{
    axios.get('/orders').then(response=>{
      console.log("Response", response.data)
      setCurrentOrders(response.data)
    }).catch(error =>{
        console.log("Error", error)

    })

    },[newOrderCounter])

    


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
    
    
        setDeleteShow(false)
        location.reload()
        // reloadChannel.postMessage({ action: 'reload' });
    
      }

      const handleDone = async (order) => {
        var request_data;
        if (order.status == 'done'){
          request_data = {
            id:order._id,
            updated_record: {
              client_name: order.client_name,
              items: order.items,
              payment_method: order.payment_method,
              total: order.total,
              status: 'in progress'
            }
          }
        }
        else if (order.status == 'in progress'){
          var request_data = {
            id:order._id,
            updated_record: {
              client_name: order.client_name,
              items: order.items,
              payment_method: order.payment_method,
              total: order.total,
              status: 'done'
            }
          }
        }
        try {
          const response = await axios.put(`/orders/`,request_data);
          console.log('Order status updated successfully:', response.data);
          location.reload()
        } catch (error) {
          console.error('Failed to update order status:', error);
        }
        location.reload()
      }

      const handleOrderClear = async () =>{

        try {
          
          const response = axios.delete("/orders",)
          console.log(response.data)
        } catch (error) {
          console.log("error:", error)
        }
    
        setRenderOrdersKey(prevKey => prevKey + 1)
    
        location.reload()
        
      }
    

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
  const [idToDelete,setIDtoDelete] = useState(0);
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = (orderId) => {
    setDeleteShow(true);
    setIDtoDelete(orderId)
  }





    return (
    <div> 
        <Modal show={deleteShow} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Deleting Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>Warning, you're about to delete an order!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={()=>handleDelete(idToDelete)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="w-100 d-flex flex-row justify-content-between">
            <Nav>
            <Nav.Link to='/' as={NavLink} className='btn  p-3 w-25  text-center'>Home</Nav.Link>
            </Nav>
            <div className="p-3  w-100 text-center">

            <h6>
                Pending Orders

            </h6>
            </div>
            <div className=""><img src="" alt="" /></div>
            {/* <button className='btn btn-outline-secondary p-2' onClick={handleOrderClear}>Clear</button> */}

        </div>
         {currentOrders ? (
        <div className='list-group h-100'> 
            {currentOrders.map(order =>(
                <div className={order.status == 'done' ? "d-flex bg-success-subtle  justify-content-between align-items-center flex-column list-group-item list-group-item-action p-3":"d-flex justify-content-between align-items-center flex-column list-group-item list-group-item-action p-3"}>
                    <div className="d-flex flex-row w-100 justify-content-between align-items-center">

                    <button key={order._id} className='btn' onClick={() => toggleVisibility(order._id)}>{order.client_name}</button>
                    <button  className="btn text-secondary" onClick={()=>handleDeleteShow(order._id)}>Delete</button>
                    
                    {/* <button className="btn text-secondary" onClick={()=>handleDelete(order._id)}>
                        Delete
                    </button> */}
                    <button className="btn text-secondary" onClick={()=>handleDone(order)}>
                        Toggle Status
                    </button>
                    </div>
                    <div className={itemVisibility[order._id] ? 'd-flex flex-column bg-secondary-subtle p-3 w-100':'d-none bg-secondary-subtle '}>
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
                        {item && item.type !== 'drinks' && (
                            <div className="fw-bold">
                              Ingredients:
                            </div>
                          )}
                          <ul className="d-flex flex-column">
                            {item.type !== 'drinks'&&item.ings.map((ing=>(  
                              <li>{ing}
                              {/* <div className="text-secondary">
                              {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                              </div> */}
                              </li>
                            )))}
                          </ul>
                        </div>
                        <div className="d-flex flex-column">
                        {item && item.type !== 'drinks' && (
                            <div className="fw-bold">
                              Toppings:
                            </div>
                          )}
                          <ul className="d-flex flex-column">

                            {item.type !== 'drinks'&& item.tops.map((top=>(
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
                      <div className="fw-bold d-flex flex-row w-100">
                        <div className="">
                          Total:
                        </div>
                        <div className="fw-normal d-flex justify-content-center align-items-center">
                              <CurrencyFormatter value={order.total} />
                        </div>
                      </div>
                      <div className="fw-bold d-flex flex-row w-100">
                        <div className="">
                          Status:
                        </div>
                        <div className="fw-normal d-flex justify-content-center align-items-center">
                          {order.status}
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
            ))}
        </div>):(
            <p>No Orders</p>
        )
        }
    </div>
    )
}

