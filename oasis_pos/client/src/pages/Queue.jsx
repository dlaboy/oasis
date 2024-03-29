import React from 'react'
import { useEffect, useState , useContext} from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { ItemContext } from '../../context/ItemContext';




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
    

    useEffect(()=>{
    axios.get('/orders').then(response=>{
        console.log("Response", response.data)
        setCurrentOrders(response.data)
    }).catch(error =>{
        console.log("Error", error)

    })

    },[])

    


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
    
    
        location.reload()
        // reloadChannel.postMessage({ action: 'reload' });
    
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



    return (
    <div> 
        <div className="w-100 d-flex flex-row justify-content-between">
            <Nav>
            <Nav.Link to='/' as={NavLink} className='btn  p-3 w-25  text-center'>Home</Nav.Link>
            </Nav>
            <div className="p-3  w-100 text-center">

            <h6>
                Pending Orders

            </h6>
            </div>
            <button className='btn btn-outline-dark p-2' onClick={handleOrderClear}>Clear</button>

        </div>
         {currentOrders ? (
        <div className='list-group h-100'> 
            {currentOrders.map(order =>(
                <div className="d-flex justify-content-between align-items-center flex-column list-group-item list-group-item-action p-3">
                    <div className="d-flex flex-row w-100 justify-content-between align-items-center">

                    <button key={order._id} className='btn' onClick={() => toggleVisibility(order._id)}>{order.client_name}</button>
                    <button className="btn text-secondary" onClick={()=>handleDelete(order._id)}>
                        Delete
                    </button>
                    </div>
                    <div className={itemVisibility[order._id] ? 'd-flex bg-primary-subtle p-3 w-100':'d-none bg-primary-subtle '}>
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
            ))}
        </div>):(
            <p>No Orders</p>
        )
        }
    </div>
    )
}

