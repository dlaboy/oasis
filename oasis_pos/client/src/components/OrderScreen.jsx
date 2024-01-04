import React from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../context/ItemContext';



function OrderScreen() {
  
  const [currentOrders,setCurrentOrders] = useState(null)

  const {order, setOrder} = useContext( ItemContext )

  

  const {name, setName} = useContext( ItemContext );

  const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext );



  useEffect(()=>{
    axios.get('/orders').then(response=>{
      console.log("Response", response.data)
      setCurrentOrders(response.data)
    }).catch(error =>{
      console.log("Error", error)
    
    })

    setName("")

  },[renderOrdersKey])



 

 

  const [itemVisibility, setItemVisibility] = useState({});

  const toggleVisibility = (itemId) => {
    setItemVisibility(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };


  return (
    <div className='m-2 bg-secondary-subtle w-25' style={{height:'100vh'}}>
        <div    className="">
          <p>Queued Orders</p>
          {currentOrders ? (
            <div className='list-group h-100'> 
              {currentOrders.map(order =>(
                <div key={order._id}>
                  <button className='list-group-item list-group-item-action p-3' onClick={() => toggleVisibility(order._id)}>{order.client_name}</button>
                  <div className={itemVisibility[order._id] ? 'd-flex':'d-none'}>
                    {order.payment_method}
                  </div>
                </div>
          
              )
              )}
            </div>):(
              <p>No Orders</p>
            )
          }
        </div>
        <div className="">
          <p>Current Order</p>
          <div  className="">
            {name}
          </div>
          <div className="">
            { order.items ? (

              order.items.map(item =>  (
                <div key={item._id}>
                  <div className="">
                    {item.type}
                  </div>
                  <div className="">
                    {item.ings}
                  </div>
                  <div className="">
                    {item.tops}
                  </div>
                  <div className="">
                    {item.qty}
                  </div>
                  <div className="">
                    {item.comments}
                  </div>
                </div>
              ))
            ):(
              <div className=""></div>
            ) }
            
           
          </div>
        </div>

    </div>
  )
}

export default OrderScreen