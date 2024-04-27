import { useState, useEffect, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Terminal from './pages/Terminal'
import Home from './pages/Home'
import Queue from './pages/Queue'
import Sales from './pages/Sales'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { ItemContext } from "../context/ItemContext"


function App() {

  const [order, setOrder] = useState({
    name:"",
    items:[],
    metodo:"",
  });

  const [name, setName] = useState("");

  const [renderOrdersKey, setRenderOrdersKey ] = useState(1);

  const [itemCounter, setItemCounter] = useState(0);

  const [metodo, setMetodo] = useState("");

  const [newItem, setNewItem] = useState({});

  const [totalItems, setTotalItems] = useState(0);
  

  return (
    <ItemContext.Provider value={{totalItems,setTotalItems,order, setOrder, name, setName, renderOrdersKey, setRenderOrdersKey, itemCounter, setItemCounter, metodo, setMetodo, newItem, setNewItem}}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/terminal" element={<Terminal/>}/>
        <Route path="/queue" element={<Queue/>}/>
        <Route path="/sales" element={<Sales/>}/>
      </Routes>
    </ItemContext.Provider>
  )
}

export default App
