import React, { useContext, useReducer } from 'react'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { ItemContext } from '../../context/ItemContext';
import './TerminalScreen.css'
import { Toaster, toast } from 'react-hot-toast';
import { set } from 'lodash';
// import ChooseType from './Choosetype';





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



function TerminalScreen() {
    // const notify = () => toast.success('Item saved successfully!');


    const [required,setRequired] = useState(false)
    const [ingredientsButtons, showIngredients] = useState(false);
    const [toppingsButtons, showToppings] = useState(false);
    const [favoritesButtons, showFavorites] = useState(false);
    const [metodoModal, showMetodoModal] = useState(false);
    const [typeAlert, setTypeAlert] = useState(false)
    const [favAlert, setFavAlert] = useState(false)
    const [ings, setIngs] = useState([]);
    // const [tops, setTops] = useState([]);
    const [tops, setTops] = useState({}); // No un array plano

    const [qty, setQty] = useState(0);
    const [agua, setAgua] = useState(0);

    const [comments, setComments] = useState("")
    const [componentKey, setComponentKey] = useState(1);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [typeFlags, setTypeFlags] = useState({
        rolls:false,
        shakes:false,
        banana:false,
        puppy:false,
        drinks:false
    })
    const [favoriteFlag , setFavFlag] = useState({
        CookiesAndCream:false,
        CocoNut:false,
        ILoveCoffee:false,
        Smores:false,
        CinnamonAndCarrot:false,
        StrawberryShortcake:false
    })
    const [ingsFlag, setIngsFlag] = useState({
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
    const [topsFlag, setTopsFlag] = useState({
        WhippedCreamTop:false,
        FresaTop:false,
        NutellaTop:false,
        OreoTop:false,
        ManíTop:false,
        AlmendraTop:false,
        CherryTop:false,
        CarameloTop:false,
        CanelaTop:false,
        NuecesTop:false,
        CocoRayadoTop:false,
        PiñaTop:false,
        CaféTop:false,
        ChipsTop:false,
        SprinkesDeColoresTop:false,
        SprinkesDeChocolateTop:false,
        ChocolateTop:false,
        GummiesTop:false,
        GranolaTop:false,
        MielTop:false,
        GuineoTop:false,
        CocoaPebblesTop:false,
        FruityPebblesTop:false,
        MyMTop:false,
        MarshmellowTop:false,

    })


    
    const {name, setName} = useContext( ItemContext );
    const {metodo, setMetodo} = useContext( ItemContext )
    const {newItem, setNewItem} = useContext( ItemContext );
    const {newDrinkItem, setNewDrinkItem} = useContext( ItemContext );
    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext )
    const {itemCounter, setItemCounter} = useContext( ItemContext );
    const {order, setOrder} = useContext( ItemContext )
    const {totalToPay,setTotalToPay} = useContext(ItemContext)
    const {type , setType} = useContext( ItemContext);
    const {typeCounter, setTypeCounter} = useContext( ItemContext );
    const {favCounter, setFavCounter} = useContext( ItemContext );
    const {sumToSubstract,setSumtoSubstract} = useContext( ItemContext );


    const [hideIngredients, setHideIngredients] = useState(false);
    const [hideFavorites, setHideFavorites] = useState(false);


    

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


    const [listaDeIngredientes,actualizarIngredientes] = useState([])

    const [ingrediente_a_buscar,buscar_ingrediente] = useState("")


    const [listaDeToppings,actualizarToppings] = useState([])

    const [topping_a_buscar,buscar_topping] = useState("")



    const [listaDeFavoritos,actualizarFavoritos] = useState([])

    const [favorito_a_buscar,buscar_favorito] = useState("")

    const itemCosts = {
        rolls : 5.00,
        shakes : 5.00,
        banana : 6.00,
        puppy : 5.00,
        drinks :  1.00
      }

    useEffect(()=>{
       console.log('Current state of ingsFlag:', ingsFlag);
    },[listaDeIngredientes])

    // useEffect(()=>{
    //     localStorage.setItem('AGUA',JSON.stringify(agua))
    // },[agua])


    const playSound = () => {
        const audio = new Audio('/sounds/success.mp3'); // path is relative to public/
        audio.play();
    };


    useEffect(() => {
    // Si al menos uno de los favoritos está activado, ocultar ingredientes
    const shouldHide = Object.values(favoriteFlag).some(flag => flag === true);
    setHideIngredients(shouldHide);

    }, [favoriteFlag]);

   
               


    useEffect(()=>{
        var storeFavFlags = JSON.parse(localStorage.getItem('FavFlag'));
        var storeAgua = JSON.parse(localStorage.getItem('AGUA'));
        var storeName = JSON.parse(localStorage.getItem(LOCAL_NAME_KEY));
        var storeType = JSON.parse(localStorage.getItem(LOCAL_TYPE_KEY));
        var storedIngs = JSON.parse(localStorage.getItem(LOCAL_INGS_KEY));
        var storeTops = JSON.parse(localStorage.getItem(LOCAL_TOPS_KEY));
        var storeQty = JSON.parse(localStorage.getItem(LOCAL_QTY_KEY));
        var storeComments = JSON.parse(localStorage.getItem(LOCAL_CMTS_KEY));
        var storeNewItem = JSON.parse(localStorage.getItem(LOCAL_ITEM_KEY));
        var storeOrder = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
        var storePM = JSON.parse(localStorage.getItem(LOCAL_PM_KEY));

        // localStorage.setItem('FavFlag',JSON.stringify(favoriteFlag))

            //  setButtons((prev) =>
            //                prev.map((item) =>
            //                item.ruta === 'bebidas' ? { ...item, selected: true } : item
            //                )
            //     );

        if (checkButtons){
            if (storeFavFlags){
                setFavFlag(storeFavFlags)
            }
            if(storeName){
                setName(storeName)
            }
            
            if(storedIngs){
             
                setIngs(storedIngs)
                if (Object.keys(storedIngs).length > 0) {
                    setButtons((prev) =>
                           prev.map((item) =>
                           item.ruta === 'ingredientes' ? { ...item, selected: true } : item
                           )
                       );
                }
                storedIngs.forEach(function(i){
                    var ingKey = i + 'Ing';
                    console.log(ingKey)
                    if(localStorage.getItem(ingKey) !== null){
                        for (const key in ingsFlag){
                            if(key === ingKey){
                                if(localStorage.getItem(ingKey) === '1'){
                                    console.log()
                                    ingsFlag[ingKey] = true
                                    console.log("Key set to true",ingsFlag[ingKey])

                                }
                                else{
                                    ingsFlag[ingKey] = false
                                    console.log("Key set to false",ingsFlag[ingKey])

                                }
                            }
                            else{
                                console.log("No key found")
                            }
                        }
                    }
                    else{
                        console.log("NULL")
                    }
                   
                })
            }
             if (storeTops) {
                setTops(storeTops);
                if (Object.keys(storeTops).length > 0) {
                    setButtons((prev) =>
                           prev.map((item) =>
                           item.ruta === 'toppings' ? { ...item, selected: true } : item
                           )
                       );
                }

                Object.values(storeTops).forEach((toppingList) => {
                    toppingList.forEach((topping) => {
                    const topKey = topping + 'Top';
                    if (localStorage.getItem(topKey)) {
                        setTopsFlag(prev => ({
                        ...prev,
                        [topKey]: localStorage.getItem(topKey) === '1'
                        }));
                    }
                    });
                });
                }

            if(storeType){
                setButtons((prev) =>
                    prev.map((item) =>
                    item.ruta === 'tipo' ? { ...item, selected: true } : item
                    )
                );
                 if (storeAgua > 0){
                        setAgua(storeAgua)
                        console.log("Store Qty is greater than 0")
                        setButtons((prev) =>
                           prev.map((item) =>
                           item.ruta === 'bebidas' ? { ...item, selected: true } : item
                           )
                        );
                    }
                    else{
                        console.log("Store Qty in Else:", storeAgua)

                    }
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
                else if (storeType === 'drinks'){
                    typeFlags['drinks']= true
                    console.log("DRINKS")

                   
                }
      
  
            }
            if(storeQty){
                 setButtons((prev) =>
                        prev.map((item) =>
                        item.ruta === 'cantidad' ? { ...item, selected: true } : item
                        )
                );
                if (storeQty != qty){
                    setQty(storeQty)
                }
            }
            if(storeComments){
                setButtons((prev) =>
                        prev.map((item) =>
                        item.ruta === 'comentarios' ? { ...item, selected: true } : item
                        )
                );
                if (storeComments != comments){
                    setComments(storeComments)
                }
            }
            if(storeNewItem){
                if (storeNewItem != newItem){
                    console.log("Item Type", storeNewItem.type)
                    setNewItem(storeNewItem)
                    // if (storeNewItem.type != 'drinks'){
                    // }
                    // else if (storeNewItem.type == 'drinks') {
                    //     setNewDrinkItem(storeNewItem)
                    // }
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

        axios.get('/ingrediente').then(response=>{
            const respuesta_ingredientes = response.data 
            actualizarIngredientes(respuesta_ingredientes)
            
        }).catch(error =>{
            console.log("Error", error)
        })

        axios.get('/topping').then(response=>{
            const respuesta_topping = response.data 
            actualizarToppings(respuesta_topping)
            
        }).catch(error =>{
            console.log("Error", error)
        })


        axios.get('/favorite').then(response=>{
            const respuesta_favorite = response.data 
            actualizarFavoritos(respuesta_favorite)
            
        }).catch(error =>{
            console.log("Error", error)
        })

        setLoading(false);


        

        // 


    },[])

    const handleIngredientSearch = (event) =>{

        buscar_ingrediente(event.target.value)

    }
    const handleToppingSearch = (event) =>{

        buscar_topping(event.target.value)

    }
    const handleFavoritesSearch = (event) =>{

        buscar_favorito(event.target.value)

    }


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


    useEffect(()=>{

        if (favorito_a_buscar !== ""){
    
            const params = { nombre: favorito_a_buscar}
            axios.get('/favorite',{params}).then(response=>{
    
            actualizarFavoritos(response.data)
                
            }).catch(error =>{
                console.log("Error", error)
            })
    
           
        }
        else if(favorito_a_buscar === ""){
            axios.get('/favorite').then(response=>{
    
            actualizarFavoritos(response.data)
                
            }).catch(error =>{
                console.log("Error", error)
            })
        }
        
       
    },[favorito_a_buscar])


    


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

    useEffect(() => {
    const hasAnyIngredient = Object.values(ingsFlag).some(flag => flag === true);
    setHideFavorites(hasAnyIngredient);
    }, [ingsFlag]);

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

            if (newItem.ings != undefined || newItem.type == 'drinks'){
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
        setSumtoSubstract(0)
    },[totalToPay])


    useEffect(()=>{
        var same = false
        var deletion = false
        var editing = false
        if (localStorage.getItem(LOCAL_TOTAL_KEY) == undefined){
            localStorage.setItem(LOCAL_TOTAL_KEY,0)
        }
        if(orderMounted.current){
            if (JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))?.items != undefined && order?.items != undefined){
                var compareMe = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))
                console.log("Are the items the same in both variables?", order?.items.length === compareMe.items.length)
                console.log("Order State Variable Items: ",order?.items)
                console.log("Order LS Variable Items: ",compareMe.items)
                if (order?.items.length === compareMe.items.length){
                    if (JSON.stringify(order?.items) === JSON.stringify(compareMe.items)){
                        console.log("Mismos")
                        same = true
                    }
                    else{
                        console.log("No son los mismos")
                

                        same = false
                        editing = true
                    }
                    // console.log("Same is", same)

                }
                if(order?.items.length < compareMe.items.length){
                    deletion = true
                    // console.log("Deletion is", deletion)

                }
                // console.log("Change in Order Detected")
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
                            // console.log("Quantity of this item: ", itemQty)
            
                            var sumToTotal = itemCosts[storedItems[item][key]] * itemQty
                            // console.log("Sum to total pay, please: ", sumToTotal)
                            // console.log("Same is", same,"before trying to sum")
                            if (same == false && deletion == false){
                                if (editing == false){
                                    setTotalToPay(parseFloat(totalToPay) + sumToTotal)
                                    localStorage.setItem(LOCAL_TOTAL_KEY,parseFloat(totalToPay) + sumToTotal)
                                    console.log("Summed Quantity")
                                   

                                }
                                else{
                                    setTotalToPay(parseFloat(totalToPay) + sumToSubstract)
                                    localStorage.setItem(LOCAL_TOTAL_KEY,parseFloat(totalToPay) + sumToSubstract)
                                    console.log("Substracted Quantity", sumToSubstract)

                                }
                                
                            }
                            else if (same == false && deletion == true){
                                setTotalToPay(parseFloat(totalToPay) - sumToSubstract)
                                localStorage.setItem(LOCAL_TOTAL_KEY,parseFloat(totalToPay) - sumToSubstract)
                                console.log("Substracted Quantity", sumToSubstract)
                            }
                            else if (same == true){
                                console.log("SAMMMEEEEEE")
                                console.log("TOTAL to Pay in LS", localStorage.getItem(LOCAL_TOTAL_KEY))
                                setTotalToPay(localStorage.getItem(LOCAL_TOTAL_KEY))
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

    const handleFavorites = event => {

        showFavorites(current => !current);

    };


    const handleShow = () => showMetodoModal(true)
    const handleClose = () => showMetodoModal(false)


    const add = event => {
        var buttonClasses = event.target.classList;

        if(buttonClasses.contains('ingredients')){
            if (buttonClasses.contains('favorite')){
                    setFavAlert(false)

                    // setType(event.target.value)
                        // setTypeCounter(typeCounter + 1)
                    event.target.classList.add('active')

                    setFavFlag((prevFlags) => {
                            const updatedFlags = {};
                            for (const key in prevFlags) {
                            updatedFlags[key] = key === event.target.value;
                            }
                            localStorage.setItem('FavFlag', JSON.stringify(updatedFlags))

                            return updatedFlags;
                    });     
                    if (event.target.value == "CookiesAndCream"){
                        const ingre = ["Oreo","Chips","Queso"]
                        setIngs(ingre)
                        
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                        //         // localStorage.setItem(LOCAL_INGS_KEY,updatedIngs)
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                        //         // localStorage.setItem(LOCAL_INGS_KEY,updatedIngs)
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)
                    }
                    else if (event.target.value == "CocoNut"){
                        const ingre = ["Coco","Nutella","Almendra"]
                        setIngs(ingre)
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)
    
                    }
                    else if (event.target.value == "CinnamonAndCarrot"){
                        const ingre = ["BizcochoDeZanahoria","Canela","Queso"]
                        setIngs(ingre)
                        
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                                
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)

                 
    
                    }
                    else if (event.target.value == "ILoveCoffee"){
                        const ingre = ["Caramelo","Café","Almendra"]
                        setIngs(ingre)
                       
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                                
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)

                 
    
                    }
                    else if (event.target.value == "Smores"){
                        const ingre = ["Marshmellow","Crackers","Chocolate"]
                        setIngs(ingre)
                       
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                                
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)

                 
    
                    }
                    else if (event.target.value == "StrawberryShortcake"){
                        const ingre = ["Fresa","BizcochoDeVainilla","Queso"]
                        setIngs(ingre)
                     
                        
                        // ingre.map(ingredient=>{
                        //     if (ings.includes(ingredient)){
                        //         const updatedIngs = ings.filter(ing => !ingre.includes(ing))
                        //         setIngs(updatedIngs)
                        //         console.log('removed '+ ingredient + ' from ingredient')
                        //         event.target.classList.remove('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'0')
                                
                        //     }
                        //     else {
                        //         setIngs(prevIngs =>[...prevIngs,ingredient])
                        //         console.log('added '+ ingredient + ' to ingredient')
                        //         event.target.classList.add('active')
                        //         var key = ingredient + 'Ing'
                        //         localStorage.setItem(key,'1')
                
                        //     }
                        // })
                        // setFavCounter(favCounter + 1)
                        
                 
    
                    }
                // }
                
                    
               
            }
            else{
                if (ings.includes(event.target.value)){
                    const updatedIngs = ings.filter(ing => ing !== event.target.value)
                    setIngs(updatedIngs)
                    console.log('removed '+ event.target.value + ' from ingredient')
                    event.target.classList.remove('active')
                    var key = event.target.value + 'Ing'
                    localStorage.setItem(key,'0')
                    setIngsFlag(prevState => ({
                        ...prevState,
                        [key]: false
                    }));
                }
                else {
                    setIngs(prevIngs =>[...prevIngs,event.target.value])
                    console.log('added '+ event.target.value + ' to ingredient')
                    event.target.classList.add('active')
                    var key = event.target.value + 'Ing'
                    localStorage.setItem(key,'1')
                    setIngsFlag(prevState => ({
                        ...prevState,
                        [key]: true
                    }));
    
                }
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
                setTopsFlag(prevState => ({
                    ...prevState,
                    [key]: false
                }));
                
            }
            else {
                setTops(prevTops =>[...prevTops,event.target.value])
                console.log('added '+ event.target.value + ' to toppings')
                event.target.classList.add('active')
                var key = event.target.value + 'Top'
                localStorage.setItem(key,'1')

                setTopsFlag(prevState => ({
                    ...prevState,
                    [key]: true
                }));

            }
        }
        else if((buttonClasses.contains('type'))){
                setTypeAlert(false)

                setType(event.target.value)
                    // setTypeCounter(typeCounter + 1)
                event.target.classList.add('active')

                setTypeFlags((prevFlags) => {
                        const updatedFlags = {};
                        for (const key in prevFlags) {
                        updatedFlags[key] = key === event.target.value;
                        }
                        return updatedFlags;
                });     
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
    const handleIncrementAgua = () => {
        setAgua(agua + 1);
      };
    
    const handleDecrementAgua = () => {
        if (agua > 0){
            setAgua(agua - 1);
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
        // alert('Item Added!');
        // toast.success('Item added successfully!');
        // toast.dismiss()
        // toast.success('This is a success message!', {
        //     position: 'top-right',
        //     autoClose: 3000,
        //   });


        if (type == ""){
            setRequired(true)   
            toast.error("Escoge un Type (Rolls, Shakes, Banana, Puppy o Drinks")

        }
        else if(qty == 0 && type != 'drinks'){
            setRequired(true)   
            if (qty == 0){
                toast.error("Cantidad no puede ser cero")
            }


        }
        else{
            if (type == 'drinks'){
                console.log("Different Item")
                setNewItem({
                    item_id: getRandomInt(0,100000000),
                    type:type,
                    nombre:"Agua",
                    qty:agua

                })
                setAgua(0)
                setType("")
                setTypeCounter(typeCounter -1)
                setIngs([])
                setTops([])
                setRequired(false)   
                setQty(0)
                setComments("")
                setComponentKey(prevKey => prevKey + 1);
            }
            else{
                console.log("EVENT")
                setNewItem({
                    item_id: getRandomInt(0,100000000),
                    type:type,
                    ings:ings,
                    tops: Object.values(tops),
                    qty:qty,
                    comments:comments
                });
                setType("")
                setTypeCounter(typeCounter -1)
                setIngs([])
                setTops({})
                setRequired(false)   
                setQty(0)
                setComments("")
                setComponentKey(prevKey => prevKey + 1);
                setIngsFlag(prevState => {
                    // Create a new object with all keys set to false
                    const resetFlags = {};
                    Object.keys(prevState).forEach(key => {
                        resetFlags[key] = false;
                    });
                    return resetFlags;
                });
                setTopsFlag(prevState => {
                    // Create a new object with all keys set to false
                    const resetFlags = {};
                    Object.keys(prevState).forEach(key => {
                        resetFlags[key] = false;
                    });
                    return resetFlags;
                });
                setFavFlag(prevState => {
                const resetFlags = {};
                Object.keys(prevState).forEach(key => {
                    resetFlags[key] = false;
                });
                return resetFlags;
                });
                localStorage.setItem('FavFlag', JSON.stringify({
                CookiesAndCream: false,
                CocoNut: false,
                ILoveCoffee: false,
                Smores: false,
                CinnamonAndCarrot: false,
                StrawberryShortcake: false
                }));

                setButtons(prevButtons =>
                prevButtons.map(btn => ({
                    ...btn,
                    selected: false
                }))
                );
                window.location.reload()


                

            }
            toast.success('Item añadido a la orden!')
            // playSound()

        }
        

    }
    const reloadChannel = new BroadcastChannel('reload-channel');

    const handleSave = ( ) =>{
        setIsInputDisabled(!isInputDisabled);
    }
    
   const {hideOrders,toggleHideOrders} = useContext(ItemContext)
   
   const handleShowOrders = () =>{
    toggleHideOrders(prev => !prev)
  }

    // const buttons = ['Tipo', 'Ingredientes', 'Cantidad', 'Toppings', 'Comentarios'];

    const [buttons,setButtons] = useState([
        {label:'Tipo',ruta:'tipo', selected:false},
        {label:'Bebidas',ruta:'bebidas', selected:false},
        {label:'Ingredientes',ruta:'ingredientes', selected:false},
        {label:'Cantidad',ruta:'cantidad', selected:false},
        {label:'Toppings',ruta:'toppings', selected:false},   
        // {label:'Comentarios',ruta:'comentarios',selected:false},   
    ])
    const [loading, setLoading] = useState(false);
    const [ruta,setRuta] = useState('')
    const choose = ((ruta)=>{
        console.log(ruta)
        setRuta(ruta)
        setLoading(true);
        setTimeout(() => {
            // window.location.href = `/${ruta}`;
            setLoading(false);

        }, 500); // match animation duratio
        

    })
    const [isSaved, setIsSaved] = useState(false);

    const handleGuardado = () => {
        setIsSaved(true);
        // Optional: Reset to false after a few seconds
        // setTimeout(() => setIsSaved(false), 3000);
        if (type == "drinks"){
            localStorage.setItem('AGUA',JSON.stringify(agua))
        }
    };
    const handleVolver = () => {
    window.location.href = '/terminal'; // or use navigate() if using react-router
    };
    

    const scrollRef = useRef(null);

    const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 150;
    };

    const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 150;
    };

    const [showSelection, setShowSelection] = useState(false);



    if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 w-100">
        <span
            className="spinner-border spinner-border-lg ms-2"
            role="status"
            aria-hidden="true"
        ></span>
        <span className="display-3 mt-4 fw-bold">Cargando...</span>
      </div>
    );
     }
    else if(ruta == 'tipo') {
        return (
            <div className="container mt-4">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <button 
                        className="btn btn-outline-dark me-2" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="mb-4">Elige un Tipo</h2>
                </div>
                <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center">
                    {/* Your buttons or cards can go here */}
                            { typeAlert && <div className='text-danger text-center'>Only One Type per Item</div> }
                    <div className='mt-3 mb-3 d-flex flex-wrap w-100 justify-content-center align-items-center ' style={{height:'80vh'}}>
                            {/* <div className="col w-25 type-text text-start">Type</div> */}
                            <div className=" d-flex flex-wrap w-100 justify-content-around align-items-center gap-3"  >
                                    <button style={{width: '300px', height: '175px'}} className={typeFlags.rolls ? 'btn btn-outline-secondary rounded-pill type active p-3' : 'rounded-pill btn btn-outline-secondary type p-3'} value={'rolls'} onClick={add}> <h4 className='display-4' style={{pointerEvents : 'none'}}>Rolls</h4> </button>
                                    <button style={{width: '300px', height: '175px'}} className= {typeFlags.shakes ? 'btn btn-outline-secondary type rounded-pill active p-3':'rounded-pill btn btn-outline-secondary type p-3'}  value={'shakes'} onClick={add}> <h4 className='display-4' style={{pointerEvents : 'none'}}>Shakes</h4> </button>
                                    <button style={{width: '300px', height: '175px'}} className={typeFlags.banana ? 'btn btn-outline-secondary rounded-pill type active p-3':'rounded-pill btn btn-outline-secondary type p-3'} value={'banana'} onClick={add}> <h4 className='display-4' style={{pointerEvents : 'none'}}>Banana</h4> </button>
                                    <button style={{width: '300px', height: '175px'}} className={typeFlags.puppy ? 'btn btn-outline-secondary rounded-pill type active p-3':'rounded-pill btn btn-outline-secondary type p-3'} value={'puppy'} onClick={add}> <h4 className='display-4' style={{pointerEvents : 'none'}}>Puppy</h4> </button>
                                    <button style={{width: '300px', height: '175px'}} className={typeFlags.drinks ? 'btn btn-outline-secondary rounded-pill type active p-3':'rounded-pill btn btn-outline-secondary type p-3'} value={'drinks'} onClick={add}> <h4 className='display-4' style={{pointerEvents : 'none'}}>Drinks</h4> </button>
                            </div>
                          <div className="d-flex flex-row align-items-center gap-4 mt-5">
                            <button
                                className={`btn ${isSaved ? 'btn-success' : 'btn-primary'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                onClick={handleGuardado}
                            >
                                {isSaved ? (
                                <>
                                    <i className="bi bi-check-circle-fill text-white display-5"></i>
                                    <h4 className="display-4  p-4">Guardado</h4>
                                </>
                                ) : (
                                <h4 className="display-4  p-4">Guardar</h4>
                                )}
                            </button>

                            {isSaved && (
                                <button
                                className="btn btn-outline-dark rounded-pill px-5 py-3"
                                onClick={handleVolver}
                                >
                                <h4 className=" display-4 p-4">Volver</h4>
                                </button>
                            )}
                            </div>
                   
                    
                    </div>
                </div>

            </div>
        );
                
     }
     else if(ruta == 'ingredientes') {
        return (
            <div className="container mt-4 d-flew flex-column justify-content-center align-items-center gap-4" style={{maxHeight:'100vh',maxWidth:'90vw'}}>
                <div className="d-flex flex-row justify-content-between align-items-center" style={{maxWidth:'90vw',minWidth:'90vw'}}>
                    <button 
                        className="btn btn-outline-dark" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="">Elige Ingredientes</h2>
                </div>
               < div className=" d-flex flex-column align-items-center justify-content-center">
                {/* <div className="d-flex flex-wrap gap-3 justify-content-center" > */}
                {/* Your buttons or cards can go here */}
                     <div className='' style={{minWidth:'90vw'}}>
                           <div className="">
                            <button 
                                className={`rounded-3 w-100 col d-flex flex-row text-start justify-content-between border border-light p-4 ${
                                hideFavorites ? 'bg-secondary-subtle' : 'bg-light'
                                }`}
                                disabled={hideFavorites}
                            >
                                <div className="lead" onClick={!hideFavorites ? handleFavorites : undefined}>
                                Favorites
                                </div>

                                {hideIngredients && (
                                <button 
                                className="btn btn-outline-danger p-3 rounded-pill" 
                                onClick={() => {
                                    setFavFlag({
                                    CookiesAndCream: false,
                                    CocoNut: false,
                                    ILoveCoffee: false,
                                    Smores: false,
                                    CinnamonAndCarrot: false,
                                    StrawberryShortcake: false,
                                    });
                                    setIngs([]);
                                    localStorage.setItem('FavFlag', JSON.stringify({
                                    CookiesAndCream: false,
                                    CocoNut: false,
                                    ILoveCoffee: false,
                                    Smores: false,
                                    CinnamonAndCarrot: false,
                                    StrawberryShortcake: false,
                                    }))
                                    localStorage.setItem(LOCAL_INGS_KEY, JSON.stringify([]));
                                }}
                                >
                                Quitar selección
                                </button>
                            )}

                                <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-search"></i>
                                <input 
                                    type="text" 
                                    className="form-control form-control-md"
                                    style={{ maxWidth: '150px' }}
                                    onChange={!hideFavorites ? handleFavoritesSearch : undefined}
                                    placeholder="Search"
                                    disabled={hideFavorites}
                                />
                                </div>
                            </button>

                            <div 
                                className="overflow-scroll d-flex flex-wrap"
                                style={{ opacity: hideFavorites ? 0.5 : 1, pointerEvents: hideFavorites ? 'none' : 'auto' }}
                            >
                                {listaDeFavoritos.map(fav => (
                                <button
                                    key={fav.nombre}
                                    className={
                                    favoriteFlag[fav.nombre]
                                        ? 'btn btn-outline-secondary m-1 ingredients rounded-pill favorite active p-4'
                                        : 'rounded-pill btn btn-outline-secondary m-1 favorite ingredients p-4'
                                    }
                                    value={fav.nombre}
                                    onClick={add}
                                    disabled={hideFavorites}
                                >
                                    {fav.nombre}
                                </button>
                                ))}
                            </div>

                            
                            </div>


                            {/* {favoritesButtons && <div className="overflow-scroll d-flex" >
                                {listaDeFavoritos.map(fav=>(
                                    <button className={favoriteFlag[`${fav.nombre}`]  ? 'btn btn-outline-secondary m-1 ingredients favorite active p-3 ' : 'btn btn-outline-secondary m-1 favorite ingredients p-3' }value={fav.nombre} onClick={add}  >{fav.nombre}</button>
                                ))}
                               
                        

                                </div>} */}
                       <div className=" d-flex flex-column align-items-center justify-content-center">
                            <button 
                                className={`rounded-3 w-100 col d-flex flex-row text-start justify-content-between border align-items-center border-light p-4 m-2 ${
                                hideIngredients ? 'bg-secondary-subtle' : 'bg-light'
                                }`}
                                disabled={hideIngredients}
                            >
                                <div className="lead" onClick={!hideIngredients ? handleIngredients : undefined}>
                                Ingredients
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-search"></i>
                                <input 
                                    type="text" 
                                    className="form-control form-control-md"
                                    style={{ maxWidth: '150px' }}
                                    onChange={!hideIngredients ? handleIngredientSearch : undefined}
                                    placeholder="Search"
                                    disabled={hideIngredients}
                                />
                                </div>
                            </button>

                            <div className="d-flex flex-row justify-content-between align-items-center w-100 mt-3 mb-3 m-2">
                                <button 
                                className="btn btn-outline-dark" 
                                onClick={!hideIngredients ? scrollLeft : undefined}
                                disabled={hideIngredients}
                                >
                                <i className="bi bi-chevron-left"></i>
                                </button>

                                <button 
                                className="btn btn-outline-dark" 
                                onClick={!hideIngredients ? scrollRight : undefined}
                                disabled={hideIngredients}
                                >
                                <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>

                            <div className="d-flex align-items-center">
                                <div 
                                className="overflow-scroll d-flex flex-row flex-nowrap"
                                ref={scrollRef}
                                style={{
                                    maxWidth: '90vw',
                                    maxHeight: '30vh',
                                    opacity: hideIngredients ? 0.5 : 1,
                                    pointerEvents: hideIngredients ? 'none' : 'auto',
                                }}
                                >
                                {listaDeIngredientes.map((ing) => (
                                    <button
                                    key={ing.nombre}
                                    className={
                                        ingsFlag[`${ing.nombre}Ing`]
                                        ? 'btn btn-outline-secondary m-1 ingredients active p-4 rounded-pill w-100'
                                        : 'btn btn-outline-secondary m-1 ingredients p-4 rounded-pill w-100'
                                    }
                                    value={ing.nombre}
                                    onClick={add}
                                    disabled={hideIngredients}
                                    >
                                    {ing.nombre}
                                    </button>
                                ))}
                                </div>
                            </div>

                            <div className="" style={{maxWidth: '90vw',minWidth: '90vw', maxHeight: '30vh', overflowY: 'auto'}}>
                                {ings.length > 0 && (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div 
                                        className=" position-fixed  bottom-0 m-4"
                                        style={{ zIndex: 1000 }}
                                        >
                                            <div className="d-flex flex-row align-items-center gap-4">
                                                <button
                                                className={`btn ${isSaved ? 'btn-success' : 'btn-dark'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                                onClick={handleGuardado}
                                                >
                                                {isSaved ? (
                                                    <>
                                                    <i className="bi bi-check-circle-fill text-white lead"></i>
                                                    <h4 className="lead">Guardado</h4>
                                                    </>
                                                ) : (
                                                    <h4 className="lead">Guardar</h4>
                                                )}
                                                </button>

                                                {isSaved && (
                                                <button
                                                    className="btn btn-dark rounded-pill px-5 py-3"
                                                    onClick={handleVolver}
                                                >
                                                    <h4 className="lead">Volver</h4>
                                                </button>
                                                )}
                                            </div>
                                        </div>



                                    <div className="mt-3 bg-primary p-4 rounded-5 " style={{maxWidth: '90vw',minWidth: '90vw', maxHeight: '30vh', overflowY: 'auto'}}>
                                        <h4 className="text-center text-light lead fw-bold">Ingredientes Seleccionados</h4>
                                        <ul className="list-group d-flex flex-row flex-wrap justify-content-around w-100">
                                        {ings.map((ing, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-4 mb-1 rounded-5 bg-light">
                                            <div className="lead">
                                                {ing}
                                            </div>
                                            
                                             {!hideIngredients && (
                                               <button 
                                                className="btn btn-danger btn-md ms-4" 
                                                onClick={() => {
                                                const updatedIngs = ings.filter(i => i !== ing);
                                                setIngs(updatedIngs);
                                                var key = ing + 'Ing';
                                                localStorage.setItem(key,'0');
                                                setIngsFlag(prevState => ({
                                                    ...prevState,
                                                    [key]: false
                                                }));
                                                }}
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                            )}
                                            
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                    </div>
                                )}
                            </div>
                            </div>

                        </div>


            </div>
            </div>
        );
                
     }
     else if(ruta == 'toppings') {
        return (
            <div className="container mt-4">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <button 
                        className="btn btn-outline-dark me-2" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="mb-4">Elige Toppings</h2>

                </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {/* Your buttons or cards can go here */}
                 {/* Toppings Section */}
         {qty >= 1 && (
            <>
                <h4 className="text-secondary mb-3">Toppings por helado</h4>
                {Array.from({ length: qty }, (_, i) => {
                const heladoNum = i;
                const toppingSet = tops[heladoNum] || [];

                return (
                    <div key={heladoNum} className="mb-4">
                        <div className="">
                            <h5>Helado #{heladoNum + 1}</h5>
                            {/* <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-search"></i>
                                <input 
                                    type="text" 
                                    className="form-control form-control-md"
                                    style={{ maxWidth: '150px' }}
                                    onChange={handleToppingSearch}
                                    placeholder="Search"
                                    // disabled={hideFavorites}
                                />
                                </div> */}
                        </div>
                    <div className="d-flex flex-wrap gap-3 mt-2 justify-content-center">
                        {listaDeToppings.map((opt, idx) => (
                        <button
                            type="button"
                            key={idx}
                            className={`btn btn-outline-primary fw-bold px-4 py-3 fs-5 rounded-3 ${
                            toppingSet.includes(opt.nombre) ? 'active' : ''
                            }`}
                            onClick={() => {
                            const updatedSet = [...toppingSet];
                            const index = updatedSet.indexOf(opt.nombre);
                            if (index > -1) {
                                updatedSet.splice(index, 1); // remove
                            } else if (updatedSet.length < 3) {
                                updatedSet.push(opt.nombre); // add
                            }

                            setTops(prev => ({
                                ...prev,
                                [heladoNum]: updatedSet
                            }));
                            }}
                        >
                            {opt.nombre}
                        </button>
                        ))}
                    </div>
                    </div>
                );
                })}
            </>
            )}
            {/* Selection Summary */}
            {qty >= 1 && (
            <div className="mt-4 bg-light p-4 rounded-4 shadow-sm d-flex flex-column justify-content-center align-items-center" style={{maxWidth: '90vw',minWidth: '90vw'}}>
                <h4 className="text-secondary">Tu selección</h4>
                <ul className="list-group mt-3">

                {Object.entries(tops).map(([index, tSet]) => (
                    <li key={index} className="list-group-item fs-5">
                    <strong>Toppings Helado #{parseInt(index) + 1}:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {tSet.length > 0 ? (
                        tSet.map((top, i) => (
                            <span key={i} className="badge bg-primary fs-6 p-3 rounded-pill">
                            {top}
                            <button
                                type="button"
                                className="btn btn-sm btn-light ms-2 py-0 px-2"
                                onClick={() => {
                                const updated = [...tSet];
                                updated.splice(i, 1);
                                setTops(prev => ({
                                    ...prev,
                                    [index]: updated
                                }));
                                }}
                            >
                                ✕
                            </button>
                            </span>
                        ))
                        ) : (
                        <span className="text-muted">Ninguno</span>
                        )}
                    </div>
                    </li>
                ))}

                <li className="list-group-item fs-5">
                    <strong>Cantidad de helados:</strong> {qty}
                </li>
                </ul>
                       <div 
                                        className="d-flex align-items-center justify-content-center m-4"
                                        style={{ zIndex: 1000 }}
                                        >
                                            <div className="d-flex flex-row align-items-center gap-4">
                                                <button
                                                className={`btn ${isSaved ? 'btn-success' : 'btn-dark'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                                onClick={handleGuardado}
                                                >
                                                {isSaved ? (
                                                    <>
                                                    <i className="bi bi-check-circle-fill text-white lead"></i>
                                                    <h4 className="lead">Guardado</h4>
                                                    </>
                                                ) : (
                                                    <h4 className="lead">Guardar</h4>
                                                )}
                                                </button>

                                                {isSaved && (
                                                <button
                                                    className="btn btn-dark rounded-pill px-5 py-3"
                                                    onClick={handleVolver}
                                                >
                                                    <h4 className="lead">Volver</h4>
                                                </button>
                                                )}
                                            </div>
                                        </div>
                
            </div>
            )}


            </div>
            </div>
        );
                
     }
     else if(ruta == 'bebidas') {
        return (
            <div className="container mt-4 d-flew flex-column justify-content-center align-items-center gap-4" style={{maxHeight:'100vh',maxWidth:'90vw'}}>
                <div className="d-flex flex-row justify-content-between align-items-center">

                    <button 
                        className="btn btn-outline-dark me-2" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="mb-4">Elige Bebida</h2>

                </div>
                    <div className=' d-flex flex-column m-2 p-3 lead justify-content-center align-items-center ' style={{ width: '90vw' }}>
                         <div className="lead">Agua</div>
                         <div className="d-flex flex-row justify-content-around align-items-center gap-3 w-100">
                            <button className='btn btn-outline-primary rounded-pill lead' onClick={handleDecrementAgua}>-</button>
                            <div className="lead">
                                {agua}
                            </div>
                            <button className='btn btn-outline-primary rounded-pill lead' onClick={handleIncrementAgua}>+</button>
                         </div>
                     </div>
                           <div className="d-flex flex-row align-items-center justify-content-center gap-4 mt-5">
                            <button
                                className={`btn ${isSaved ? 'btn-success' : 'btn-primary'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                onClick={handleGuardado}
                            >
                                {isSaved ? (
                                <>
                                    <i className="bi bi-check-circle-fill text-white display-5"></i>
                                    <h4 className="display-4  p-4">Guardado</h4>
                                </>
                                ) : (
                                <h4 className="display-4  p-4">Guardar</h4>
                                )}
                            </button>

                            {isSaved && (
                                <button
                                className="btn btn-outline-dark rounded-pill px-5 py-3"
                                onClick={handleVolver}
                                >
                                <h4 className=" display-4 p-4">Volver</h4>
                                </button>
                            )}
                </div>
                {/* <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <div className=' d-flex flex-column m-2 p-3  justify-content-center align-items-center gap-3' style={{width:'90vw'}}>
                            <div className=" display-6">Cantidad</div>
                            <div className=" d-flex flex-row w-100 justify-content-around align-items-center">
                                    <button className='btn btn-primary rounded-pill display-6' onClick={handleDecrement}><p className='display-6'>-</p></button>
                                
                                <div className=" display-6 ">
                                {qty}
                                </div>
                                    <button className='btn btn-primary rounded-pill display-6' onClick={handleIncrement}><p className='display-6'>+</p></button>
                            </div>
            
                    </div>
                    <div className="d-flex flex-row align-items-center gap-4 mt-5">
                                <button
                                    className={`btn ${isSaved ? 'btn-success' : 'btn-primary'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                    onClick={handleGuardado}
                                >
                                    {isSaved ? (
                                    <>
                                        <i className="bi bi-check-circle-fill text-white display-5"></i>
                                        <h4 className="display-4  p-4">Guardado</h4>
                                    </>
                                    ) : (
                                    <h4 className="display-4  p-4">Guardar</h4>
                                    )}
                                </button>

                                {isSaved && (
                                    <button
                                    className="btn btn-outline-dark rounded-pill px-5 py-3"
                                    onClick={handleVolver}
                                    >
                                    <h4 className=" display-4 p-4">Volver</h4>
                                    </button>
                                )}
                    </div>


                </div> */}
            </div>
        );
                
     }
      else if(ruta == 'cantidad') {
        return (
            <div className="container mt-4">
                <div className="d-flex flex-row justify-content-between align-items-center">

                    <button 
                        className="btn btn-outline-dark me-2" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="mb-4">Elige Cantidad</h2>

                </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {/* Your buttons or cards can go here */}
                <div className=' d-flex flex-column m-2 p-3  justify-content-center align-items-center gap-3' style={{width:'90vw'}}>
                         <div className=" display-6">Cantidad</div>
                         <div className=" d-flex flex-row w-100 justify-content-around align-items-center">
                                <button className='btn btn-primary rounded-pill display-6' onClick={handleDecrement}><p className='display-6'>-</p></button>
                             
                             <div className=" display-6 ">
                             {qty}
                             </div>
                                 <button className='btn btn-primary rounded-pill display-6' onClick={handleIncrement}><p className='display-6'>+</p></button>
                         </div>
        
                </div>
                <div className="d-flex flex-row align-items-center gap-4 mt-5">
                            <button
                                className={`btn ${isSaved ? 'btn-success' : 'btn-primary'} rounded-pill p-4 d-flex align-items-center justify-content-center gap-3`}
                                onClick={handleGuardado}
                            >
                                {isSaved ? (
                                <>
                                    <i className="bi bi-check-circle-fill text-white display-5"></i>
                                    <h4 className="display-4  p-4">Guardado</h4>
                                </>
                                ) : (
                                <h4 className="display-4  p-4">Guardar</h4>
                                )}
                            </button>

                            {isSaved && (
                                <button
                                className="btn btn-outline-dark rounded-pill px-5 py-3"
                                onClick={handleVolver}
                                >
                                <h4 className=" display-4 p-4">Volver</h4>
                                </button>
                            )}
                </div>


            </div>
            </div>
        );
                
     }
     else if(ruta == 'comentarios') {
        return (
            <div className="container mt-4">
                <div className="d-flex flex-row justify-content-between align-items-center">

                    <button 
                        className="btn btn-outline-dark me-2" 
                        // onClick={!hideIngredients ? scrollLeft : undefined}
                        onClick={handleVolver}
                        // disabled={hideIngredients}
                        >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h2 className="mb-4">Escribe Comentarios</h2>

                </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {/* Your buttons or cards can go here */}
            </div>
            </div>
        );
                
     }


    return (
        <div className="bg-light terminal-screen container-fluid py-4" style={{ minHeight: '100vh' }}>

  {/* Encabezado */}
  <div className="row justify-content-center mb-4">
    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
      <div
        className="btn btn-outline-primary rounded-pill px-4 py-3 w-100 text-center"
        onClick={handleShowOrders}
      >
        <span className="lead">Orders Screen</span>
      </div>
    </div>
    <div className="col-12 col-md-6">
      <input
        type="text"
        name="cliente"
        className="form-control border border-dark rounded-3 fs-4 py-3"
        placeholder="Nombre del Cliente"
        value={name}
        onChange={handleName}
      />
    </div>
  </div>

  {/* Botones */}
  <div className="row justify-content-center">
    <div className="col-12 d-flex flex-wrap justify-content-center gap-4">
   {buttons
    .filter((but) => {
        // Hide "Bebidas" unless type is "drinks"
        if (but.ruta === 'bebidas' && type !== 'drinks') return false;

        // Hide "Ingredientes" and "Toppings" if type is "drinks"
        if ((but.ruta === 'ingredientes' || but.ruta === 'toppings' || but.ruta === 'cantidad') && type === 'drinks') return false;

        return true;
    })
    .map((but) => {
        let isDisabled = false;
        if (but.ruta === 'ingredientes' && type === 0 ||type === "") isDisabled = true;
        if (but.ruta === 'cantidad' && ings.length === 0) isDisabled = true;
        if (but.ruta === 'toppings' && qty === 0) isDisabled = true;

        return (
        <button
            key={but.ruta}
            className={`btn btn-outline-dark rounded d-flex flex-column align-items-center justify-content-center text-center ${but.ruta}`}
            style={{
            width: '100%',
            maxWidth: '400px',
            height: '180px',
            backgroundColor: isDisabled ? '#dee2e6' : 'transparent',
            color: isDisabled ? '#6c757d' : 'inherit',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => choose(but.ruta)}
            disabled={isDisabled}
        >
            {but.selected && (
            <i className="bi bi-check-circle-fill text-success display-4 mb-2"></i>
            )}
            <h4 className="display-6 m-0">{but.label}</h4>
        </button>
        );
    })}

    </div>
  </div>

  {/* Botón de Añadir Item */}
  <div className="row mt-5 justify-content-center">
    <div className="col-12 col-md-6 text-center">
      <button className="btn btn-primary p-4 rounded-pill w-100 fs-3" onClick={handleNewItem}>
        Añadir Item a la Orden
      </button>
      <Toaster position="top-right" />
    </div>
  </div>
  <div className="text-end me-4 mt-3">
    <button 
        className="btn btn-outline-primary rounded-circle p-3"
        onClick={() => setShowSelection(prev => !prev)}
        title="Tu selección"
    >
        <i className="bi bi-info-lg fs-4"></i>
    </button>
</div>
{showSelection && (
  <div 
    className="position-fixed end-0 bottom-0 bg-light border p-4 rounded shadow"
    style={{ width: '50vw', height: '50vh', zIndex: 999, overflowY: 'auto' }}
  >
    <div className="">
        <h5 className="fw-bold">Tu selección</h5>
         <button 
        className="btn btn-sm btn-outline-danger rounded-circle p-3"
        onClick={() => setShowSelection(prev => !prev)}
        title="Tu selección"
        >
            <i className="bi bi-x-lg"></i>    
        </button>
    </div>

    <ul className="list-group mt-3">
      <li className="list-group-item d-flex flex-row">
        <strong>Tipo:</strong>   
        <div className="">
            <span className="badge bg-dark p-2 fs-6 rounded-pill">
        {type === 'rolls' && 'Rollitos'}
                    {type === 'banana' && 'Banana Split'}
                    {type === 'shakes' && 'Batidas'}
                    {type === 'puppy' && 'Puppy Rolls'}
                    {type === 'drinks' && 'Bebidas'}
            </span>
        </div>
        
      </li>

      {type !== 'drinks' && (
        <>
          <li className="list-group-item">
            <strong>Ingredientes:</strong>
            <div className="mt-2">
              {Array.isArray(ings) && ings.length > 0 ? (
                <ul className="list-group d-flex flex-row flex-wrap">
                  {ings.map((i, idx) => (
                    <span key={idx} className="badge bg-success p-2 fs-6 rounded-pill">
                        <li key={idx} className="text-light bg-success p-1">
                        {i}
                        </li>
                    </span>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">Ninguno</span>
              )}
            </div>
          </li>

          <li className="list-group-item">
            <strong>Toppings por helado:</strong>
            <div className="mt-2">
              {Object.entries(tops).length > 0 ? (
                <ul className="list-group">
                  {Object.entries(tops).map(([idx, list]) => (
                    <li key={idx} className="list-group-item">
                      <strong>Helado #{parseInt(idx) + 1}:</strong>
                      <ul className="mt-1">
                        {list.length > 0 ? (
                          list.map((top, i) => (
                            <span key={i} className="badge bg-primary p-2 fs-6 rounded-pill">

                                <li key={i} className="p-1">{top}</li>
                            </span>
                          ))
                        ) : (
                          <li className="text-muted ps-3">Ninguno</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">Ninguno</span>
              )}
            </div>
          </li>
        </>
      )}

      <li className="list-group-item">
        <strong>Cantidad:</strong>{' '}
        <span  className="badge bg-danger p-2 fs-6 rounded-pill">

        {agua > 0 && qty == 0? `${agua} (agua)` : qty > 0 ? `${qty} (helados)` : 'No asignada'}

        </span>
      </li>
    </ul>
  </div>
)}



</div>

        // <div className=" bg-light terminal-screen" >
        //     <div className=' d-flex flex-column terminal-screen-2' style={{height:'95vh',overflowY:'scroll'}} key={componentKey}>
        //         <div className=" w-100 d-flex flex-row justify-content-around align-items-center" style={{width:'90vw'}}>
        //             <div className=" d-flex  align-items-center justify-content-center btn rounded-pill btn-outline-primary p-2" onClick={handleShowOrders}>Orders Screen</div>
        //             <div className="  pt-4 ">
        //                 {/* <label htmlFor="cliente">Nombre</label> */}
        //                 <div className=" ">
        //                     <input type="text" name='cliente' className=' rounded-3 border-0 p-2' placeholder='Nombre del Ciente' value={name} onChange={handleName} />
        //                     {/* <button type='button' className='btn btn-primary rounded-start-0 p-2 ' onClick={handleSave}>  {isInputDisabled ? 'Change' : 'Save '}</button> */}
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="d-flex flex-column align-items-center " >
        //                 { typeAlert && <div className='text-danger text-center'>Only One Type per Item</div> }
        //          <div className='mt-3 mb-3 d-flex flex-row  w-100 justify-content-center align-items-center '>
        //                 {/* <div className="col w-25 type-text text-start">Type</div> */}
        //                 <div className=" d-flex flex-row w-100 justify-content-around align-items-center "  style={{pointerEvents : 'none'}}>
        //                     <div className=" ms-1 me-1">
        //                         <button style={{pointerEvents : 'auto'}} className={typeFlags.rolls ? 'btn btn-outline-secondary rounded-pill type active p-4' : 'rounded-pill btn btn-outline-secondary type p-4'} value={'rolls'} onClick={add}>Rolls</button>
        //                     </div>
        //                     <div className=" ms-1 me-1">
        //                         <button style={{pointerEvents : 'auto'}} className= {typeFlags.shakes ? 'btn btn-outline-secondary type rounded-pill active p-4':'rounded-pill btn btn-outline-secondary type p-4'}  value={'shakes'} onClick={add}>Shakes</button>
        
        
        //                     </div>
        //                     <div className=" ms-1 me-1">
        //                         <button style={{pointerEvents : 'auto'}} className={typeFlags.banana ? 'btn btn-outline-secondary rounded-pill type active p-4':'rounded-pill btn btn-outline-secondary type p-4'} value={'banana'} onClick={add}>Banana</button>
        
                                
        //                     </div>
        //                     <div className=" ms-1 me-1">
        //                         <button style={{pointerEvents : 'auto'}} className={typeFlags.puppy ? 'btn btn-outline-secondary rounded-pill type active p-4':'rounded-pill btn btn-outline-secondary type p-4'} value={'puppy'} onClick={add}>Puppy</button>
        
        //                     </div>
        //                     <div className=" ms-1 me-1">
        //                         <button style={{pointerEvents : 'auto'}} className={typeFlags.drinks ? 'btn btn-outline-secondary rounded-pill type active p-4':'rounded-pill btn btn-outline-secondary type p-4'} value={'drinks'} onClick={add}>Drinks</button>
        
        //                     </div>
        //                 </div>
        //             </div>

        //             <div  className="overflow-scroll d-flex justify-content-center flex-column">
        //                 {type !== 'drinks' && (
        //             <div className='' style={{width:'90vw'}}>

        //                     <button className="rounded-3 w-100 col d-flex flex-row text-start justify-content-between border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-3 bg-light"  >
        //                         { favAlert && <div className='text-danger text-center'>Only One Favorite combination can be chosen</div> }
                                
        //                         <div className="" onClick={handleFavorites}>
        //                             Favorites
        //                         </div>
        //                         <div className="">
        //                             <input type="text" className='p-1' onChange={handleFavoritesSearch}/>
        //                         </div>
        //                     </button>
        //                     <div className="overflow-scroll d-flex" >
        //                         {listaDeFavoritos.map(fav=>(
        //                             <button className={favoriteFlag[`${fav.nombre}`]  ? 'btn btn-outline-secondary m-1 ingredients rounded-pill favorite active p-4 ' : 'rounded-pill btn btn-outline-secondary m-1 favorite ingredients p-4' }value={fav.nombre} onClick={add}  >{fav.nombre}</button>
        //                         ))}
        //                     </div>
        //                     {/* {favoritesButtons && <div className="overflow-scroll d-flex" >
        //                         {listaDeFavoritos.map(fav=>(
        //                             <button className={favoriteFlag[`${fav.nombre}`]  ? 'btn btn-outline-secondary m-1 ingredients favorite active p-3 ' : 'btn btn-outline-secondary m-1 favorite ingredients p-3' }value={fav.nombre} onClick={add}  >{fav.nombre}</button>
        //                         ))}
                               


        //                         </div>} */}
        //                 </div>
        //                 )}

        //                 {type !== 'drinks' && (
        //                 <div className='' style={{width:'90vw'}}>

        //                     <button className="rounded-3 w-100 col d-flex flex-row text-start justify-content-between border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-3 bg-light"  >
        //                         <div className="" onClick={handleIngredients}>
        //                             Ingredients
        //                         </div>
        //                         <div className="">
        //                             <input type="text" className='p-1' onChange={handleIngredientSearch}/>
        //                         </div>
        //                     </button>
        //                     <div className="overflow-scroll d-flex " >
        //                         {listaDeIngredientes.map(ing=>(
        //                             <button className={ingsFlag[`${ing.nombre}Ing`]  ? 'btn btn-outline-secondary m-1 ingredients active p-3 ' : 'btn btn-outline-secondary m-1 ingredients p-3' }value={ing.nombre} onClick={add}  >{ing.nombre}</button>
        //                     ))}
                                
        //                     </div>
        //                     {/* {ingredientsButtons && <div className="overflow-scroll d-flex " >
        //                         {listaDeIngredientes.map(ing=>(
        //                             <button className={ingsFlag[`${ing.nombre}Ing`]  ? 'btn btn-outline-secondary m-1 ingredients active p-3 ' : 'btn btn-outline-secondary m-1 ingredients p-3' }value={ing.nombre} onClick={add}  >{ing.nombre}</button>
        //                     ))}
                                
        //                     </div>} */}
        //                 </div>
        //                     )}

        //             {type !== 'drinks' && (

        //                 <div className='mt-3' style={{width:'90vw'}}> 
        //                     <button className="rounded-3 w-100 col text-start d-flex flex-row justify-content-between border-light border-top-0 border-end-0 border-start-0 border-bottom-1 p-3 bg-light" >
        //                         <div className="" onClick={handleToppings}>
        //                             Toppings
        //                         </div>
        //                         <div className="">
        //                             <input type="text" className='p-1' onChange={handleToppingSearch}/>
        //                         </div>
        //                     </button>
        //                     <div className="overflow-scroll d-flex" >
        //                         {listaDeToppings.map(top=>(
        //                                 <button className={topsFlag[`${top.nombre}Top`]  ? 'btn btn-outline-secondary m-1 toppings active p-3 ' : 'btn btn-outline-secondary m-1 toppings p-3' }value={top.nombre} onClick={add}  >{top.nombre}</button>
        //                             ))}
                               
        //                     </div>
        //                     {/* {toppingsButtons && <div className="overflow-scroll d-flex" >
        //                         {listaDeToppings.map(top=>(
        //                                 <button className={topsFlag[`${top.nombre}Top`]  ? 'btn btn-outline-secondary m-1 toppings active p-3 ' : 'btn btn-outline-secondary m-1 toppings p-3' }value={top.nombre} onClick={add}  >{top.nombre}</button>
        //                             ))}
                               
        //                     </div>} */}
        //                 </div>


        //             )}
        //             </div>

        //             {type !== 'drinks' && (
          
        //             <div className='col d-flex flex-row m-2 p-3 ' style={{width:'90vw'}}>
        //                 <div className="col">Quantity</div>
        //                 <div className="col d-flex flex-row w-100 justify-content-between">
        //                     <div className="col">
        //                     {qty}
        //                     </div>
        //                     <div className="col">
        //                         <button className='btn btn-outline-primary rounded-pill' onClick={handleDecrement}>-</button>
        //                     </div>
        //                     <div className="col">
        //                         <button className='btn btn-outline-primary rounded-pill' onClick={handleIncrement}>+</button>
        //                     </div>
        //                 </div>
        
        //             </div>
        //                 )}
        //             {type === 'drinks' && (
        //             <div className='col d-flex flex-row m-2 p-3' style={{ width: '90vw' }}>
        //                 <div className="col">Agua</div>
        //                 <div className="col d-flex flex-row w-100 justify-content-between">
        //                 <div className="col">
        //                     {agua}
        //                 </div>
        //                 <div className="col">
        //                     <button className='btn btn-outline-primary rounded-pill' onClick={handleDecrementAgua}>-</button>
        //                 </div>
        //                 <div className="col">
        //                     <button className='btn btn-outline-primary rounded-pill' onClick={handleIncrementAgua}>+</button>
        //                 </div>
        //                 </div>
        //             </div>
        //             )}
        //             {type !== 'drinks' && (
        //             <div className='col m-2 d-flex flex-row justify-content-between ps-3' style={{width:'90vw'}}>
        //                 <div className="col">Comments</div>
        //                 <div className="col">
        //                     <textarea name="" id="" cols="30" rows="1" defaultValue={comments} onChange={handleComments} className='rounded'></textarea>
        //                 </div>
        //             </div>
        //             )}
                    


            
        //         </div>
        //         <div className="col w-100 d-flex justify-content-center align-items-center flex-column">
        //             {/* { required && <div className='text-danger text-center'>Missing fields</div> } */}
        //             <button className='btn btn-primary p-3 rounded-pill' onClick={handleNewItem}>Add Item to Order</button>
        //             {/* <ToastContainer/> */}
        //             <Toaster position="top-right" />

        //         </div>
        //     </div>
        // </div>


  )
}

export default TerminalScreen