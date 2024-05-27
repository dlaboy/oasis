import { NavLink } from 'react-router-dom'
import { Nav, Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import { useEffect, useState } from 'react';
import CurrencyFormatter from '../tools/CurrencyFormatter';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import BarChart from '../tools/BarChart';
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  

function Sales(){
    const [ATHsales,setATHsales] = useState(0)
    const [CASHsales,setCASHsales] = useState(0)
    const [rolls,setRolls] = useState(0)
    const [shakes,setShakes] = useState(0)
    const [banana,setBanana] = useState(0)
    const [perro,setPerro] = useState(0)
    const [generate,generateReport] = useState(false)
    const [ingredientLabels , setIngredientLabels] = useState([])
    const [ingredientData , setIngredientData] = useState([])
    const [toppingLabels , setToppingLabels] = useState([])
    const [toppingData , setToppingData] = useState([])
    const timestamp = moment().format('YYYY-MM-DD hh:mm:ss'); // Gets current time in ISO format
    const [selectedItem, setSelectedItem] = useState('');
    const [itemsPerType,setItemsPerType] = useState(false)
    const [top5Ings,setTop5Ings] = useState(false)
    const [top5Tops,setTop5Tops] = useState(false)
    const [today,setToday] = useState(true )
    const [allSales,setAllSales] = useState([])
    const [day,setDay] = useState("")
    const [month,setMonth] = useState("")

    const doc = new jsPDF();

    

    useEffect(()=>{
        if (selectedItem == 'Items per type'){
            setItemsPerType(true)
            if (top5Ings == true){
                setTop5Ings(false)
            }
            else if (top5Tops == true){
                setTop5Tops(false)
            }
        }
        else if (selectedItem == 'Top 5 Ingredients'){
            setTop5Ings(true)
            if (itemsPerType == true){
                setItemsPerType(false)
            }
            else if (top5Tops == true){
                setTop5Tops(false)
            }
        }
        else if (selectedItem == 'Top 5 Toppings'){
            setTop5Tops(true)
            if (itemsPerType == true){
                setItemsPerType(false)
            }
            else if (top5Ings == true){
                setTop5Ings(false)
            }
        }
        else{
            setItemsPerType(false)
            setTop5Ings(false)
            setTop5Tops(false)
        }
        
    },[selectedItem])
    useEffect(()=>{
        axios.get('/sales').then(response=>{
            console.log("Response", response.data)
            setAllSales(response.data)
        }).catch(error =>{
            console.log("Error", error)
    
        })

    },[])

    // Function to handle when an option is selected
    const handleSelectChange = (event) => {
        setSelectedItem(event.target.value);
    };
    const handleDay= (event) => {
        setDay(event.target.value);
    };
    const handleMonth = (event) => {
        setMonth(event.target.value);
    };
    // const handleYear = (event) => {
    //     setYear(event.target.value);
    // };

    const handleSubmit = async (event) =>{
        try{
            const response = await axios.post('/sales', {
                'items': rolls + shakes + banana + perro,
                'ath': ATHsales,
                'cash': CASHsales,
                'total': ATHsales + CASHsales
            })
    
            // const response = await axios.get('/orders');
            console.log('Response:', response.data);
        } catch(error){
            console.error('Error', error)
        }
        // Add a title, centered
        const pageTitle = "Daily Report";
        const pageWidth = doc.internal.pageSize.getWidth();
        const textSize = doc.getStringUnitWidth(pageTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textOffset = (pageWidth - textSize) / 2; // Calculate text's x coordinate to center it
        doc.text(pageTitle, textOffset, 10); // Adjust y coordinate as needed

        // Draw a horizontal line under the title
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, 15, pageWidth - 20, 15); // Adjust line position as needed

        const tableColumn = ["Date","Items", "Ath", "Cash","Total"];
        console.log("Timestamp", timestamp)
        const tableRows = [[timestamp,rolls + shakes + banana + perro,formatCurrency(ATHsales),formatCurrency(CASHsales),formatCurrency(ATHsales + CASHsales)]]
        
          // Add a table to the PDF
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid'
        });

        doc.save(`${timestamp}.pdf`);

        try {
          
            const response = axios.delete("/orders",)
            
            console.log(response.data)
            location.reload()
            setRenderOrdersKey(prevKey => prevKey + 1)
      
            console.log("Report generated")
          } catch (error) {
            console.log("error:", error)
          }
          
      
    }

    
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
        axios.get('/orders/countIngredients').then(response=>{
            // console.log("Ingredients: ", response.data.length)
            var labels=[]
            var data=[]
            response.data.forEach(object =>{
                labels.push(object._id)
                data.push(object.totalQuantity)
            })
            console.log("Labels: ",labels)
            console.log("Data: ", data)
            setIngredientLabels(labels)
            setIngredientData(data)
            
        }).catch(error =>{
            console.log("Error", error)
        })
        axios.get('/orders/countToppings').then(response=>{
            // console.log("Ingredients: ", response.data.length)
            var labels=[]
            var data=[]
            response.data.forEach(object =>{
                labels.push(object._id)
                data.push(object.totalQuantity)
            })
            console.log("Labels: ",labels)
            console.log("Data: ", data)
            setToppingLabels(labels)
            setToppingData(data)
            
        }).catch(error =>{
            console.log("Error", error)
        })
        generateReport(true)
        

    };
    
    const handleToday = event =>{
        if (today == true){
            setToday(false)
        }else{
            setToday(true)
        }
    }

    const handleSearch = event =>{
        axios.get('/sales',{
            params: {
            //   year: year,
              month: month,
              day: day
            }
          }).then(response=>{
            console.log("Response", response.data)
            setAllSales(response.data)
        }).catch(error =>{
            console.log("Error", error)
    
        })
    }
    const handleDelete = async (salesId) => {
        try{
          console.log(salesId)
          const response = await axios.delete('/sales',{data:{ id: salesId }})
          console.log('Item deleted:', response.data);

          axios.get('/sales').then(response=>{
            console.log("Response", response.data)
            setAllSales(response.data)
            }).catch(error =>{
                console.log("Error", error)
        
            })

        }
        catch(error){
          console.log('error:', error)
        }
        setDeleteShow(false)

      }
    const handleSearchReport = event =>{
        console.log("Sales to be reported", allSales)
        

         // Add a title, centered
         const pageTitle = "Searched Report";
         const pageWidth = doc.internal.pageSize.getWidth();
         const textSize = doc.getStringUnitWidth(pageTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
         const textOffset = (pageWidth - textSize) / 2; // Calculate text's x coordinate to center it
         doc.text(pageTitle, textOffset, 10); // Adjust y coordinate as needed
 
         // Draw a horizontal line under the title
         doc.setDrawColor(0);
         doc.setLineWidth(0.5);
         doc.line(20, 15, pageWidth - 20, 15); // Adjust line position as needed
 
         const tableColumn = ["Date","Items", "Ath", "Cash","Total"];
         console.log("Timestamp", timestamp)

         const tableRows = []


             // Format data and add to table rows
        allSales.forEach(item => {
            const rowData = [
            item.Date,
            item.Items,
            formatCurrency(item.ATH),
            formatCurrency(item.CASH),
            formatCurrency(item.Total),
            ];
            tableRows.push(rowData);
        });
            // Add a table to the PDF
         autoTable(doc, {
             head: [tableColumn],
             body: tableRows,
             startY: 20,
             theme: 'grid'
         });
 
         doc.save(`${timestamp}.pdf`);
 
         console.log("Report generated")
    }
    const [idToDelete,setIDtoDelete] = useState(0);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = (saleId) => {
      setDeleteShow(true);
      setIDtoDelete(saleId)
    }
  

    return (
        <div>
        <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>Warning, you're about to delete a sale!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <button className='btn btn-primary' onClick={()=>handleDelete(idToDelete)}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
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
        <div className='bg-light d-flex justify-content-start align-items-center flex-column' style={{height:'90vh'}}>
            <div className="d-flex flex-row">
                <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleToday}>{today ?'Today Sales':'All Sales'}</button>
            </div>
            { today ? <div className="text-center">
                <div className="d-flex justify-content-around align-items-center flex-row">
                    <button className='btn btn-outline-primary rounded-pill p-3 m-2' onClick={handleReport}> Generate Today's Report</button>
                    {generate && 
                        <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleSubmit}> Submit Today's Report</button>
                    }
                </div>
            
                {generate &&  <div className="d-flex text-center flex-column align-items-center">
                <Table className='' striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>Date</th>
                            {/* <th>Rolls</th>
                            <th>Shakes</th>
                            <th>Banana</th>
                            <th>Puppy</th> */}
                            <th>Items</th>
                            <th>ATH</th>
                            <th>CASH</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center'>
                           <td>{timestamp}</td>
                             {/* <td>{rolls}</td>
                            <td>{shakes}</td>
                            <td>{banana}</td>
                            <td>{perro}</td> */}
                            <td>{rolls + shakes + banana + perro}</td>
                            <td>{<CurrencyFormatter value={ATHsales}/>}</td>
                            <td>{<CurrencyFormatter value={CASHsales}/>}</td>
                            <td>{<CurrencyFormatter value={ATHsales + CASHsales}/>}</td>
                        </tr>
                    </tbody>
                </Table>
                <div className='container w-100 text-center d-flex flex-row justify-content-around'>
                    <h6>Statistic Chart</h6>
                    <select value={selectedItem} onChange={handleSelectChange} className='p-2'>
                        <option value="">Choose Chart</option>
                        <option value="Items per type">Items per type</option>
                        <option value="Top 5 Ingredients">Top 5 Ingredients</option>
                        <option value="Top 5 Toppings">Top 5 Toppings</option>
                    </select>
                </div>
                <div className='container d-flex '>
                    { itemsPerType && <BarChart  className='m-2' keys={['Rolls','Shakes','Banana','Puppy']} values={[rolls,shakes,banana,perro]}/>}
                    { top5Ings &&<BarChart  className='m-2' keys={ingredientLabels} values={ingredientData} />}
                    { top5Tops &&<BarChart  className='m-2' keys={toppingLabels} values={toppingData} />}
                </div>
                </div>  }
            </div> :
            <div className='container w-100 text-center d-flex flex-column justify-content-center align-items-center'>
                <button className="p-2 btn" onClick={handleSearch}>Search</button>
                <div className='m-3 container w-100 text-center d-flex flex-row justify-content-around'>
                    <select value={day} onChange={handleDay} className='p-2'>
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i} value={`0${i + 1}`}>
                                {i + 1}
                                </option>
                            ))}
                                                    
                    </select>
                    <select value={month} onChange={handleMonth} className='p-2'>
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                    </select>
                    <select className='p-2'>
                            <option value="2024">2024</option>
                    </select>
                </div>
                
                <Table className='' striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>Date</th>
                            <th>Items</th>
                            <th>ATH</th>
                            <th>CASH</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSales.map(sale =>(
                            <>
                            <tr className='text-center'>
                                <td>{sale.Date}</td>
                                <td>{sale.Items}</td>
                                <td>{<CurrencyFormatter value={sale.ATH}/>}</td>
                                <td>{<CurrencyFormatter value={sale.CASH}/>}</td>
                                <td>{<CurrencyFormatter value={sale.Total}/>}</td>
                                <td><button className='btn text-secondary' onClick={() => handleDeleteShow(sale._id)}>Delete</button></td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </Table>
                <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleSearchReport}>Generate Report of Search</button>
            </div>}
        </div>
        </div>
    )
}

export default Sales