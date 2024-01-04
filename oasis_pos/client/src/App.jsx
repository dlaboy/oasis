import { useState, useEffect, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Terminal from './pages/Terminal'
import Queue from './pages/Queue'
import { Routes, Route } from 'react-router-dom'

import { ItemContext } from "../context/ItemContext"


function App() {

  const [order, setOrder] = useState({
    name:"",
    items:[],
    metodo:"",
  });

  const [name, setName] = useState("");

  const [renderOrdersKey, setRenderOrdersKey ] = useState(1);

  return (
    <ItemContext.Provider value={{order, setOrder, name, setName, renderOrdersKey, setRenderOrdersKey}}>
      <Routes>
        <Route path="/terminal" element={<Terminal/>}/>
        <Route path="/queue" element={<Queue/>}/>
      </Routes>
    </ItemContext.Provider>
  )
}

export default App
