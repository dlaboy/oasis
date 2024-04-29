import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import axios from 'axios';
import { useEffect, useState } from 'react';
import CurrencyFormatter from '../components/CurrencyFormatter';
import moment from 'moment';
import Table from 'react-bootstrap/Table';



function Sales(){
    const [ATHsales,setATHsales] = useState(0)
    const [CASHsales,setCASHsales] = useState(0)
    const [rolls,setRolls] = useState(0)
    const [shakes,setShakes] = useState(0)
    const [banana,setBanana] = useState(0)
    const [perro,setPerro] = useState(0)
    const [generate,generateReport] = useState(false)
    const timestamp = moment().format('YYYY-MM-DD hh:mm:ss'); // Gets current time in ISO format
    
    
    const handleReport = event => {
        axios.get('/orders/salesATH').then(response=>{
            console.log("Response", typeof(response.data))
            setATHsales(response.data.totalSalesATH)
          }).catch(error =>{
            console.log("Error", error)
          })
        axios.get('/orders/salesCASH').then(response=>{
            console.log("Response", typeof(response.data))
            setCASHsales(response.data.totalSalesCASH)

            }).catch(error =>{
            console.log("Error", error)
        })
        axios.get('/orders/count').then(response=>{
            console.log("Count Response", response.data)
            var map = response.data
            console.log("Map", map)
            map.forEach(object => {
                console.log("iterating calculations")
                console.log("object to look: ", object)

                if (object._id == 'rolls'){
                    console.log("There are rolls")

                    setRolls(object.totalQuantity)
                }
                else if (object._id == 'shakes'){
                    console.log("There are shakes")

                    setShakes(object.totalQuantity)
                }
                else if (object._id == 'banana'){
                    setBanana(object.totalQuantity)
                }
                else if (object._id == 'puppy'){
                    setPerro(object.totalQuantity)
                    

                }
                else{
                    console.log("Types not found")

                }
            })


            }).catch(error =>{
            console.log("Error", error)
        })
        generateReport(true)
        

    };

    return (
        <div>
        <div className="w-100 d-flex flex-row justify-content-between" style={{height:"10vh"}}>
            <div className="d-flex pt-3 w-25 pb-3 text-center">
            <Nav>
            <Nav.Link to='/' as={NavLink} className='btn '>Home</Nav.Link>
            </Nav>
            </div>
            <div className="pt-3 pb-3 d-flex w-75 text-center justify-content-center align-items-center">
                        Sales
            </div>
            <div className="pt-3 pb-3 d-flex w-25 text-center"></div>

        </div>
        <div className='bg-light d-flex justify-content-start align-items-center flex-column' style={{height:"90vh"}}>
                <button className='btn btn-outline-primary rounded-pill p-3 m-2' onClick={handleReport}> Generate Today's Report</button>
                {generate && <Table className='w-75' striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>Date</th>
                            <th>Rolls</th>
                            <th>Shakes</th>
                            <th>Banana</th>
                            <th>Puppy</th>
                            <th>Total ICs</th>
                            <th>ATH</th>
                            <th>CASH</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center'>
                            <td>{timestamp}</td>
                            <td>{rolls}</td>
                            <td>{shakes}</td>
                            <td>{banana}</td>
                            <td>{perro}</td>
                            <td>{rolls + shakes + banana + perro}</td>
                            <td>{<CurrencyFormatter value={ATHsales}/>}</td>
                            <td>{<CurrencyFormatter value={CASHsales}/>}</td>
                            <td>{<CurrencyFormatter value={ATHsales + CASHsales}/>}</td>
                        </tr>
                    </tbody>
                </Table>}
        </div>
        </div>
    )
}

export default Sales