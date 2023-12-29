import { useState, useEffect, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import OrderScreen from './components/OrderScreen'
import TerminalScreen from './components/TerminalScreen'


function App() {

  return (
    <div className='d-flex flex-row'>
    <OrderScreen></OrderScreen>
    <TerminalScreen></TerminalScreen>
    </div>
  )
}

export default App
