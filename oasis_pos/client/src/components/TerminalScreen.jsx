import React, { useContext, useReducer } from 'react'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { ItemContext } from '../../context/ItemContext';



const LOCAL_NAME_KEY = import.meta.env.VITE_REACT_APP_LOCAL_NAME_KEY;
const LOCAL_TYPE_KEY = import.meta.env.VITE_REACT_APP_LOCAL_TYPE_KEY;
const LOCAL_INGS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_INGS_KEY;
const LOCAL_TOPS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_TOPS_KEY;
const LOCAL_QTY_KEY = import.meta.env.VITE_REACT_APP_LOCAL_QTY_KEY;
const LOCAL_CMTS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_CMTS_KEY;
const LOCAL_ITEM_KEY = import.meta.env.VITE_REACT_APP_LOCAL_ITEMS_KEY;
const LOCAL_ORDER_KEY = import.meta.env.VITE_REACT_APP_LOCAL_ORDER_KEY
const LOCAL_PM_KEY = import.meta.env.VITE_REACT_APP_LOCAL_PM_KEY;



function TerminalScreen() {
    
    const [ingredientsButtons, showIngredients] = useState(false);
    const [toppingsButtons, showToppings] = useState(false);
    const [metodoModal, showMetodoModal] = useState(false);
    
    const {name, setName} = useContext( ItemContext );
    
    const [type , setType] = useState("");
    const [typeCounter, setTypeCounter] = useState(0);
    const [typeAlert, setTypeAlert] = useState(false)

    const [ings, setIngs] = useState([]);
    const [tops, setTops] = useState([]);
    const [qty, setQty] = useState(0);
    const [comments, setComments] = useState("")

    const {metodo, setMetodo} = useContext( ItemContext )


    const {newItem, setNewItem} = useContext( ItemContext );

    const [componentKey, setComponentKey] = useState(1);

    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext )

    

    const [isInputDisabled, setIsInputDisabled] = useState(true);



    const {itemCounter, setItemCounter} = useContext( ItemContext );

    const {order, setOrder} = useContext( ItemContext )

    const [typeFlags, setTypeFlags] = useState({
        rolls:false,
        shakes:false,
        banana:false,
        puppy:false
    })
    
    const [ingsFlag, setIngsFlag] = useState({
        fresaIng:false,
        nutellaIng:false,
        oreoIng:false
        
    })

    const [topsFlag, setTopsFlag] = useState({
        fresaTop:false,
        nutellaTop:false,
        oreoTop:false
    })

    const nameMounted = useRef(false);
    const typeMounted = useRef(false);
    const ingsMounted = useRef(false);
    const topsMounted = useRef(false);
    const qtyMounted = useRef(false);
    const cmtsMounted = useRef(false);

    const itemMounted = useRef(false);
    const orderMounted = useRef(false);
    const metodoMounted = useRef(false);
    
    const checkButtons = useRef(true);


    



    useEffect(()=>{

        var storeName = JSON.parse(localStorage.getItem(LOCAL_NAME_KEY));
        var storeType = JSON.parse(localStorage.getItem(LOCAL_TYPE_KEY));
        var storedIngs = JSON.parse(localStorage.getItem(LOCAL_INGS_KEY));
        var storeTops = JSON.parse(localStorage.getItem(LOCAL_TOPS_KEY));
        var storeQty = JSON.parse(localStorage.getItem(LOCAL_QTY_KEY));
        var storeComments = JSON.parse(localStorage.getItem(LOCAL_CMTS_KEY));
        var storeNewItem = JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY));
        var storeOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
        var storePM = JSON.parse(localStorage.getItem(LOCAL_PM_KEY));
        

        if (checkButtons){
            if(storeName){
                setName(storeName)
            }
            if(storedIngs){
                setIngs(storedIngs)
                storedIngs.forEach(function(i){
                    var ingKey = i + 'Ing';
                    if(localStorage.getItem(ingKey) !== null){
                        for (const key in ingsFlag){
                            if(key === ingKey){
                                if(localStorage.getItem(ingKey) === '1'){
                                    ingsFlag[ingKey] = true
                                    console.log('true')
                                }
                                else{
                                    ingsFlag[ingKey] = false
                                }
                            }
                        }
                    }
                   
                })
            }
            if(storeTops){
                setTops(storeTops)
                storeTops.forEach(function(i){
                    var topKey = i + 'Top';
                    if(localStorage.getItem(topKey)){
                        for (const key in topsFlag){
                            if(key === topKey){
                                if(localStorage.getItem(topKey) === '1'){
                                    topsFlag[topKey] = true
                                    console.log('true')
                                }
                                else{
                                    topsFlag[topKey] = false
                                }
                            }
                        }
                    }
                })
            }
            if(storeType){
                setType(storeType)
                if (storeType === 'rolls'){
                    typeFlags['rolls'] = true;
                } 
                else if (storeType === 'banana'){
                    typeFlags['banana'] = true
                }  
                else if (storeType=== 'shakes'){
                    typeFlags['shakes'] = true

                }
                else if (storeType === 'puppy'){
                    typeFlags['puppy']= true
                }
      
  
            }
            if(storeQty){
                setQty(storeQty)
            }
            if(storeComments){
                setComments(storeComments)
            }
            if(storeNewItem){
                setNewItem(storeNewItem)
            }
            
            if(storeOrder){
                setOrder(storeOrder)
                
            }

            if(storePM){
                setMetodo(storePM)
            }

            
        }

        // 


    },[])

    


    useEffect(()=>{
        if(nameMounted.current){
            localStorage.setItem(LOCAL_NAME_KEY,JSON.stringify(name))
        }
        else{
            nameMounted.current = true;
        }
    },[name])


    useEffect(()=>{
        // var storeType = JSON.parse(localStorage.getItem(LOCAL_TYPE_KEY));

        // if (storeType === 'rolls'){
        //     typeFlags['rolls'] = true;
        // } 
        // else if (storeType === 'banana'){
        //     typeFlags['banana'] = true
        // }  
        // else if (storeType=== 'shakes'){
        //     typeFlags['shakes'] = true

        // }
        // else if (storeType === 'puppy'){
        //     typeFlags['puppy']= true
        // }
        // else if(storeType === ''){
        //     console.log("nada")
        //     typeFlags['rolls'] = false;
        //     typeFlags['banana'] = false;
        //     typeFlags['shakes'] = false;
        //     typeFlags['puppy']= false;
            
        // }



        if(typeMounted.current){
            localStorage.setItem(LOCAL_TYPE_KEY,JSON.stringify(type))
        }
        else{
            typeMounted.current = true;
        }
    },[type])
    
    useEffect(()=>{
        if(ingsMounted.current){
        localStorage.setItem(LOCAL_INGS_KEY,JSON.stringify(ings));
        }
        else{
            ingsMounted.current = true;
        }
        
    },[ings])

    useEffect(()=>{
        if(topsMounted.current){
        localStorage.setItem(LOCAL_TOPS_KEY,JSON.stringify(tops));
        }
        else{
            topsMounted.current = true;
        }
        
    },[tops])

    useEffect(()=>{
        if(qtyMounted.current){
            localStorage.setItem(LOCAL_QTY_KEY,JSON.stringify(qty));
        }
        else{
            qtyMounted.current = true
        }
    },[qty])

    useEffect(()=>{
        if(cmtsMounted.current){
            localStorage.setItem(LOCAL_CMTS_KEY,JSON.stringify(comments));
        }
        else{
            cmtsMounted.current = true
        }
    },[comments])

    useEffect(()=>{


        if(itemMounted.current){
            
            localStorage.setItem(LOCAL_ITEM_KEY,JSON.stringify(newItem));
            if(localStorage.getItem(LOCAL_ITEM_KEY) != "{}"){
                if(order.items != undefined){

                    setOrder(previous =>({
                        ...previous,
                        items:[...previous.items, JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY))],
                    }));
                }
                else{
                    setOrder(previous =>({
                        ...previous,
                        items:[JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY))],
                    }));

                }

            }

                
            
         
       
        }
        else{

            itemMounted.current = true

        }

    },[itemCounter])




    useEffect(()=>{
        if(orderMounted.current){
            localStorage.setItem(LOCAL_ORDER_KEY,JSON.stringify(order))

         
        }
        else{
            orderMounted.current = true
        }
    },[order])


    useEffect(()=>{
        if(metodoMounted.current){
            localStorage.setItem(LOCAL_PM_KEY,JSON.stringify(metodo));
        }
        else{
            metodoMounted.current = true
        }
    },[metodo])

    const handleName = (event) => {
        setName(event.target.value)
    }


    const handleIngredients = event => {

        showIngredients(current => !current);

    };

    const handleToppings = event => {
        showToppings(current => !current);
    };

    const handleShow = () => showMetodoModal(true)
    const handleClose = () => showMetodoModal(false)


    const add = event => {
        var buttonClasses = event.target.classList;

        if(buttonClasses.contains('ingredients')){
            if (ings.includes(event.target.value)){
                const updatedIngs = ings.filter(ing => ing !== event.target.value)
                setIngs(updatedIngs)
                console.log('removed '+ event.target.value + ' from ingredient')
                event.target.classList.remove('active')
                var key = event.target.value + 'Ing'
                localStorage.setItem(key,'0')
                
            }
            else {
                setIngs(prevIngs =>[...prevIngs,event.target.value])
                console.log('added '+ event.target.value + ' to ingredient')
                event.target.classList.add('active')
                var key = event.target.value + 'Ing'
                localStorage.setItem(key,'1')

            }

        }
        else if(buttonClasses.contains('toppings')){
            if (tops.includes(event.target.value)){
                const updatedTops = tops.filter(tops => tops !== event.target.value)
                setTops(updatedTops)
                console.log('removed '+ event.target.value + ' from toppings')
                event.target.classList.remove('active')
                var key = event.target.value + 'Top'
                localStorage.setItem(key,'0')
                
            }
            else {
                setTops(prevTops =>[...prevTops,event.target.value])
                console.log('added '+ event.target.value + ' to toppings')
                event.target.classList.add('active')
                var key = event.target.value + 'Top'
                localStorage.setItem(key,'1')

            }
        }
        else if((buttonClasses.contains('type'))){
            if (typeCounter == 1 && type !== event.target.value ){
                console.log("only one type per item");
                setTypeAlert(true)

            }
            else{
                setTypeAlert(false)

                if(type === event.target.value){
                    setType("")
                    setTypeCounter(typeCounter - 1)
                    event.target.classList.remove('active')
                    // localStorage.setItem("type",event.target.value)
    
                }
                else {
                    setType(event.target.value)
                    setTypeCounter(typeCounter + 1)
                    event.target.classList.add('active')
                    // localStorage.setItem("type",event.target.value)

    
                    
                }
            }

        }
        
    };
    const handleIncrement = () => {
        setQty(qty + 1);
      };
    
    const handleDecrement = () => {
        if (qty > 0){
            setQty(qty - 1);
        }
    };
    const handleComments= (event) => {
        setComments(event.target.value)
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    const handleNewItem = (event) =>{

        setNewItem({
            _id: getRandomInt(0,100000000),
            type:type,
            ings:ings,
            tops:tops,
            qty:qty,
            comments:comments
        });

        setItemCounter(itemCounter => itemCounter + 1)
        setType("")
        setIngs([])
        setTops([])
        setQty(0)
        setComments("")
        setTypeCounter(0)


        setComponentKey(prevKey => prevKey + 1);
        
  

    
    }

    // const handlePayment = (event) => {
    //     if(event.target.value === "ATH"){
    //         setMetodo("ATH")
    //     }
    //     else{
    //         setMetodo("CASH")
    //     }
    // }

    const reloadChannel = new BroadcastChannel('reload-channel');




    // const handleOrder = async (event) =>{
    //     setOrder(previous => ({
    //         ...previous,
    //         name: JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
    //         metodo: JSON.parse(localStorage.getItem(LOCAL_PM_KEY))
    //     }));


    //     var storedOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
    //     var storedItems = storedOrder.items;

    //     try{
    //         const response = await axios.post('/orders', {
    //             'name': JSON.parse(localStorage.getItem(LOCAL_NAME_KEY)),
    //             'items': storedItems,
    //             'payment_method': JSON.parse(localStorage.getItem(LOCAL_PM_KEY))
    //         })

    //         // const response = await axios.get('/orders');
    //         console.log('Response:', response.headers);
    //     } catch(error){
    //         console.error('Error', error)
    //     }
    //     showMetodoModal(false)

    //     setOrder({})
    //     setNewItem({})
    //     setItemCounter(0)


    //     setRenderOrdersKey(prevKey => prevKey + 1);
    //     // console.log(renderOrdersKey)




    //     reloadChannel.postMessage({ action: 'reload' });
   
    // }

    const handleSave = ( ) =>{
        setIsInputDisabled(!isInputDisabled);
    }

    return (
        <div className="m-2 bg-secondary-subtle w-100 ">
            <div className='  d-flex flex-column row ' style={{height:'100vh', overflowY:'scroll'}} key={componentKey}>
                <div className="col w-100">
                    <div className="m-2 col w-75 d-flex justify-content-evenly">
                        <label htmlFor="cliente">Nombre</label>
                        <div className="w-25 d-flex justify-content-between">
                            <input type="text" name='cliente'  disabled={isInputDisabled} value={name} onChange={handleName} />
                            <button type='button' className='btn btn-primary' onClick={handleSave}>  {isInputDisabled ? 'Change' : 'Save '}</button>
                        </div>
        
                        {/* <button type='button' onClick={handleShow} className='btn btn-primary '>Send Order</button> */}
                    </div>
                    {/* <Modal show={metodoModal} onHide={handleClose} centered>
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
                    </Modal> */}
                   
                    {/* <div className="col d-flex justify-content-center">
                        <button className='btn btn-primary '>New Item</button>
                    </div> */}
                </div>
                <div className="col h-75">
                        { typeAlert && <div className='text-danger text-center'>Only One Type per Item</div> }
                    <div className='col d-flex flex-row m-1 p-3 w-100'>
                        <div className="col w-25  text-start">Type</div>
                        <div className="col d-flex flex-row w-100 ">
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.rolls ? 'btn btn-outline-dark type active p-3' : 'btn btn-outline-dark type p-3'} value={'rolls'} onClick={add}>Rolls</button>
                            </div>
                            <div className="col ms-1 me-1">
                                <button className= {typeFlags.shakes ? 'btn btn-outline-dark type active p-3':'btn btn-outline-dark type p-3'}  value={'shakes'} onClick={add}>Shakes</button>
        
        
                            </div>
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.banana ? 'btn btn-outline-dark type active p-3':'btn btn-outline-dark type p-3'} value={'banana'} onClick={add}>Banana</button>
        
                                
                            </div>
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.puppy ? 'btn btn-outline-dark type active p-3':'btn btn-outline-dark type p-3'} value={'puppy'} onClick={add}>Puppy</button>
        
                            </div>
                        </div>
                    </div>
                    <div className='col m-2'>
                        <button className="col w-100 text-start border-0 p-3"  onClick={handleIngredients}>
                            Ingredients
                        </button>
                        {ingredientsButtons && <div className="col " >
                            <button className={ingsFlag.fresaIng  ? 'btn btn-outline-dark m-1 ingredients active p-3' : 'btn btn-outline-dark m-1 ingredients p-3' }value={'fresa'} onClick={add}  >Fresa</button>
                            <button className={ingsFlag.nutellaIng  ? 'btn btn-outline-dark m-1 ingredients active p-3' : 'btn btn-outline-dark m-1 ingredients p-3' } value={'nutella'} onClick={add} >Nutella</button>
                            <button className={ingsFlag.oreoIng  ? 'btn btn-outline-dark m-1 ingredients active p-3' : 'btn btn-outline-dark m-1 ingredients p-3' } value={'oreo'} onClick={add} >Oreo</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Mani</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Almendra</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Coco</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Biz. de Vainilla</button>
                        </div>}
                    </div>
                    <div className='col m-2'> 
                        <button className="col w-100 text-start border-0 p-3" onClick={handleToppings}>
                            Toppings
                        </button>
                        {toppingsButtons && <div className="col " >
                            <button className={topsFlag.fresaTop ? 'btn btn-outline-dark m-1 toppings active p-3':'btn btn-outline-dark m-1 toppings p-3'} value={'fresa'} onClick={add}>Fresa</button>
                            <button className={topsFlag.nutellaTop ? 'btn btn-outline-dark m-1 toppings active p-3':'btn btn-outline-dark m-1 toppings p-3'} value={'nutella'} onClick={add}>Nutella</button>
                            <button className={topsFlag.oreoTop ? 'btn btn-outline-dark m-1 toppings active p-3':'btn btn-outline-dark m-1 toppings p-3'} value={'oreo'} onClick={add}>Oreo</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Mani</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Almendra</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Coco</button>
                            <button className='btn btn-outline-dark m-1 p-3'>Biz. de Vainilla</button>
                        </div>}
                    </div>
                    <div className='col d-flex flex-row m-2 p-3 bg-secondary-subtle'>
                        <div className="col">Quantity</div>
                        <div className="col d-flex flex-row w-100 justify-content-between">
                            <div className="col">
                            {qty}
                            </div>
                            <div className="col">
                                <button className='btn btn-primary rounded-circle' onClick={handleIncrement}>+</button>
                            </div>
                            <div className="col">
                                <button className='btn btn-primary rounded-circle' onClick={handleDecrement}>-</button>
                            </div>
                        </div>
        
                    </div>
                    <div className='col m-2 d-flex flex-row ps-3'>
                        <div className="col">Comments</div>
                        <div className="col">
                            <textarea name="" id="" cols="30" rows="5" defaultValue={comments} onChange={handleComments}></textarea>
                        </div>
                    </div>
                    <div className="col w-100 d-flex justify-content-center align-items-center">
                        <button className='btn btn-primary p-3' onClick={handleNewItem}>Add Item to Order</button>
                    </div>
            
                </div>
            </div>
        </div>


  )
}

export default TerminalScreen