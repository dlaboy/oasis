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
    <div className={hideOrders ? 'bg-dark order-container shadow-lg':'d-none bg-dark order-container'} style={{height:'100vh',zIndex:'1000'}} >
      <Modal show={detailShow} onHide={handleDetailClose}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Orden</Modal.Title>
          </Modal.Header>
          <Modal.Body className='overflow-scroll detalles-body'>
          <div className={itemVisibility[orderToShow._id] ? 'detalle-de-orden d-flex flex-column bg-primary-subtle p-2':'d-flex  flex-column'}>
           <div className="d-flex flex-column overflow-scroll bg-secondary-subtle">
  {orderToShow?.items && orderToShow.items.map((item, index) => (
    <div key={index} className="border-bottom border-dark p-3">
      <div className="d-flex flex-column mb-2">
        <div className='fw-bold'>Tipo:</div> 
        <div>
          {item.type === 'rolls' && 'Rolls'}
          {item.type === 'banana' && 'Banana Split'}
          {item.type === 'shakes' && 'Shakes'}
          {item.type === 'puppy' && 'Puppy Rolls'}
          {item.type === 'drinks' && 'Drinks'}
        </div>
      </div>

      {item.type !== 'drinks' && (
        <>
          <div className="d-flex flex-column mb-2">
            <div className="fw-bold">Ingredientes:</div>
            <ul className="list-group list-group-flush">
              {item.ings?.map((ing, i) => (
                <li key={i} className="list-group-item bg-transparent ps-0">{ing}</li>
              ))}
            </ul>
          </div>

          <div className="d-flex flex-column mb-2">
            <div className="fw-bold">Toppings por helado:</div>
            <ul className="list-group list-group-flush">
              {Object.entries(item.tops || {}).map(([iceIndex, toppings]) => (
                <li key={iceIndex} className="list-group-item bg-transparent ps-0">
                  <strong>Helado #{parseInt(iceIndex) + 1}:</strong>
                  {toppings.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {toppings.map((top, idx) => (
                        <span key={idx} className="badge bg-primary p-2 fs-6 rounded-pill">
                          {top}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted ms-2">Ninguno</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="d-flex flex-column mb-2">
        <div className="fw-bold">Cantidad:</div>
        <div>{item.qty}</div>
      </div>

      <div className="d-flex flex-column">
        <div className="fw-bold">Comentarios:</div>
        <div>{item.comments || <span className="text-muted">Ninguno</span>}</div>
      </div>
    </div>
  ))}
</div>

            <div className="d-flex flex-column bg-light">
              <div className="fw-bold d-flex flex-row">
                <div className="">
                  Payment Method:
                </div>
                <div className="fw-normal d-flex justify-content-center align-items-center">
                  {orderToShow.payment_method}
                </div>
              </div>
              {/* <div className={editEnable[order._id] ? 'd-flex justify-content-center align-items-center':'d-none'}>
                <div className="">
                  <button className='btn btn-primary'onClick={()=>handleUpdate(order._id, order.name, order.items, order.payment_method)} >Save</button>
                </div>

              </div> */}

            </div>
            <div className="fw-bold d-flex flex-row bg-light">
                <div className="">
                  Total to Pay:
                </div>
                <div className="fw-normal d-flex justify-content-center align-items-center">
                  {<CurrencyFormatter value={orderToShow.total} />}
                </div>
              </div>
            
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDetailClose}>
              Close
            </Button>
            {/* <button className='btn btn-primary' onClick={()=>handleDelete(idToDelete)}>
              Delete
            </button> */}
          </Modal.Footer>
      </Modal>
      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Warning, you're about to delete an order!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <button className='btn btn-primary' onClick={()=>handleDelete(idToDelete)}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
        {/* <div  className=""  style={{height:'95vh',width:'30vw'}}> */}
        <div  className="" >
          <div className="d-flex flex-column text-center" style={{height:'15vh'}}>
            <div className="d-flex flex-row justify-content-between">
              <Nav>
                <Nav.Link to='/' as={NavLink} className='btn text-light p-3 w-100 text-center'>Home</Nav.Link>
              </Nav>
              <button className="p-3 btn btn-outline-primary closeShowOrders text-light" onClick={handleShowOrders}>Close</button>

            </div>
            <div className='d-flex flex-row w-100 justify-content-between p-3 text-start text-light'>
                <div className="">
                 Órdenes Pendientes
                </div>
            </div>
          </div>
          <div  className="ordenes-esperando overflow-scroll rounded-3">
              {currentOrders && currentOrders.length > 0 ? (
              <div className='list-group'> 
                {currentOrders.map(order =>(
                  <div key={order._id} >
                    <div className={order.status == 'done' ? 'bg-success-subtle list-group-item list-group-item-action p-3 d-flex flex-row justify-content-between': ' list-group-item list-group-item-action p-3 d-flex flex-row justify-content-between'} >
                      {/* <button className='btn' onClick={() => toggleVisibility(order._id)}> */}
                      <button className='btn' onClick={() => handleDetailShow(order)}>
                        {order.client_name} 
                      </button>
                      <div className="">
                        {/* <button className='btn text-secondary' onClick={()=>toggleEdit(order._id)}>Edit</button> */}
                        <button  className="btn text-secondary" onClick={()=>handleDeleteShow(order._id)}>Delete</button>
                        
                      </div>
                    </div>
                    
          
                  </div>
            
                )
                )}
              </div>):(
                <div className="text-secondary text-center h-100 w-100 d-flex bg-dark justify-content-center align-items-center">No Hay Órdenes</div>
                
              )
            }
          </div>
        </div>
        <div className="d-flex flex-column" >
          <div className="p-3 d-flex justify-content-between">
            <div className='text-light'>Current Order</div>
            <button className='rounded-3 bg-light border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-2' onClick={handleClear}>Clear</button>
          </div>
          <div  className=" w-100  p-3 d-flex flex-row justify-content-between" style={{zIndex:'1'}}>
            <div className="">
              <div className="text-light">
              Client: {name}
              </div>
              <div className="text-light">
              Total: {<CurrencyFormatter value={totalToPay} currency='USD'/>}
              </div>
            </div>
             
              {/* <div className="">
              Items In Order: { totalItems }
              </div> */}
              <button className='rounded-3 bg-light border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-2' onClick={handleEditShow}>Edit Order</button>


          </div>
          <div>
       
            
          {/* <div style={order.items ? {height:'20vh'}: {height:'0vh'}} className="m-3 overflow-scroll "> */}
         <div className="orden-de-ahora overflow-auto mt-3 text-light" style={{ height: '30vh' }}>
         {/* <div style={order.items && order.items.length > 0 ? { height: '30vh' } : { height: '0vh' }} className="orden-de-ahora bg-secondary-subtle overflow-auto mt-3 rounded shadow"> */}
  {order.items && order.items.length > 0 ? (
  order.items.map((item) => (
    <div key={item.item_id} className="border border-light d-flex flex-row p-3 ">
      <div className="w-100 pe-3 ">
        <div className="d-flex flex-row justify-content-between align-items-center mb-2">
          <h5 className="mb-2 text-warning">
            {/* <strong>Tipo:</strong>{' '} */}
            {item.type === 'rolls' && 'Rollitos'}
            {item.type === 'banana' && 'Banana Split'}
            {item.type === 'shakes' && 'Batidas'}
            {item.type === 'puppy' && 'Puppy Rolls'}
            {item.type === 'drinks' && 'Bebidas'}
          </h5>
          <div className="d-flex justify-content-center align-items-center w-25">
          <button className="btn btn-outline-danger" onClick={() => handleDeleteItem(item.item_id)}>
            Eliminar
          </button>
          </div>
        </div>

        {item.type !== 'drinks' && (
          <>
            <div className="mb-2">
              <strong className='text-success-subtle'>Ingredientes:</strong>
              <ul className="list-group list-group-flush mt-1 text-light">
                {item.ings?.map((ing, idx) => (
                  // <li key={idx} className="list-group-item bg-transparent ps-0 text-light">{ing}</li>
                  <li key={idx} className="list-group-item bg-transparent ps-0">
                    {/* <strong className='text-light'>Helado #{parseInt(iceIndex) + 1}:</strong>{' '} */}
                    {/* {toppings.length > 0 ? ( */}
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {/* {toppings.map((top, idx) => ( */}
                          <span key={idx} className="badge bg-success fs-6 p-2 rounded-pill">
                            {ing}
                          </span>
                        {/* ))} */}
                      </div>
                    {/* ) : (
                      <span className="text-muted ms-2">Ninguno</span>
                    )} */}
                  </li>
               ))}
              </ul>
            </div>

            <div className="mb-2">
              <strong className=''>Toppings por helado:</strong>
              <ul className="list-group list-group-flush mt-1">
                {Object.entries(item.tops || {}).map(([iceIndex, toppings]) => (
                  <li key={iceIndex} className="list-group-item bg-transparent ps-0">
                    <strong className='text-light'>Helado #{parseInt(iceIndex) + 1}:</strong>{' '}
                    {toppings.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {toppings.map((top, idx) => (
                          <span key={idx} className="badge bg-primary fs-6 p-2 rounded-pill">
                            {top}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted ms-2">Ninguno</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mb-2">
          <strong>Cantidad:</strong> 
          <div className="text-danger">
             <span  className="badge bg-danger fs-6 p-2 rounded-pill">
                {item.qty}
              </span>
          </div>
        </div>

        {item.comments && (
          <div className="mb-2">
            <strong>Comentarios:</strong> {item.comments}
          </div>
        )}
      </div>

      
    </div>
  ))
) : (
    <div className="text-secondary text-center h-100 w-100 d-flex bg-dark justify-content-center align-items-center">No Hay Items en la Orden</div>
)}

</div>
<div className="botones-actiones d-flex align-items-center justify-content-around flex-column gap-3 bg-dark">
            {/* <div className="text-danger d-flex gap-3">{adviceMessage}</div> */}
              <div className="d-flex flex-row w-100 justify-content-around align-items-center">
                <button type='button' onClick={handleChargeShow} className='d-flex btn btn-primary rounded-pill p-3'> Additional Charge</button>
                <button type='button' onClick={handleShow} className='btn btn-success p-3 rounded-pill'>Send Order</button>
              </div>

</div>

          
</div>
        

        </div>
          <Modal show={editModal} onHide={handleEditClose} centered size='xl' >
            <Modal.Header closeButton>
              <Modal.Title>Editando Orden</Modal.Title>
                <div className="text-danger">{adviceMessage}</div>
            </Modal.Header>
              <Modal.Body className='overflow-scroll detalles-body'>
              <div  className=" bg-secondary-subtle overflow-scroll">
              { order ? ( order?.items &&

                order.items.map(item =>  (
                  <div key={item.item_id} className='border-bottom border-dark d-flex flex-row '>
                    <div className="w-100 p-3">
                      <div className="btn d-flex flex-column justify-content-start align-items-start" onClick={()=>handleEdit(item.item_id,'type')}>
                        <div className="">
                          Type: 
                        </div>
                        <ul className="">
                        {item.type === 'rolls' && 'Rolls'}
                    {item.type === 'banana' && 'Banana Split'}
                    {item.type === 'shakes' && 'Shakes'}
                    {item.type === 'puppy' && 'Puppy Rolls'}
                    {item.type === 'drinks' && 'Drinks'}
                        </ul>
                      </div>
                      <div style={ (editType && itemsIDtoEdit === item.item_id )? {display:'flex'}: {display:'none'}} className='mt-3 mb-3 flex-column  w-100 justify-content-center align-items-center bg-primary-subtle'>
                        {/* <div className="col w-25 type-text text-start">Type</div> */}
                        <div className=" d-flex flex-row w-100 justify-content-around align-items-center "  style={{pointerEvents : 'none'}}>
                            <div className=" me-1">
                                <button style={{pointerEvents : 'auto'}} className={newTypeFlags.rolls ? 'btn btn-outline-secondary type active p-3' : 'btn btn-outline-secondary type p-3'} value={'rolls'} onClick={handleNewType}>Rolls</button>
                            </div>
                            <div className=" ms-1 me-1">
                                <button style={{pointerEvents : 'auto'}} className= {newTypeFlags.shakes ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'}  value={'shakes'} onClick={handleNewType}>Shakes</button>
        
        
                            </div>
                            <div className=" ms-1 me-1">
                                <button style={{pointerEvents : 'auto'}} className={newTypeFlags.banana ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'} value={'banana'} onClick={handleNewType}>Banana</button>
        
                                
                            </div>
                            <div className=" ms-1 me-1">
                                <button style={{pointerEvents : 'auto'}} className={newTypeFlags.puppy ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'} value={'puppy'} onClick={handleNewType}>Puppy</button>
        
                            </div>
                            <div className=" ms-1 me-1">
                                <button style={{pointerEvents : 'auto'}} className={newTypeFlags.drinks ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'} value={'drinks'} onClick={handleNewType}>Drinks</button>
        
                            </div>
                        </div>
                        <button  className={newType ?? newType != item.type ?? newType != "" ? 'btn btn-primary p-2 mt-1 w-100':'btn btn-outline-secondary p-2 mt-1 w-100 disabled' } onClick={()=>updateItemValue(order.items,item.item_id,'type',newType,item.type,0)}>Guardar</button>
                        {/* <input type="text" value={newType} className='' /> */}
                    </div>
                      <div className="btn d-flex flex-column justify-content-start align-items-start" onClick={()=>handleEdit(item.item_id,'ings')}>   
                      {item && item.type !== 'drinks' && (
                            <div className="" >
                              Ingredients:
                            </div>
                          )}
                      <ul className="d-flex flex-column justify-content-start align-items-start">
                        {item && item.type !== 'drinks' && item.ings.map((ing=>(  
                                <li>{ing}
                                {/* <div className="text-secondary">
                                {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                </div> */}
                                </li>
                              )))}

                      </ul>
                      </div>
                      <div style={ (editIngs && itemsIDtoEdit === item.item_id) ? {display:'flex'}: {display:'none'}} className=" flex-column bg-primary-subtle" >
                        <div className="w-100">
                          <input type="text" className='p-1 w-100' onChange={handleIngredientSearch} placeholder='Buscar ingrediente'/>
                        </div>
                        <div className="d-flex flex-row overflow-scroll">
                        {listaDeIngredientes.map(ing=>(
                              <button className={'btn btn-outline-secondary m-1 ingredients p-3' }value={ing.nombre} onClick={addActive} >{ing.nombre}</button>
                        ))}         
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <div className="">Ingredientes nuevos para este item</div>
                            <ul className="d-flex flex-row justify-content-around align-items-center w-100">
                            {newIngs && newIngs.length != 0 && newIngs.map((ing=>(  
                                    <li>{ing}
                                    {/* <div className="text-secondary">
                                    {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                    </div> */}
                                    </li>
                                  )))}

                          </ul>
                        </div>
                        <button  className={ newIngs.length !== 0 ? 'btn btn-primary p-2 mt-1 w-100':'btn btn-outline-secondary p-2 mt-1 w-100 disabled' } onClick={()=>updateItemValue(order.items,item.item_id,'ings',newIngs,item.ings,0)}>Guardar</button>

                      </div>
                      <div className="btn d-flex flex-column justify-content-start align-items-start" onClick={()=>handleEdit(item.item_id,'tops')}>
                        
                      {item && item.type !== 'drinks' && (
                            <div className="">
                              Toppings:
                            </div>
                          )}                        <ul>
                            {item && item.type !== 'drinks' && item.tops.map((top=>(
                                <li className=''>{top}
                                  {/* <div className="text-secondary">
                                  {editEnable[order._id] ? (<input  className='w-75' defaultValue={top}/>):(<div></div>)}
                                  </div> */}
                                </li>
                              )))}
                        </ul>
                      </div>
                      <div style={ (editTops && itemsIDtoEdit === item.item_id) ? {display:'flex'}: {display:'none'}} className=" flex-column bg-primary-subtle" >
                        <div className="w-100">
                          <input type="text" className='p-1 w-100' onChange={handleToppingSearch} placeholder='Buscar topping'/>
                        </div>
                        <div className="d-flex flex-row overflow-scroll">
                        <button className={'btn btn-outline-secondary m-1 toppings p-3' }value={"No toppings"} onClick={addActive} >No toppings</button>

                        {listaDeToppings.map(top=>(
                              <button className={'btn btn-outline-secondary m-1 toppings p-3' }value={top.nombre} onClick={addActive} >{top.nombre}</button>
                        ))}         
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <div className="">Toppings nuevos para este item</div>
                            <ul className="d-flex flex-row justify-content-around align-items-center w-100">
                            {newTops && newTops.length != 0 && newTops.map((top=>(  
                                    <li>{top}
                                    {/* <div className="text-secondary">
                                    {editEnable[order._id] ? (<input className='w-75' defaultValue={ing}/>):(<div></div>)}
                                    </div> */}
                                    </li>
                                  )))}

                          </ul>
                        </div>
                        <button  className={'btn btn-primary p-2 mt-1 w-100' } onClick={()=>updateItemValue(order.items,item.item_id,'tops',newTops,item.tops,0)}>Guardar</button>

                      </div>
                      <div className="btn d-flex flex-column justify-content-start align-items-start" onClick={()=>handleEdit(item.item_id,'qty')}>
                        <div className="">
                          Qty: 
                        </div>
                        <ul className="">
                          {item.qty}
                        </ul>
                      </div>
                      <div style={ (editQty && itemsIDtoEdit === item.item_id) ? {display:'flex'}: {display:'none'}} className=" flex-column bg-primary-subtle justify-content-center align-items-center w-100">
                          <div className=" d-flex flex-row w-100 justify-content-around p-2">
                                <div className="">
                                    <button className='btn btn-outline-primary rounded-pill' onClick={handleDecrementNewQty}>-</button>
                                </div>
                                <div className="">
                                {newQty}
                                </div>
                                <div className="">
                                    <button className='btn btn-outline-primary rounded-pill' onClick={handleIncrementNewQty}>+</button>
                                </div>
                            </div>
                            <button  className= 'btn btn-primary p-2 mt-1 w-100' onClick={()=>updateItemValue(order.items,item.item_id,'qty',newType,item.type,newQty)}>Guardar</button>



                      </div>
                      <div className="btn d-flex flex-column justify-content-start align-items-start" onClick={()=>handleEdit(item.item_id,'comments')}>
                        <div className="">
                          Comments: 
                        </div>
                        <ul className="">
                          {item.comments}
                        </ul>
                      </div>
                      <div style={ (editComments && itemsIDtoEdit === item.item_id) ? {display:'flex'}: {display:'none'}} className="p-2 flex-column bg-primary-subtle align-items-center justify-content-center" >
                        <div className="">
                            <textarea name="" id="" cols="60" rows="4" defaultValue={newComments} onChange={handleNewComments} className='rounded-3'></textarea>
                        </div>
                        <button  className='btn btn-primary p-2 mt-1 w-100' onClick={()=>updateItemValue(order.items,item.item_id,'comments',newComments,item.comments,0)}>Guardar</button>
                      </div>
                    </div>
                    {/* <div className="d-flex justify-content-around align-items-center w-25 flex-column">
                      <button className="btn text-secondary" onClick={()=>handleDeleteItem(item.item_id)}>
                        Edit
                      </button>
                      <button className="btn text-secondary" onClick={()=>handleDeleteItem(item.item_id)}>
                        Delete
                      </button>
                    </div> */}
                  </div>
                ))
              ):(
                <div className=""></div>
              ) }
              
            
              </div>
            
          
              </Modal.Body>
              <Modal.Footer>
              {/* <div className="">
                  Método de pago: {metodo}
              </div>

              <Button variant="secondary" onClick={handleClose}>
                  Close
              </Button>
              <Button variant="primary" onClick={handleOrder}>
                  Send Order
              </Button> */}
            </Modal.Footer>
          </Modal>
          <Modal show={metodoModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Método de Pago</Modal.Title>
                <div className="text-danger">{adviceMessage}</div>
              </Modal.Header>
              <Modal.Body className='w-100'>
                  <button className="btn btn-warning w-50" onClick={handlePayment} value={"ATH"}>ATH Móvil</button>
                  <button className="btn btn-success w-50" onClick={handlePayment} value={"CASH"}>CASH</button>
              </Modal.Body>
              <Modal.Footer>
              <div className="">
                  Método de pago: {metodo}
              </div>

              <Button variant="secondary" onClick={handleClose}>
                  Close
              </Button>
              <Button variant="primary" onClick={handleOrder}>
                  Send Order
              </Button>
            </Modal.Footer>
          </Modal>
            <Modal show={chargeShow} onHide={handleChargeHide} centered>
            <Modal.Header closeButton>
              <Modal.Title>Cargo Adicional</Modal.Title>
              </Modal.Header>
              <Modal.Body className='w-100 d-flex flex-row justify-content-between'>
                  <div className="">
                      <button className='btn btn-outline-primary rounded-pill p-3' onClick={handleDecrement}>-</button>
                  </div>
                  <div className=" d-flex flex-row justify-content-center align-items-center">
                    <span class="p-3">$</span>
                    <input type="number"  min={-100} onChange={handleCharge} id='charge' value={charge} className='increment-charge bg-secondary-subtle rounded-3 p-3 border-0'/>
                  </div>
                  <div className="">
                      <button className='btn btn-outline-primary rounded-pill p-3' onClick={handleIncrement}>+</button>
                  </div>
              </Modal.Body>
              <Modal.Footer>
                
              <Button variant="secondary" onClick={handleChargeHide}>
                  Cerrar
              </Button>
              <Button variant="primary" onClick={añadirCargo}>
                  Añadir Cargo
              </Button>
            </Modal.Footer>
            </Modal>

    </div>
  )
}

export default OrderScreen