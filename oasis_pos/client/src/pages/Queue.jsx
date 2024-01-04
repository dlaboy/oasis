import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'



export default function Queue() {
    const [currentOrders,setCurrentOrders] = useState(null)

    const reloadChannel = new BroadcastChannel('reload-channel');

    reloadChannel.onmessage = (event) => {
        if (event.data.action === 'reload') {
          // Reload the page in response to the message
          location.reload();
        }
      };

    useEffect(()=>{
    axios.get('/orders').then(response=>{
        console.log("Response", response.data)
        setCurrentOrders(response.data)
    }).catch(error =>{
        console.log("Error", error)

    })

    },[])



    return (
    <div>  {currentOrders ? (
        <div className='list-group h-100'> 
            {currentOrders.map(order =>(
                <button key={order._id} className='list-group-item list-group-item-action p-3'>{order.client_name}</button>
            ))}
        </div>):(
            <p>No Orders</p>
        )
        }</div>
    )
}

