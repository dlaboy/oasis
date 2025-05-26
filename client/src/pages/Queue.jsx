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

    // reloadChannel.onmessage = (event) => {
    //     if (event.data.action === 'reload') {
    //       // Reload the page in response to the message
    //       location.reload();
    //     }
    //   };

    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext );
    const {newOrderCounter, increaseNewOrderCounter} = useContext(ItemContext);

      const fetchPendingOrders = async () => {
        const res = await axios.get(`/orders/pending_orders`);
        setPendingOrders(res.data);
      };


    

    useEffect(()=>{
      // axios.get('/orders').then(response=>{
      //   // console.log("Response", response.data)
      //   setCurrentOrders(response.data)
      // }).catch(error =>{
      //   console.log("Error", error)
      // })

      const intervalId = setInterval(() => {
        console.log('This will run every 5 seconds');
        fetchPendingOrders();

        axios.get('/orders').then(response=>{
          console.log("Response", response.data)
          setCurrentOrders(response.data)
      }).catch(error =>{
          console.log("Error", error)
  
      })
        // Place your logic here that you want to execute every 5 seconds
      }, 500);
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
      
  
    },[renderOrdersKey])
    
     
  

    // const socket = new WebSocket(`wss://${window.location.hostname}:${window.location.port}`);

    // socket.onmessage = (event) => {
    //   // setReceivedMessage(event.data);
    //   if (event.data == 'message'){
    //     location.reload()
    //   }
    // };

    // return () => {
    //   socket.close();
    // };



    // },[])
  //   useEffect(()=>{
  //   axios.get('/orders').then(response=>{
  //     console.log("Response", response.data)
  //     setCurrentOrders(response.data)
  //   }).catch(error =>{
  //       console.log("Error", error)

  //   })
   
    
  // },[newOrderCounter])
    


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

   const [showModal, setShowModal] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);


  const confirmOrder = async (orderId) => {
    await axios.patch(`/orders/pending_orders/${orderId}/confirm`);
    fetchPendingOrders(); // refrescar lista
    setShowModal(false)
  };

  // useEffect(() => {
  //   if (showModal) {
  //     fetchPendingOrders();
  //   }
  // }, [showModal]);

  const [editingOrderId, setEditingOrderId] = useState(null);
const [editedOrder, setEditedOrder] = useState(null);

console.log(pendingOrders)


const unconfirmedOrders = pendingOrders?.filter(order =>
  order.paymentConfirmed !== undefined && order.paymentConfirmed === false
);

const [visibleOrders, setVisibleOrders] = useState({});







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
        <div className="w-100 d-flex flex-row justify-content-between m-2">
             <div className="d-flex pt-3 w-25 pb-3 text-center align-items-center justify-content-center">
            <Nav>
            <Nav.Link to='/' as={NavLink} className='btn 'style={{ fontSize: '1rem' }}>Home</Nav.Link>
            </Nav>
            </div>
             <div className="pt-3 pb-3 d-flex w-75 text-center justify-content-center align-items-center display-6">
                       Órdenes Pendientes
            </div>
            <button
              className="btn btn-dark w-25 rounded-pill shadow-sm py-3 px-4 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
              style={{ maxWidth: '400px', fontSize: '1rem', letterSpacing: '0.3px' }}
              onClick={() => setShowModal(true)}
            >
              {unconfirmedOrders.length > 0 && (
                <span
                  className="badge rounded-pill bg-danger"
                  style={{ fontSize: '1rem' }}
                >
                  {unconfirmedOrders.length}
                </span>
              )}
              Órdenes de Kiosko
            </button>








      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Órdenes Pendientes</Modal.Title>
        </Modal.Header>
     <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
{pendingOrders.map(order => (
  <div key={order._id} className="border rounded p-3 mb-3">
    <p><strong>Cliente:</strong> {order.client_name}</p>
    <p><strong>Total:</strong> ${order.total}</p>
    <p><strong>Pago:</strong> {order.payment_method}</p>

    <div className="mt-2">
      <strong>Helados:</strong>
      {order.items?.map((item, idx) => (
        <div key={idx} className="border rounded p-2 mt-2">
          <p><strong>#{idx + 1}:</strong> {item.combination || 'Helado'}</p>
          <p><strong>Toppings:</strong> {
            editingOrderId === order._id ? (
              <input
                className="form-control"
                type="text"
                value={editedOrder?.items[idx]?.toppings?.join(', ') || ''}
                onChange={(e) => {
                  const newToppings = e.target.value.split(',').map(t => t.trim());
                  const updatedItems = [...editedOrder.items];
                  updatedItems[idx].toppings = newToppings;
                  setEditedOrder({ ...editedOrder, items: updatedItems });
                }}
              />
            ) : (
              item.toppings && item.toppings.length > 0 ? item.toppings.join(', ') : 'Ninguno'
            )
          }</p>
        </div>
      ))}
    </div>

    <p><strong>¿Confirmado?:</strong> {order.paymentConfirmed ? 'Sí' : 'No'}</p>

    {!order.paymentConfirmed && editingOrderId === order._id ? (
      <>
        <div className="d-flex gap-2 mt-3">
          <select
            className="form-select"
            value={editedOrder.payment_method}
            onChange={e => setEditedOrder({ ...editedOrder, payment_method: e.target.value })}
          >
            <option value="ATH">ATH</option>
            <option value="CASH">CASH</option>
          </select>
          <button
            className="btn btn-success"
            onClick={async () => {
              await axios.patch(`/orders/pending_orders/${order._id}/edit`, editedOrder);
              setEditingOrderId(null);
              fetchPendingOrders();
            }}
          >
            Guardar cambios
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditingOrderId(null)}
          >
            Cancelar
          </button>
        </div>
      </>
    ) : (
      !order.paymentConfirmed && (
        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            onClick={() => confirmOrder(order._id)}
          >
            Confirmar
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              setEditingOrderId(order._id);
              setEditedOrder(JSON.parse(JSON.stringify(order))); // deep clone
            }}
          >
            Modificar
          </button>
        </div>
      )
    )}
  </div>
))}

</Modal.Body>


        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
            <div className=""><img src="" alt="" />
             <div className="container mt-5">
     
    </div>

            </div>
            {/* <button className='btn btn-outline-secondary p-2' onClick={handleOrderClear}>Clear</button> */}

        </div>
         {currentOrders ? (
        <div className='list-group h-100'> 
            {currentOrders.map(order =>(
<div
  className={`d-flex justify-content-center align-items-center flex-column list-group-item list-group-item-action p-3 border rounded-2 m-2 ${
    order.status === 'done' ? 'bg-success-subtle' : ''
  }`}
>
                    <div className="d-flex flex-row w-100 justify-content-between align-items-center">

                    {/* <button key={order._id} className='btn fs-4' onClick={() => toggleVisibility(order._id)}>{order.client_name}</button> */}
                    <button key={order._id} className='btn fs-4' style={{ width: '100px' }}>{order.client_name}</button>
                    <div className="">
                        Status: {order.status}
                    </div>
                    <button 
                      key={order._id} 
                      className="btn fs-4" 
                      onClick={() => toggleVisibility(order._id)}
                    >
                      <i className={`bi ${itemVisibility[order._id] == true ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>

                    <button  className="btn text-secondary fs-4" onClick={()=>handleDeleteShow(order._id)}>  <i className="bi bi-trash"></i></button>
                    
                    {/* <button className="btn text-secondary" onClick={()=>handleDelete(order._id)}>
                        Delete
                    </button> */}
                    <button
                      className={`btn fs-5 px-3 py-2 fw-semibold d-flex align-items-center gap-2 
                        ${order.status === 'done' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                      onClick={() => handleDone(order)}
                    >
                      <i className={`bi ${order.status === 'done' ? 'bi-check-circle-fill' : 'bi-hourglass-split'}`}></i>
                      {order.status === 'done' ? 'Done' : 'In Progress'}
                    </button>

                    </div>
                    <div className={itemVisibility[order._id] ? 'd-flex flex-column bg-secondary-subtle p-3 w-100':'d-none bg-secondary-subtle '}>
                    <div className="d-flex flex-column w-100 ">
                      {order.items.map(item =>(
                      <div className=" border-bottom border-dark w-100">
                        <div className="d-flex flex-row bg-danger-subtle p-3">
                           <div className='fw-bold fs-4'> Tipo:  </div> 
                           <div className="fs-4">
                           {item.type}
                           {/* <div className="text-secondary">
                              {editEnable[order._id] ? (<input className='w-75' defaultValue={item.type} />):(<div></div>)}
                              </div> */}
                            </div> 
                        </div>
                        <div className="d-flex flex-column bg-warning-subtle p-3">
                        {item && item.type !== 'drinks' && (
                            <div className="fw-bold fs-4">
                              Ingredientes:
                            </div>
                          )}
                          <ul className="d-flex flex-column">
                            {item.type !== 'drinks'&&item.ings.map((ing=>(  
                              <li className='fs-4'>{ing}
                              {/* <div className="text-secondary">
                              {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                              </div> */}
                              </li>
                            )))}
                          </ul>
                        </div>
                        <div className="d-flex flex-column bg-primary-subtle p-3">
                        {item && item.type !== 'drinks' && (
                            <div className="fw-bold fs-4">
                              Toppings:
                            </div>
                          )}
                          <ul className="d-flex flex-column">

                            {item.type !== 'drinks'&& item.tops.map((top=>(
                              <li className='fs-4'>{top}
                                {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input  className='w-75' defaultValue={top}/>):(<div></div>)}
                                </div> */}
                              </li>
                            )))}
                          </ul>
                        </div>
                        <div className="d-flex flex-column bg-info-subtle p-3">
                          <div className="fw-bold fs-4">
                            Cantidad: 
                          </div>
                          <ul className="col d-flex flex-row w-100 justify-content-between fs-4">
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
                        <div className="d-flex flex-column pb-2 bg-success-subtle p-3">
                          <div className="fw-bold fs-4">
                            Comentarios: 
                          </div>
                          <ul className="d-flex flex-column fs-4">
                            
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
                        <div className="fs-4">
                          Método de Pago:
                        </div>
                        <div className="fw-normal d-flex justify-content-center align-items-center fs-4">
                          {order.payment_method}
                        </div>
                      </div>
                      <div className="fw-bold d-flex flex-row w-100">
                        <div className="fs-4">
                          Total:
                        </div>
                        <div className="fw-normal d-flex justify-content-center align-items-cente fs-4">
                              <CurrencyFormatter value={order.total} />
                        </div>
                      </div>
                      {/* <div className="fw-bold d-flex flex-row w-100">
                        <div className="fs-4">
                          Status:
                        </div>
                        <div className="fw-normal d-flex justify-content-center align-items-center fs-4">
                          {order.status}
                        </div>
                      </div> */}
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
            <p>No hay órdenes</p>
        )
        }
    </div>
    )
}

