import React, { useSyncExternalStore } from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../context/ItemContext';
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CurrencyFormatter from '../tools/CurrencyFormatter';
import './OrderScreen.css'
import { Toaster, toast } from 'react-hot-toast';



const LOCAL_NAME_KEY = import.meta.env.VITE_REACT_APP_LOCAL_NAME_KEY;
const LOCAL_TYPE_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TYPE_KEY;
const LOCAL_INGS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_INGS_KEY;
const LOCAL_TOPS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TOPS_KEY;
const LOCAL_QTY_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_QTY_KEY;
const LOCAL_CMTS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_CMTS_KEY;
const LOCAL_ITEM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ITEMS_KEY;
const LOCAL_ORDER_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ORDER_KEY
const LOCAL_PM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_PM_KEY;
const LOCAL_TOTAL_KEY = import.meta.env.VITE_REACT_APP_LOCAL_TOTAL_KEY;


function OrderScreen() {


  // RELOAD CHANNEL
  // const reloadChannel = new BroadcastChannel('reload-channel');
  
  // USESTATE HOOKS
  const [currentOrders,setCurrentOrders] = useState(null)
  const [metodoModal, showMetodoModal] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [itemVisibility, setItemVisibility] = useState({});
  const [editEnable, isEditEnable] = useState({})
  const [orderSubmitted,isOrderSubmited] = useState(false)

  const itemCosts = {
    rolls : 5.00,
    shakes : 5.00,
    banana : 6.00,
    puppy : 5.00,
    drinks : 1.00,
  }

   const [newTypeFlags, setNewTypeFlags] = useState({
          rolls:false,
          shakes:false,
          banana:false,
          puppy:false,
          drinks:false
      })

    const [newIngsFlag, setNewIngsFlag] = useState({
        VainillaIng:false,
        ChocolateIng:false,
        FresaIng:false,
        NutellaIng:false,
        OreoIng:false,
        ManíIng:false,
        AlmendraIng:false,
        CocoIng:false,
        BizcochoDeVainillaIng:false,
        PistachioIng:false,
        AmaretoIng:false,
        GranolaIng:false,
        ParchaIng:false,
        MangoIng:false,
        CanelaIng:false,
        AnísIng:false,
        LimónIng:false,
        CaféIng:false,
        BrownieIng:false,
        GuineoIng:false,
        CameoIng:false,
        TronkyIng:false,
        ChipsIng:false,
        CheesecakeIng:false,
        ChocolateBlancoIng:false,
        FruityPebblesIng:false,
        CocoaPebblesIng:false,
        QuesoIng:false,
        UvaIng:false,
        ChinaIng:false,
        GuanabanaIng:false,
        ChipsAhoyIng:false,
        KitKatIng:false,
        BlueberryIng:false,
        RedVelvettIng:false,
        NuecesIng:false,
        CarameloIng:false,
        CherryIng:false,
        BrandyIng:false,
        PinaIng:false,
        PinaColadaIng:false,
        ManzanaIng:false,
        GuayabaIng:false,
        BizcochoDeZanahoriaIng:false,
        FerreroIng:false,
        CrackersIng:false,
        MarshmellowIng:false,

        
    })


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
  const {favCounter, setFavCounter} = useContext( ItemContext );
  const {sumToSubstract,setSumtoSubstract} = useContext( ItemContext );
  const {newOrderCounter, increaseNewOrderCounter} = useContext(ItemContext);


  






  // MODAL HANDLERS
  const handleShow = () => showMetodoModal(true)
  const handleClose = () => showMetodoModal(false)
  const handleEditShow = () => showEditModal(true)
  const handleEditClose = () => showEditModal(false)

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
    // axios.get('/orders').then(response=>{
    //   // console.log("Response", response.data)
    //   setCurrentOrders(response.data)
    // }).catch(error =>{
    //   console.log("Error", error)
    // })
    const intervalId = setInterval(() => {
      axios.get('/orders').then(response=>{
        setCurrentOrders(response.data)
    }).catch(error =>{
        console.log("Error", error)

    })
      // Place your logic here that you want to execute every 5 seconds
    }, 500);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
    

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
      
      
      // Define the key(s) you want to keep
      const keysToKeep = ['username', 'password'];

      // Iterate over all keys in localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          // Check if the current key is not in the list of keys to keep
          if (!keysToKeep.includes(key)) {
              // Remove the key from localStorage
              localStorage.removeItem(key);
          }
      }

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
      const response = await axios.delete('/orders',{data:{ id: orderId}})
      console.log('Item deleted:', response.data);
      toast.success('Orden borrada')
    }
    catch(error){
      toast.error('Order failed to delete!')
      console.log('error:', error)
    }
    setDeleteShow(false)
    setRenderOrdersKey(prevKey => prevKey + 1)
    reloadChannel.postMessage({ action: 'reload' });
  }

  const [adviceMessage, setAdviceMessage] = useState("")

  const playSound = () => {
    const audio = new Audio('/sounds/success.mp3'); // path is relative to public/
    audio.play();
  };
 
  // POST ORDER TO DB
  const handleOrder = async (event) =>{
    
    setOrder(previous => ({
        ...previous,
        name: JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
        metodo: JSON.parse(localStorage.getItem(LOCAL_PM_KEY))
    }));



    var storedOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
    var storedItems = storedOrder.items;

    if (JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)) == null || JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)) == ""){
      console.log("Order needs to be under a name")
      // setAdviceMessage("Orden debe estar bajo un nombre")
      toast.error("Orden debe estar bajo un nombre")
    }
    else if(JSON.parse(localStorage.getItem(LOCAL_PM_KEY)) == null || JSON.parse(localStorage.getItem(LOCAL_PM_KEY)) == ""){
      // setAdviceMessage("Orden debe tener método de pago")
      toast.error("Orden debe tener método de pago")
    }
    else{
      setAdviceMessage("")

      try{
        const response = await axios.post('/orders', {
            'name': JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
            'items': storedItems,
            'payment_method': JSON.parse(localStorage.getItem(LOCAL_PM_KEY)),
            'total': totalToPay
        })
        toast.success("Orden añadida a la cola")

        playSound()

        showMetodoModal(false)

        setTotalToPay(0)
        setMetodo("")
        setTypeCounter(typeCounter -1)
        setFavCounter(favCounter -1)
        isOrderSubmited(true)
        setRenderOrdersKey(prevKey => prevKey + 1);
        increaseNewOrderCounter(prev => prev + 1);

        // const response = await axios.get('/orders');
        console.log('Response:', response.headers);
        } catch(error){
            console.error('Error', error)
        }
       

    

    }
    

  

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
        setSumtoSubstract(itemCosts[i.type] * i.qty)
        console.log("Total Updated")
        toast.success('Item borrado')

      }
      else{
        console.log('item not found')
      }
    })
  }
  // DELETE ORDER FROM CURRENT ORDER IN LOCALSTORAGE
  const handleClear = () => {
    
    toast.success('Orden limpia!')
    setNewItem({})
    localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
    setOrder({})
    setItemCounter(0)
    setTotalToPay(0)
    setType("")
    setName("")
    setTypeCounter(typeCounter -1)
    setFavCounter(favCounter -1)
    
    setRenderOrdersKey(prevKey => prevKey + 1);
    
    location.reload()
    
  }
  const [idToDelete,setIDtoDelete] = useState(0);
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = (orderId) => {
    setDeleteShow(true);
    setIDtoDelete(orderId)
  }
  const [charge,setCharge] = useState(0)
  const [chargeShow, setChargeShow] = useState(false)
  const handleChargeShow = () => setChargeShow(true)
  const handleChargeHide = () => setChargeShow(false)

  const handleCharge = (event) => {
    setCharge(event.target.value)
  }
  const handleIncrement = () => {
    setCharge(charge + .25);
  };

  const handleDecrement = () => {
    // if (charge > 0){
    setCharge(charge - .25);
    // }
  };

  // useEffect(()=>{
  //   if totalToPay == 
  //   console.log("Total To Pay",parseInt(totalToPay,10) + charge)
  //   localStorage.setItem(LOCAL_TOTAL_KEY,parseInt(totalToPay,10) + charge)
  // },totalToPay)

  const añadirCargo = () =>{
    toast.success("Cargo añadido")
    // console.log("Type of totalToPay", typeof(totalToPay))
    // console.log("Parsed totalToPay", typeof(parseInt(totalToPay,10)))
    // console.log("Type of charge", typeof(charge))
    console.log("Total",parseFloat(totalToPay,10))
    console.log("Charge",charge)
    console.log("Total To Pay",parseFloat(totalToPay,10) + charge)
    setTotalToPay(parseFloat(totalToPay,10) + charge)
    localStorage.setItem(LOCAL_TOTAL_KEY,parseFloat(totalToPay,10) + charge)

    setCharge(0)
    
    setChargeShow(false)
  }
  const [detailShow, setDetailShow] = useState(false)
  const [orderToShow, setOrderToShow] = useState({})
  const handleDetailShow = (orden) => {
    setDetailShow(true)
    setOrderToShow(orden)
  }

  const handleDetailClose = () => setDetailShow(false)

  const {hideOrders,toggleHideOrders} = useContext(ItemContext)


  const handleShowOrders = () =>{
    toggleHideOrders(prev => !prev)
  }
  const [isMobile,setIsMobile]= useState(false)

  useEffect(()=>{
    // Example: Check if the viewport is at most 768px wide
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  function handleMediaQueryChange(event) {
    if (event.matches) {
      // The viewport is at most 768 pixels wide
      console.log('The viewport is at most 768 pixels wide');
      setIsMobile(true)
      toggleHideOrders(true)
      // Add your logic here for viewports at most 768px wide
    } else {
      // The viewport is wider than 768 pixels
      console.log('The viewport is wider than 768 pixels');
      setIsMobile(false)
      toggleHideOrders(false)


      // Add your logic here for viewports wider than 768px
    }
  }
  const socket = new WebSocket(`wss://${window.location.hostname}:${window.location.port}`);
  // setWs(socket);

  return () => {
    socket.close();
  };
  },[])

  const [editType,setEditType] = useState(false)
  const [editIngs,setEditIngs] = useState(false)
  const [editTops,setEditTops] = useState(false)
  const [editQty,setEditQty] = useState(false)
  const [editComments,setEditComments] = useState(false)
  const [pastValue,setPastValue]=useState("")
  const [itemsIDtoEdit,setItemsIDtoEdit] = useState(0)
  const [triggerUpdate,setTriggerUpdate] = useState(true)
  const [uI,setUI] = useState(() => {
    const storedItems = localStorage.getItem('items');
    return storedItems
      ? JSON.parse(storedItems)
      : [
          { }        ];
  });

  const handleEdit = (item_id,property)=>{
    if (property == 'type'){
      setEditType(prevState => !prevState)

      if (itemsIDtoEdit ===item_id){
        setItemsIDtoEdit(0)
      }
      else{
        setItemsIDtoEdit(item_id)
      }
    }
    else if (property == 'ings'){
      setEditIngs(prevState => !prevState)

      if (itemsIDtoEdit ===item_id){
        setItemsIDtoEdit(0)
      }
      else{
        setItemsIDtoEdit(item_id)
      }
    }
    else if (property == 'tops'){
      setEditTops(prevState => !prevState)

      if (itemsIDtoEdit ===item_id){
        setItemsIDtoEdit(0)
      }
      else{
        setItemsIDtoEdit(item_id)
      }
    }
    else if (property == 'qty'){
      setEditQty(prevState => !prevState)

      if (itemsIDtoEdit ===item_id){
        setItemsIDtoEdit(0)
      }
      else{
        setItemsIDtoEdit(item_id)
      }
    }
    else if (property == 'comments'){
      setEditComments(prevState => !prevState)

      if (itemsIDtoEdit ===item_id){
        setItemsIDtoEdit(0)
      }
      else{
        setItemsIDtoEdit(item_id)
      }
    }

      console.log("ID of item to edit",itemsIDtoEdit)
  }

    const handleIncrementNewQty = () => {
      setNewQty(newQty + 1);
    };

    const handleDecrementNewQty = () => {
        if (newQty > 0){
            setNewQty(newQty - 1);
        }
    };

  const updateItemValue = (itemss,itemId, key, newValue,past,nQ) => {
    toast.success('Cambio guardado!')

    if (nQ != 0){
      const updatedItems = itemss.map((item) =>
        item.item_id === itemId ? { ...item, [key]: nQ } : item
      );
      setUI(updatedItems)

      order['items'].map(i=>{
        if(i.item_id === itemId){
          // const updatedOrder = order['items'].filter(i => i.item_id !== id)
          setOrder(previous => ({
            ...previous,
            items: updatedItems,
          }));
          localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
        
         if (key==='qty'){
              console.log("Past value's cost",itemCosts[past]* i.qty)
              console.log("Type of nQ",typeof(nQ))
              console.log("New value's cost",itemCosts[past] * nQ)
      
              var sub = (itemCosts[past] * nQ) - (itemCosts[past]* i.qty)
              console.log("Sum to substract",sub)
              setSumtoSubstract(sub)
              console.log("Total Updated")
            }
           
          
        }
        else{
          console.log('item not found')
        }
      })
      setEditType(false)
      setEditIngs(false)
      setEditTops(false)
      setEditQty(false)
      setItemsIDtoEdit(0)
      newTypeFlags['rolls'] = false
      newTypeFlags['shakes'] = false
      newTypeFlags['banana'] = false
      newTypeFlags['puppy'] = false
      newTypeFlags['drinks'] = false
      setNewType("")
      setNewIngs([])
      setNewTops([])
      setNewQty(0)


    }
    else{
      if (key==='type'){
        const updatedItems = itemss.map((item) =>
          item.item_id === itemId ? { ...item, [key]: newValue } : item
        );
        setUI(updatedItems)
        order['items'].map(i=>{
          if(i.item_id === itemId){
            // const updatedOrder = order['items'].filter(i => i.item_id !== id)
            setOrder(previous => ({
              ...previous,
              items: updatedItems,
            }));
            localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
            
            console.log("Past value",past)
            console.log("New value",newValue)
            
          
            console.log("Past value's cost",itemCosts[past]* i.qty)
            console.log("New value's cost",itemCosts[newValue] * i.qty)
    
            var sub = (itemCosts[newValue] * i.qty) - (itemCosts[past]* i.qty)
            console.log("Sum to substract",sub)
            setSumtoSubstract(sub)
            console.log("Total Updated")
            
            
          }
          else{
            console.log('item not found')
          }
        })
      }
      else if(key=="comments" || key==='ings'||key==='tops'){
        const updatedItems = itemss.map((item) =>
          item.item_id === itemId ? { ...item, [key]: newValue } : item
        );
        setUI(updatedItems)
        order['items'].map(i=>{
          if(i.item_id === itemId){
            // const updatedOrder = order['items'].filter(i => i.item_id !== id)
            setOrder(previous => ({
              ...previous,
              items: updatedItems,
            }));
            localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify({}))
                
          }
          else{
            console.log('item not found')
          }
        })
        
      }
      else{

      }

      setEditType(false)
      setEditIngs(false)
      setEditTops(false)
      setEditQty(false)
      setEditComments(false)
      setItemsIDtoEdit(0)
      newTypeFlags['rolls'] = false
      newTypeFlags['shakes'] = false
      newTypeFlags['banana'] = false
      newTypeFlags['puppy'] = false
      newTypeFlags['drinks'] = false
      setNewType("")
      setNewIngs([])
      setNewTops([])
      setNewQty(0)
      setNewComments("")


      
 

    }
    
   


  };

  useEffect(()=>{
    localStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify(uI));
    console.log("Updated Items",uI)
   
  },[uI])
 

  const [newType,setNewType] = useState("")
  const [newIngs,setNewIngs] = useState([])
  const [newTops,setNewTops] = useState([])
  const [newQty,setNewQty] = useState(0)
  const [newComments,setNewComments] = useState("")

  const handleNewType = (event) =>{
    var t = event.target.value
    if (t == "rolls"){
      if (newTypeFlags['rolls']==true){
        newTypeFlags['rolls'] = false
        setNewType("")

      }
      else{
        newTypeFlags['rolls'] = true
        setNewType(t)

      }
    }
    else if (t == "shakes"){
      if (newTypeFlags['shakes'] === true){
        newTypeFlags['shakes'] = false
        setNewType("")
        
      }
      else{
        newTypeFlags['shakes'] = true
        setNewType(t)

      }
    }
    else if (t == "banana"){
      if (newTypeFlags['banana'] === true){
        newTypeFlags['banana'] = false
        setNewType("")
        
      }
      else{
        newTypeFlags['banana'] = true
        setNewType(t)

      }
    }
    else if (t == "puppy"){
      if (newTypeFlags['puppy'] === true){
        newTypeFlags['puppy'] = false
        setNewType("")
        
      }
      else{
        newTypeFlags['puppy'] = true
        setNewType(t)

      }
    }
    else if (t == "drinks"){
      if (newTypeFlags['drinks'] === true){
        newTypeFlags['drinks'] = false
        setNewType("")
        
      }
      else{
        newTypeFlags['drinks'] = true
        setNewType(t)

      }
    }
  }

    const [listaDeIngredientes,actualizarIngredientes] = useState([])
    const [ingrediente_a_buscar,buscar_ingrediente] = useState("")

    const [topping_a_buscar,buscar_topping] = useState("")
    const [listaDeToppings,actualizarToppings] = useState([])
    
   

   useEffect(()=>{
    axios.get('/topping').then(response=>{
      const respuesta_topping = response.data 
      actualizarToppings(respuesta_topping)
      
  }).catch(error =>{
      console.log("Error", error)
  })
    axios.get('/ingrediente').then(response=>{
      const respuesta_ingredientes = response.data 
      actualizarIngredientes(respuesta_ingredientes)
      
  }).catch(error =>{
      console.log("Error", error)
  })
   },[])

   useEffect(()=>{

    if (ingrediente_a_buscar !== ""){
        console.log("Ingrediente a Buscar", ingrediente_a_buscar)

        const params = { nombre: ingrediente_a_buscar}
        axios.get('/ingrediente',{params}).then(response=>{
          console.log('Ingredientes encontrados', response.data)

        actualizarIngredientes(response.data)
            
        }).catch(error =>{
            console.log("Error", error)
        })

       
    }
    else if(ingrediente_a_buscar === ""){
        console.log("Ingrediente a Buscar", ingrediente_a_buscar)

    

        axios.get('/ingrediente').then(response=>{
          console.log('Ingredientes encontrados', response.data)

          actualizarIngredientes(response.data)
            
        }).catch(error =>{
            console.log("Error", error)
        })
    }
    
   
},[ingrediente_a_buscar])

useEffect(()=>{

  if (topping_a_buscar !== ""){

      const params = { nombre: topping_a_buscar}
      axios.get('/topping',{params}).then(response=>{

      actualizarToppings(response.data)
          
      }).catch(error =>{
          console.log("Error", error)
      })

     
  }
  else if(topping_a_buscar === ""){

      axios.get('/topping').then(response=>{

      actualizarToppings(response.data)
          
      }).catch(error =>{
          console.log("Error", error)
      })
  }
  
 
},[topping_a_buscar])

const handleIngredientSearch = (event) =>{

  buscar_ingrediente(event.target.value)

}
const handleToppingSearch = (event) =>{

  buscar_topping(event.target.value)

}

const handleNewComments= (event) => {
  setNewComments(event.target.value)
}

const addActive = (event) =>{
  if (event.target.classList.contains('active')){
    event.target.classList.remove('active')
    if (event.target.classList.contains('ingredients')){
      const updatedNewIngs = newIngs.filter(ing=> ing !== event.target.value)
      setNewIngs(updatedNewIngs)
    }
    else if (event.target.classList.contains('toppings')){
      if (event.target.value != "No toppings"){
        const updatedNewTops = newTops.filter(top=> top !== event.target.value)
        setNewTops(updatedNewTops)
      }
      else{
        setNewTops([])

      }
    

    }
    


  }
  else if (!event.target.classList.contains('active')){
    event.target.classList.add('active')
    if (event.target.classList.contains('ingredients')){
      setNewIngs(prevIngs=>[...prevIngs,event.target.value])
    }
    else if (event.target.classList.contains('toppings')){
      if (event.target.value != "No toppings"){
        setNewTops(prevTops=>[...prevTops,event.target.value])
      }
      else{
        setNewTops([])

      }


    }
  }
}


  return (
    // <div className='m-2 bg-light' style={{height:'95vh',width:'30vw'}}>
    <div className={hideOrders ? 'bg-dark order-container shadow-lg d-flex flex-column' : 'd-none'} 
     style={{ height: '100vh', zIndex: '1000', overflowY: 'auto' }}>
  
  <div className="container-fluid px-3 px-md-5">
    {/* HEADER */}
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 text-light">
      <Nav>
        <Nav.Link to="/" as={NavLink} className="btn btn-outline-light">Home</Nav.Link>
      </Nav>
      <h4 className="mt-3 mt-md-0">Queued Orders</h4>
      <button className="btn btn-outline-primary" onClick={handleShowOrders}>Cerrar</button>
    </div>

    {/* QUEUED ORDERS */}
    <div className="ordenes-esperando overflow-auto" style={{ maxHeight: '35vh' }}>
      {currentOrders?.length > 0 ? (
        currentOrders.map(order => (
          <div key={order._id} className="list-group-item bg-light-subtle d-flex justify-content-between align-items-center">
            <button className="btn btn-link" onClick={() => handleDetailShow(order)}>
              {order.client_name}
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteShow(order._id)}>Eliminar</button>
          </div>
        ))
      ) : (
        <div className="text-light">No hay órdenes</div>
      )}
    </div>

    {/* CURRENT ORDER SECTION */}
    <div className="mt-4 bg-secondary-subtle p-3 rounded shadow-sm">
      <div className="d-flex justify-content-between text-light mb-3">
        <div>Cliente: {name}</div>
        <div>Total: {<CurrencyFormatter value={totalToPay} currency='USD' />}</div>
      </div>
      
      <div style={{ maxHeight: '30vh' }} className="overflow-auto bg-white rounded">
        {order?.items?.length > 0 ? (
          order.items.map((item) => (
            <div key={item.item_id} className="border-bottom p-3">
              <h5>{item.type}</h5>
              {item.ings?.length > 0 && (
                <>
                  <strong>Ingredientes:</strong>
                  <ul className="list-unstyled">
                    {item.ings.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </>
              )}
              {/* Repite similar para toppings, qty y comentarios */}
            </div>
          ))
        ) : (
          <p className="text-muted">No hay ítems en esta orden.</p>
        )}
      </div>
    </div>

    {/* ACTION BUTTONS */}
    <div className="d-flex flex-column flex-md-row justify-content-around align-items-center mt-4 gap-3">
      <button className="btn btn-warning px-4 py-2" onClick={handleChargeShow}>Cargo Adicional</button>
      <button className="btn btn-success px-4 py-2" onClick={handleShow}>Enviar Orden</button>
    </div>
  </div>
</div>

  )
}

export default OrderScreen