import React, { useReducer } from 'react'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';




const LOCAL_TYPE_KEY = import.meta.env.VITE_REACT_APP_LOCAL_TYPE_KEY;
const LOCAL_INGS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_INGS_KEY;
const LOCAL_TOPS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_TOPS_KEY;
const LOCAL_QTY_KEY = import.meta.env.VITE_REACT_APP_LOCAL_QTY_KEY;
const LOCAL_CMTS_KEY = import.meta.env.VITE_REACT_APP_LOCAL_CMTS_KEY;



function TerminalScreen() {
    
    const [ingredientsButtons, showIngredients] = useState(false);
    const [toppingsButtons, showToppings] = useState(false);
    const [metodoModal, showMetodoModal] = useState(false);
    
    const [name, setName] = useState("");
    
    const [type , setType] = useState("");
    const [typeCounter, setTypeCounter] = useState(0);
    const [typeAlert, setTypeAlert] = useState(false)

    const [ings, setIngs] = useState([]);
    const [tops, setTops] = useState([]);
    const [qty, setQty] = useState(0);
    const [comments, setComments] = useState("")

    const [metodo, setMetodo] = useState("");

    const [item, setItem] = useState({
        ings:[],
        tops:[],
        qty:0,
        comments:""

    });

    const [items, setItemstoOrder] = useState({
        name:"",
        items:[],
        metodo:"",
    });

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


    const typeMounted = useRef(false);
    const ingsMounted = useRef(false);
    const topsMounted = useRef(false);
    
    const checkButtons = useRef(true);
    



    useEffect(()=>{

        var storeType = JSON.parse(localStorage.getItem(LOCAL_TYPE_KEY));
        var storedIngs = JSON.parse(localStorage.getItem(LOCAL_INGS_KEY));
        var storeTops = JSON.parse(localStorage.getItem(LOCAL_TOPS_KEY));

        if (checkButtons){
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
            
        }

        // 


    },[])


    
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
        if(typeMounted.current){
            localStorage.setItem(LOCAL_TYPE_KEY,JSON.stringify(type))
        }
        else{
            typeMounted.current = true;
        }
    },[type])


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

    return (
    <div className='m-2 bg-secondary-subtle w-100   d-flex flex-column row ' style={{height:'100vh', overflowY:'scroll'}}>
        <div className="col w-100">
            <div className="m-2 col w-100 d-flex justify-content-between">
                <label htmlFor="cliente">Nombre</label>
                <input type="text" name='cliente' className=' ' />
                <button type='button' onClick={handleShow} className='btn btn-primary '>Send Order</button>
            </div>
            <Modal show={metodoModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
           
            {/* <div className="col d-flex justify-content-center">
                <button className='btn btn-primary '>New Item</button>
            </div> */}
        </div>
        <div className="col">
                { typeAlert && <div className='text-danger text-center'>Only One Type per Item</div> }
            <div className='col d-flex flex-row m-1 p-3 w-100'>
                <div className="col w-25  text-start">Type</div>
                <div className="col d-flex flex-row w-100 ">
                    <div className="col ms-1 me-1">
                        <button className={typeFlags.rolls ? 'btn btn-outline-dark type active' : 'btn btn-outline-dark type'} value={'rolls'} onClick={add}>Rolls</button>
                    </div>
                    <div className="col ms-1 me-1">
                        <button className= {typeFlags.shakes ? 'btn btn-outline-dark type active':'btn btn-outline-dark type'}  value={'shakes'} onClick={add}>Shakes</button>


                    </div>
                    <div className="col ms-1 me-1">
                        <button className={typeFlags.banana ? 'btn btn-outline-dark type active':'btn btn-outline-dark type'} value={'banana'} onClick={add}>Banana</button>

                        
                    </div>
                    <div className="col ms-1 me-1">
                        <button className={typeFlags.puppy ? 'btn btn-outline-dark type active':'btn btn-outline-dark type'} value={'puppy'} onClick={add}>Puppy</button>

                    </div>
                </div>
            </div>
            <div className='col m-2'>
                <button className="col w-100 text-start border-0 p-3"  onClick={handleIngredients}>
                    Ingredients
                </button>
                {ingredientsButtons && <div className="col " >
                    <button className={ingsFlag.fresaIng  ? 'btn btn-outline-dark m-1 ingredients active' : 'btn btn-outline-dark m-1 ingredients ' }value={'fresa'} onClick={add}  >Fresa</button>
                    <button className={ingsFlag.nutellaIng  ? 'btn btn-outline-dark m-1 ingredients active' : 'btn btn-outline-dark m-1 ingredients ' } value={'nutella'} onClick={add} >Nutella</button>
                    <button className={ingsFlag.oreoIng  ? 'btn btn-outline-dark m-1 ingredients active' : 'btn btn-outline-dark m-1 ingredients ' } value={'oreo'} onClick={add} >Oreo</button>
                    <button className='btn btn-outline-dark m-1'>Mani</button>
                    <button className='btn btn-outline-dark m-1'>Almendra</button>
                    <button className='btn btn-outline-dark m-1'>Coco</button>
                    <button className='btn btn-outline-dark m-1'>Biz. de Vainilla</button>
                </div>}
            </div>
            <div className='col m-2'> 
                <button className="col w-100 text-start border-0 p-3" onClick={handleToppings}>
                    Toppings
                </button>
                {toppingsButtons && <div className="col " >
                    <button className={topsFlag.fresaTop ? 'btn btn-outline-dark m-1 toppings active':'btn btn-outline-dark m-1 toppings'} value={'fresa'} onClick={add}>Fresa</button>
                    <button className={topsFlag.nutellaTop ? 'btn btn-outline-dark m-1 toppings active':'btn btn-outline-dark m-1 toppings'} value={'nutella'} onClick={add}>Nutella</button>
                    <button className={topsFlag.oreoTop ? 'btn btn-outline-dark m-1 toppings active':'btn btn-outline-dark m-1 toppings'} value={'oreo'} onClick={add}>Oreo</button>
                    <button className='btn btn-outline-dark m-1'>Mani</button>
                    <button className='btn btn-outline-dark m-1'>Almendra</button>
                    <button className='btn btn-outline-dark m-1'>Coco</button>
                    <button className='btn btn-outline-dark m-1'>Biz. de Vainilla</button>
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
                    <textarea name="" id="" cols="30" rows="5"></textarea>
                </div>
            </div>
        </div>
        <div className="col w-100 d-flex justify-content-center align-items-center">
            <button className='btn btn-primary'>Add Item to Order</button>
        </div>

    </div>

  )
}

export default TerminalScreen