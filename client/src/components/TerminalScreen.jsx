import React, { useContext, useReducer } from 'react'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { ItemContext } from '../../context/ItemContext';



const LOCAL_NAME_KEY = import.meta.env.VITE_REACT_APP_LOCAL_NAME_KEY;
const LOCAL_TYPE_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TYPE_KEY;
const LOCAL_INGS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_INGS_KEY;
const LOCAL_TOPS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_TOPS_KEY;
const LOCAL_QTY_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_QTY_KEY;
const LOCAL_CMTS_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_CMTS_KEY;
const LOCAL_ITEM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ITEMS_KEY;
const LOCAL_ORDER_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_ORDER_KEY
const LOCAL_PM_KEY =  import.meta.env.VITE_REACT_APP_LOCAL_PM_KEY;



function TerminalScreen() {
    
    const [ingredientsButtons, showIngredients] = useState(false);
    const [toppingsButtons, showToppings] = useState(false);
    const [metodoModal, showMetodoModal] = useState(false);
    const [typeAlert, setTypeAlert] = useState(false)
    const [ings, setIngs] = useState([]);
    const [tops, setTops] = useState([]);
    const [qty, setQty] = useState(0);
    const [comments, setComments] = useState("")
    const [componentKey, setComponentKey] = useState(1);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [typeFlags, setTypeFlags] = useState({
        rolls:false,
        shakes:false,
        banana:false,
        puppy:false
    })
    const [ingsFlag, setIngsFlag] = useState({
        fresaIng:false,
        nutellaIng:false,
        oreoIng:false,
        maniIng:false,
        almendraIng:false,
        cocoIng:false,
        bizvainillaIng:false,
        pisIng:false,
        amaIng:false,
        granIng:false,
        parchaIng:false,
        mangoIng:false,
        canelaIng:false,
        anisIng:false,
        limonIng:false,
        cafeIng:false,
        brownieIng:false,
        guineoIng:false,
        cameoIng:false,
        tronkyIng:false,
        chipsIng:false,
        cheesecakeIng:false,
        chocblancoIng:false,
        fruityIng:false,
        cocoaIng:false,
        quesoIng:false,
        uvaIng:false,
        chinaIng:false,
        guanabanaIng:false,
        chipsahoyIng:false,
        kitkatIng:false,
        blueIng:false,
        redvelvettIng:false,
        nuecesIng:false,
        carameloIng:false,
        cherryIng:false,
        brandyIng:false,
        pinaIng:false,
        pinacoladaIng:false,
        manzanaIng:false,
        guayabaIng:false,
        zanahoriaIng:false,
        ferreroIng:false,

        
    })
    const [topsFlag, setTopsFlag] = useState({
        fresaTop:false,
        nutellaTop:false,
        oreoTop:false,
        whippedTop:false,
        maniTop:false,
        almendraTop:false,
        cherryTop:false,
        carameloTop:false,
        canelaTop:false,
        nuecesTop:false,
        cocorayadoTop:false,
        pinaTop:false,
        cafeTop:false,
        chipsTop:false,
        sprinkesdecoloresTop:false,
        sprinkesdechocTop:false,
        chocolateTop:false,
        gummiesTop:false,
        granoTop:false,
        mielTop:false,
        guineoTop:false,
        cocoaTop:false,
        fruityTop:false,
        mymTop:false,
        marshTop:false,

    })


    
    const {name, setName} = useContext( ItemContext );
    const {metodo, setMetodo} = useContext( ItemContext )
    const {newItem, setNewItem} = useContext( ItemContext );
    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext )
    const {itemCounter, setItemCounter} = useContext( ItemContext );
    const {order, setOrder} = useContext( ItemContext )
    const {totalToPay,setTotalToPay} = useContext(ItemContext)
    const {type , setType} = useContext( ItemContext);
    const {typeCounter, setTypeCounter} = useContext( ItemContext );
    const {sumToSubstract,setSumtoSubstract} = useContext( ItemContext );




    

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


    const itemCosts = {
        rolls : 4.00,
        shakes : 5.00,
        banana : 6.00,
        puppy : 3.00
      }



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
                if (storeType != type){
                    setType(storeType)
                }
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
                if (storeQty != qty){
                    setQty(storeQty)
                }
            }
            if(storeComments){
                if (storeComments != comments){
                    setComments(storeComments)
                }
            }
            if(storeNewItem){
                if (storeNewItem != newItem){
                    setNewItem(storeNewItem)
                }
            }
            
            if(storeOrder){
                if (storeOrder != order){
                    setOrder(storeOrder)
                }
                
            }

            if(storePM){
                if (storePM != metodo){
                    setMetodo(storePM)
                }
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

            if (newItem.ings != undefined){
                localStorage.setItem(LOCAL_ITEM_KEY,JSON.stringify(newItem))
                var storeNewItem = JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY));
                if(storeNewItem != {}){
                    console.log("storeNewItem is not empty")

                    if(order.items != undefined){
                        console.log("order.Items is not undefined")

                        var exist = false
                        order.items.map(item =>{
                            if(item.item_id == storeNewItem.item_id){
                                exist = true
                            }

                        })
                        if (exist == false){
                            console.log("Adding Item")

                            setOrder(previous =>({
                                ...previous,
                                items:[...previous.items, storeNewItem],
                            })); 

                            
                         

                        }
                   
                    }
                    else{

                        setOrder(previous =>({
                            ...previous,
                            items:[JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY))],
                        }));


                    }

                }
                

            }
           
        }
        else{

            itemMounted.current = true

        }

    },[itemCounter])




    useEffect(()=>{
        var same = false
        var deletion = false
        if(orderMounted.current){
            if (JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))?.items != undefined && order?.items != undefined){
                var compareMe = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))
                console.log("Are the items the same in both variables?", order?.items.length === compareMe.items.length)
                console.log("Order State Variable Length: ",order?.items.length)
                console.log("Order LS Variable Length: ",compareMe.items.length)
                if (order?.items.length === compareMe.items.length){
                    same = true
                    console.log("Same is", same)
                }
                if(order?.items.length < compareMe.items.length){
                    deletion = true
                    console.log("Deletion is", deletion)

                }
                console.log("Change in Order Detected")
            }
            localStorage.setItem(LOCAL_ORDER_KEY,JSON.stringify(order))
            var storedOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
            var storedItems = storedOrder.items;
            for (const item in storedItems) {
                if (storedItems.hasOwnProperty(item)) {
                    for (const key in storedItems[item]){
                    if (storedItems[item].hasOwnProperty(key)){
                        if (key == 'type'){
                            var itemQty = storedItems[item]['qty']
                            console.log("Quantity of this item: ", itemQty)
            
                            var sumToTotal = itemCosts[storedItems[item][key]] * itemQty
                            console.log("Sum to total pay, please: ", sumToTotal)
                            console.log("Same is", same,"before trying to sum")
                            if (same == false && deletion == false){

                                setTotalToPay(totalToPay + sumToTotal)
                                console.log("Summed Quantity")
                            }
                            else if (same == false && deletion == true){
                                setTotalToPay(totalToPay - sumToSubstract)
                                console.log("Substracted Quantity", sumToSubstract)


                            }
                        }
                    }
                    }
                }
                }
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
                console.log(typeCounter)
                setTypeAlert(true)

            }
            else{
                setTypeAlert(false)

                if(type === event.target.value){
                    setType("")
                    setTypeCounter(typeCounter - 1)
                    event.target.classList.remove('active')
                }
                else {
                    setType(event.target.value)
                    setTypeCounter(typeCounter + 1)
                    event.target.classList.add('active')
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
        console.log("EVENT")
        setNewItem({
            item_id: getRandomInt(0,100000000),
            type:type,
            ings:ings,
            tops:tops,
            qty:qty,
            comments:comments
        });
        setType("")
        setTypeCounter(typeCounter -1)

        setIngs([])
        setTops([])
        setQty(0)
        setComments("")

       
        setComponentKey(prevKey => prevKey + 1);

    }
    const reloadChannel = new BroadcastChannel('reload-channel');

    const handleSave = ( ) =>{
        setIsInputDisabled(!isInputDisabled);
    }

    return (
        <div className="m-2 bg-light " style={{width:'70vw'}}>
            <div className='  d-flex flex-column  ' style={{height:'95vh',overflowY:'scroll', width:'75vw'}} key={componentKey}>
                <div className=" w-100" >
                    <div className="m-2 col w-75 d-flex justify-content-evenly pt-4 ">
                        <label htmlFor="cliente">Nombre</label>
                        <div className="w-25  d-flex justify-content-between">
                            <input type="text" name='cliente' className=' rounded-3 border-0 rounded-end-0'  disabled={isInputDisabled} value={name} onChange={handleName} />
                            <button type='button' className='btn btn-primary rounded-start-0 p-2 ' onClick={handleSave}>  {isInputDisabled ? 'Change' : 'Save '}</button>
                        </div>
                    </div>
                </div>
                <div className="col">
                        { typeAlert && <div className='text-danger text-center'>Only One Type per Item</div> }
                    <div className='col d-flex flex-row m-1 p-3 w-75'>
                        <div className="col w-25  text-start">Type</div>
                        <div className="col d-flex flex-row w-100 ">
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.rolls ? 'btn btn-outline-secondary type active p-3' : 'btn btn-outline-secondary type p-3'} value={'rolls'} onClick={add}>Rolls</button>
                            </div>
                            <div className="col ms-1 me-1">
                                <button className= {typeFlags.shakes ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'}  value={'shakes'} onClick={add}>Shakes</button>
        
        
                            </div>
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.banana ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'} value={'banana'} onClick={add}>Banana</button>
        
                                
                            </div>
                            <div className="col ms-1 me-1">
                                <button className={typeFlags.puppy ? 'btn btn-outline-secondary type active p-3':'btn btn-outline-secondary type p-3'} value={'puppy'} onClick={add}>Puppy</button>
        
                            </div>
                        </div>
                    </div>
                    <div style={{height:'40vh'}} className="overflow-scroll">
                        <div className='col m-2'>
                            <button className="rounded-3 col d-flex flex-row w-100 text-start border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-3 bg-light"  onClick={handleIngredients}>
                                Ingredients
                            </button>
                            {ingredientsButtons && <div className="col " >
                                <button className={ingsFlag.fresaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3 ' : 'btn btn-outline-secondary m-1 ingredients p-3' }value={'fresa'} onClick={add}  >Fresa</button>
                                <button className={ingsFlag.nutellaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'nutella'} onClick={add} >Nutella</button>
                                <button className={ingsFlag.oreoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'oreo'} onClick={add} >Oreo</button>
                                <button className={ingsFlag.maniIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'mani'} onClick={add} >Mani</button>
                                <button className={ingsFlag.almendraIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'almendra'} onClick={add} >Almendra</button>
                                <button className={ingsFlag.cocoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'coco'} onClick={add} >Coco</button>
                                <button className={ingsFlag.bizvainillaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'bizcocho de vainilla'} onClick={add} >Biz. de Vainilla</button>
                                <button className={ingsFlag.pisIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'pistachio'} onClick={add} >Pistachio</button>
                                <button className={ingsFlag.amaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'amaretto'} onClick={add} >Amaretto</button>
                                <button className={ingsFlag.granIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'granola'} onClick={add} >Granola</button>
                                <button className={ingsFlag.parchaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'parcha'} onClick={add} >Parcha</button>
                                <button className={ingsFlag.mangoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'mango'} onClick={add} >Mangó</button>
                                <button className={ingsFlag.canelaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'canela'} onClick={add} >Canela</button>
                                <button className={ingsFlag.anisIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'anis'} onClick={add} >Anís</button>
                                <button className={ingsFlag.limonIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'limon'} onClick={add} >Limón</button>
                                <button className={ingsFlag.cafeIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'cafe'} onClick={add} >Café</button>
                                <button className={ingsFlag.brownieIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'brownie'} onClick={add} >Brownie</button>
                                <button className={ingsFlag.guineoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'guineo'} onClick={add} >Guineo</button>
                                <button className={ingsFlag.cameoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'cameo'} onClick={add} >Cameo</button>
                                <button className={ingsFlag.tronkyIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'tronky'} onClick={add} >Tronky</button>
                                <button className={ingsFlag.chipsIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'chocolate chips'} onClick={add} >Chocolate Chips</button>
                                <button className={ingsFlag.cheesecakeIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'cheesecake'} onClick={add} >Cheese Cake</button>
                                <button className={ingsFlag.chocblancoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'chocolate blanco'} onClick={add} >Chocolate Blanco</button>
                                <button className={ingsFlag.fruityIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'fruity pebbles'} onClick={add} >Fruity Pebbles</button>
                                <button className={ingsFlag.cocoaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'cocoa pebbles'} onClick={add} >Cocoa Pebbles</button>
                                <button className={ingsFlag.quesoIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'queso crema'} onClick={add} >Queso Crema</button>
                                <button className={ingsFlag.uvaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'uva'} onClick={add} >Uva</button>
                                <button className={ingsFlag.chinaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'china'} onClick={add} >China</button>
                                <button className={ingsFlag.guanabanaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'guanábana'} onClick={add} >Guanábana</button>
                                <button className={ingsFlag.chipsahoyIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'chips ahoy'} onClick={add} >Chips Ahoy</button>
                                <button className={ingsFlag.kitkatIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'kit-kat'} onClick={add} >Kit-Kat</button>
                                <button className={ingsFlag.blueIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'blueberry'} onClick={add} >Blueberry</button>
                                <button className={ingsFlag.redvelvettIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'red velvet'} onClick={add} >Red Velvet</button>
                                <button className={ingsFlag.nuecesIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'nueces'} onClick={add} >Nueces</button>
                                <button className={ingsFlag.carameloIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'caramelo'} onClick={add} >Caramelo</button>
                                <button className={ingsFlag.cherryIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'cherry'} onClick={add} >Cherry</button>
                                <button className={ingsFlag.brandyIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'brandy'} onClick={add} >Brandy</button>
                                <button className={ingsFlag.pinaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'piña'} onClick={add} >Piña</button>
                                <button className={ingsFlag.pinacoladaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'piña colada'} onClick={add} >Piña Colada</button>
                                <button className={ingsFlag.manzanaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'manzana'} onClick={add} >Manzana</button>
                                <button className={ingsFlag.guayabaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'guayaba'} onClick={add} >Guayaba</button>
                                <button className={ingsFlag.zanahoriaIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'bizcocho de zanahoria'} onClick={add} >Bizcocho de Zanahoria</button>
                                <button className={ingsFlag.ferreroIng  ? 'btn btn-outline-secondary m-1 ingredients active p-3' : 'btn btn-outline-secondary m-1 ingredients p-3' } value={'ferrero'} onClick={add} >Ferrero</button>



                            </div>}
                        </div>
                        <div className='col m-2'> 
                            <button className="rounded-3 col w-100 text-start border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-3 bg-light" onClick={handleToppings}>
                                Toppings
                            </button>
                            {toppingsButtons && <div className="col " >
                                <button className={topsFlag.whippedTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'whipped cream'} onClick={add}>Whipped Cream</button>
                                <button className={topsFlag.fresaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'fresa'} onClick={add}>Fresa</button>
                                <button className={topsFlag.nutellaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'nutella'} onClick={add}>Nutella</button>
                                <button className={topsFlag.oreoTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'oreo'} onClick={add}>Oreo</button>
                                <button className={topsFlag.maniTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'mani'} onClick={add}>Mani</button>
                                <button className={topsFlag.almendraTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'almendra'} onClick={add}>Almendra</button>
                                <button className={topsFlag.cherryTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'cherry'} onClick={add}>Cherry</button>
                                <button className={topsFlag.canelaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'caramelo'} onClick={add}>Caramelo</button>
                                <button className={topsFlag.nuecesTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'canela'} onClick={add}>Canela</button>
                                <button className={topsFlag.cocorayadoTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'nueces'} onClick={add}>Nueces</button>
                                <button className={topsFlag.cocoaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'coco rayado'} onClick={add}>Coco Rayado</button>
                                <button className={topsFlag.pinaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'piña'} onClick={add}>Piña</button>
                                <button className={topsFlag.cafeTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'café'} onClick={add}>Café</button>
                                <button className={topsFlag.chipsTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'chocolate chips'} onClick={add}>Chocolate Chips</button>
                                <button className={topsFlag.sprinkesdecoloresTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'sprinkles de colores'} onClick={add}>Sprinkles de Colores</button>
                                <button className={topsFlag.sprinkesdechocTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'sprinkles de chocolate'} onClick={add}>Sprinkles de Chocolate</button>
                                <button className={topsFlag.chocolateTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'chocolate'} onClick={add}>Chocolate</button>
                                <button className={topsFlag.gummiesTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'gummies'} onClick={add}>Gummies</button>
                                <button className={topsFlag.granoTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'granola'} onClick={add}>Granola</button>
                                <button className={topsFlag.mielTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'miel'} onClick={add}>Miel</button>
                                <button className={topsFlag.guineoTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'guineo'} onClick={add}>Guineo</button>
                                <button className={topsFlag.cocoaTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'cocoa pebbles'} onClick={add}>Cocoa Pebbles</button>
                                <button className={topsFlag.fruityTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'fruity pebbles'} onClick={add}>Fruity Pebbles</button>
                                <button className={topsFlag.mymTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'m&m'} onClick={add}>M&M</button>
                                <button className={topsFlag.marshTop ? 'btn btn-outline-secondary m-1 toppings active p-3':'btn btn-outline-secondary m-1 toppings p-3'} value={'marshmellow'} onClick={add}>Marshmellow</button>
                            
                            </div>}
                        </div>


                    </div>
          
                    <div className='col d-flex flex-row m-2 p-3 '>
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
                            <textarea name="" id="" cols="30" rows="2" defaultValue={comments} onChange={handleComments}></textarea>
                        </div>
                    </div>
                    <div className="col w-100 d-flex justify-content-center align-items-center">
                        <button className='btn btn-outline-primary p-3 rounded-pill' onClick={handleNewItem}>Add Item to Order</button>
                    </div>
            
                </div>
            </div>
        </div>


  )
}

export default TerminalScreen