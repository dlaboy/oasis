import OrderScreen from '../components/OrderScreen'
import TerminalScreen from '../components/TerminalScreen'

import React from 'react'

export default function Terminal() {
  return (
    <div className='d-flex flex-row'>
        <OrderScreen></OrderScreen>
        <TerminalScreen></TerminalScreen>
    </div>
  )
}
