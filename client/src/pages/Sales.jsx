import { NavLink } from 'react-router-dom'
import { Nav, Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import CurrencyFormatter from '../tools/CurrencyFormatter';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import BarChart from '../tools/BarChart';
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';
import { ItemContext } from '../../context/ItemContext';
import FileUpload from '../components/FileUploadTest';


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
    const [drinks,setDrinks] = useState(0)
    const [generate,generateReport] = useState(false)
    const [ingredientLabels , setIngredientLabels] = useState([])
    const [ingredientData , setIngredientData] = useState([])
    const [toppingLabels , setToppingLabels] = useState([])
    const [toppingData , setToppingData] = useState([])
    const timestamp = moment().format('YYYY-MM-DD hh:mm:ss'); // Gets current time in ISO format
    const {renderOrdersKey, setRenderOrdersKey} = useContext( ItemContext )

    const [selectedItem, setSelectedItem] = useState('');
    const [itemsPerType,setItemsPerType] = useState(false)
    const [top5Ings,setTop5Ings] = useState(false)
    const [top5Tops,setTop5Tops] = useState(false)
    const [today,setToday] = useState(true )
    const [allSales,setAllSales] = useState([])
    const [day,setDay] = useState("")
    const [month,setMonth] = useState("")
    const [year,setYear] = useState("")
    const [chartYear,setChartYear] = useState("2025")
    const [isSubmitted, setSubmission] = useState(false);
    const [saleCharts, setSaleCharts] = useState([])
    const [stat,setStat] = useState("0")

    const doc = new jsPDF();

    

    useEffect(()=>{
        if (selectedItem == 'Ice Creams per type'){
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
    console.log("Sale Charts",saleCharts)
    console.log("Sale Charts Values",Object.values(saleCharts))
    console.log("Sale Chart Array",saleCharts)
    // if (saleCharts.length > 0){
    //     saleCharts.forEach((s)=>{
    //         console.log("Keys",Object.keys(s))
    //         // <BarChart  className='m-2' keys={['Ice Creams','Drinks','ATH','Cash','Total']} values={[s.IceCreams,s.Drinks,s.ATH,s.Cash,s.Total]} />
    //     })
    // }





  },[saleCharts])
  useEffect(()=>{
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
    let year = ['2025','2024']
    setSaleCharts([])

    if (stat === "0"){
        year.forEach((y)=>{
            months.forEach((m)=>{
                axios.get('/sales/sum',{
                    params: {
                        month: m,
                        year: y
                      
                    }
                  }).then(response=>{
                    console.log("Response", response.data)
        
        
                    let sum = response.data.totals
                    
                    console.log("SUMMMMMMMMMMMM",sum)
                    setSaleCharts(prevArray => [...prevArray, sum])
                    // setSaleCharts(saleCharts.push(sum))
    
    
        
           
                    // setAllSales(response.data)
                }).catch(error =>{
                    console.log("Error", error)
                })
                
              })
        })
    }
    else if (stat === "1") {
        console.log("Average")
        year.forEach((y)=>{
            months.forEach((m)=>{
                axios.get('/sales/avg_week_sales',{
                    params: {
                        month: m,
                        year: y
                      
                    }
                  }).then(response=>{
                    console.log("Response", response.data)
        
        
                    let sum = response.data.totals
                    
                    console.log("SUMMMMMMMMMMMM",sum)
                    setSaleCharts(prevArray => [...prevArray, sum])
                    // setSaleCharts(saleCharts.push(sum))
    
    
        
           
                    // setAllSales(response.data)
                }).catch(error =>{
                    console.log("Error", error)
                })
                
              })
        })

    }
   
  },[stat])

    useEffect(()=>{
        // let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        // let year = ['2025','2024']
        // year.forEach((y)=>{
        //     months.forEach((m)=>{
        //         axios.get('/sales/sum',{
        //             params: {
        //                 month: m,
        //                 year: y
                      
        //             }
        //           }).then(response=>{
        //             console.log("Response", response.data)
        
        
        //             let sum = response.data.totals
                    
        //             console.log("SUMMMMMMMMMMMM",sum)
        //             setSaleCharts(prevArray => [...prevArray, sum])
        //             // setSaleCharts(saleCharts.push(sum))
    
    
        
           
        //             // setAllSales(response.data)
        //         }).catch(error =>{
        //             console.log("Error", error)
        //         })
                
        //       })
        // })
       



        axios.get('/sales').then(response=>{
            console.log("Response", response.data)
            setAllSales(response.data)
        }).catch(error =>{
            console.log("Error", error)
    
        })
        const intervalSales = setInterval(() => {
            axios.get('/sales').then(response=>{
                console.log("Response", response.data)
                setAllSales(response.data)
            }).catch(error =>{
                console.log("Error", error)
        
            })
        }, 15000);

        const intervalId = setInterval(() => {
            
            
            // Place your logic here that you want to execute every 5 seconds
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
                    else if (object._id == 'drinks'){
                        setDrinks(object.totalQuantity)
                        
    
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
          }, 500);

          
         
      
          // Cleanup function to clear the interval when the component unmounts
          return () => {
            clearInterval(intervalId);
            clearInterval(intervalSales);


              
        }

        

          



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
    const handleYear = (event) => {
        setYear(event.target.value);
    };
    const handleChartYear = (event) => {
        setChartYear(event.target.value);
    };
    const handleStat = (event) => {
        setStat(event.target.value);
    };


    const [isUploaded,setUploaded] = useState(false)
    const [isUploading,setUploading] = useState(false)
    const [submitMessage,setSubmitMessage] = useState("")
    
    const handleSubmit = async (event) =>{
        setSubmission(true)
      
        // Add a title, centered
        const pageTitle = "Daily Report";
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const chartHeight = 100; // Set the height for each chart

        const textSize = doc.getStringUnitWidth(pageTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textOffset = (pageWidth - textSize) / 2; // Calculate text's x coordinate to center it
        doc.text(pageTitle, textOffset, 10); // Adjust y coordinate as needed

        const addPageIfNeeded = (currentY,requiredHeight) => {
            if (currentY + requiredHeight > pageHeight - 20) { // 20 is a buffer to avoid adding content too close to the bottom
                doc.addPage();
                return 20; // Reset Y position for the new page
              }
              return currentY;
          };

        // Draw a horizontal line under the title
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, 15, pageWidth - 20, 15); // Adjust line position as needed

        // Add a title, centered
        const orderTitle = "Orders";    
        doc.text(orderTitle, 20, 25); // Adjust y coordinate as needed

        let orders = [];
        setSubmitMessage("Getting Orders...")

        try {
            const ordersResponse = await axios.get('/orders');
            orders = ordersResponse.data;

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    

        const orderColumns = ["Order ID","Client Name","Payment Method","Total"]

        const orderRows = orders.map(order => [
            order._id,
            order.client_name,
            order.payment_method,
            formatCurrency(order.total)

        ])
        console.error("Order Rows: ",orderRows);


        autoTable(doc, {
            head: [orderColumns],
            body: orderRows,
            startY: 30,
            theme: 'grid'
        });

        // Calculate the position for the second table to start
        let finalY = doc.lastAutoTable.finalY || 40; // Use doc.lastAutoTable.finalY to get the end position of the last table

        const totalTitle = "Total Sale";    
        doc.text(totalTitle, 20, finalY + 20); // Adjust y coordinate as needed

        const tableColumn = ["Date","Ice Creams","Drinks", "Ath", "Cash","Total"];
        console.log("Timestamp", timestamp)
        const tableRows = [[timestamp,rolls + shakes + banana + perro,drinks,formatCurrency(ATHsales),formatCurrency(CASHsales),formatCurrency(ATHsales + CASHsales)]]
        
        // Add a table to the PDF
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: finalY + 25,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 165, 0] // Red color, you can change to any color
            }
        });
        setSubmitMessage("Counting Orders...")


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
                else if (object._id == 'drinks'){
                    setDrinks(object.totalQuantity)
                    

                }
                else{
                    console.log("Types not found")

                }
            })


            }).catch(error =>{
            console.log("Error", error)
        })
        setSubmitMessage("Counting Ingredients on All Orders...")

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
        setSubmitMessage("Counting Toppings on All Orders...")

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

        let finalY2 = doc.lastAutoTable.finalY|| 40;

        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          };

        const generateChartUrl = (data,label,title) => {
            const backgroundColor = getRandomColor();
            const borderColor = getRandomColor();
            const chartConfig = {
              type: 'bar',
              data: {
                labels: label.map(lab=>lab),
                datasets: [{
                  label: label,
                  data: data,
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,      
                  borderWidth: 1
                }]
              },
              options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],

                },
                legend: {
                    display: false, // Remove legend
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                      size: 16
                    }
                  },
                  plugins: {
                    datalabels: {
                      anchor: 'center',
                      align: 'center    ',
                      color: 'black',
                      font: {
                        weight: 'bold'
                      },
                      formatter: (value) => value // Display data values on top of the bars
                    }
                  }
              }
            };
            return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
          };
      
        const chartUrls = [
        generateChartUrl(ingredientData.map(ing=>ing), ingredientLabels,"Top 5 Ingredients"),
        generateChartUrl(toppingData.map(top=>top), toppingLabels,"Top 5 Toppings"),
        generateChartUrl([rolls,shakes,banana,perro], ['Rolls','Shakes','Banana','Puppy'],"Ice Creams by type")
        ];

        let currentY = doc.previousAutoTable.finalY + 20;

       const addChartToPDF = (url, yOffset) => {
        return new Promise((resolve) => {
          const chartImage = new Image();
          chartImage.src = url;
          chartImage.onload = () => {
            yOffset = addPageIfNeeded(yOffset, chartHeight);
            doc.addImage(chartImage, 'PNG', 10, yOffset, pageWidth - 20, chartHeight);
            resolve(yOffset + chartHeight + 10); // Adjust height for next chart
          };
        });
      };
      const addChartsSequentially = async () => {
        for (const url of chartUrls) {
          currentY = await addChartToPDF(url, currentY);
        }
        // doc.save(`${timestamp}.pdf`);

        let formData = new FormData();
        const pdfBlob = doc.output('blob');
    
        formData.append("file", pdfBlob , `${timestamp}.pdf`);
    
        try {
            setSubmitMessage("Uploading...")
            const response = await axios.post("/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data", // Inform the server of the data format
              },
            });
        
            if (response.status === 200 && response?.data) {
                console.log("Respuesta", response.data)
                const keys = Object.keys(response.data.response);
                console.log("Keys", keys)

                const link = response.data.response.shareableLink

                setSubmitMessage("Posting Sale...")
                try{
                    const response = await axios.post('/sales', {
                        'ice_creams': rolls + shakes + banana + perro,
                        'drinks': drinks,
                        'ath': ATHsales,
                        'cash': CASHsales,
                        'total': ATHsales + CASHsales,
                        'report':link
                    })
            
                    // const response = await axios.get('/orders');
                    console.log('Response:', response.data.sale_id);


                    setUploaded(true)
                    await axios.post("/orders/copy_orders",{sale_id:response.data.sale_id}).then(response=>{
                        console.log(response.data)
                        setRenderOrdersKey(prevKey => prevKey + 1)
                        location.reload()
            
                        
                        
                        
                    }).catch(error =>{
                        console.log("Error", error)
                    })


                    await axios.delete("/orders",).then(response=>{
                        console.log(response.data)
                        setRenderOrdersKey(prevKey => prevKey + 1)
                        location.reload()
                        
                        
                    }).catch(error =>{
                        console.log("Error", error)
                    })
                    window.location.reload()


                } catch(error){
                    console.error('Error', error)
                }



                
            }
        } catch (error) {
            setSubmitMessage("Error Uploading...")
    
            console.error("Error uploading file:", error);
        }

        
        console.log("Report generated")
        
        
        setSubmitShow(false)

    


    
        
    }
    setSubmitMessage("Generating Charts...")
    addChartsSequentially();

    console.log("No longer deleting")

  
        
 


      
  

   
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
                else if (object._id == 'drinks'){
                    setDrinks(object.totalQuantity)
                    

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
              month: month,
              day: day,
              year: year
            }
          }).then(response=>{
            console.log("Response", response.data)
            setAllSales(response.data)
        }).catch(error =>{
            console.log("Error", error)
    
        })

        
        // Cleanup function to clear the interval when the component unmounts
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


        axios.get('/sales/sum',{
            params: {
                month: month,
                day: day,
                year: year
            }
          }).then(response=>{
            console.log("Response", response.data)


            let sum = response.data.totals
            console.log("SUMMMMMMMMMMMM",sum)

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

         
         const tableTotalColumn = ["Ice Creams","Drinks", "Ath", "Cash","Total"];
         
         let ics = sum.IceCreams
         let d = sum.Drinks
         let ath = sum.ATH
         let cash = sum.Cash
         let tot = sum.Total
         
         const tableTotalRows = [[ics,d,formatCurrency(ath),formatCurrency(cash),formatCurrency(tot)]]
         
         
         autoTable(doc, {
             head: [tableTotalColumn],
             body: tableTotalRows,
             startY: 20,
             theme: 'grid'
            });
            
        let finalY = doc.lastAutoTable.finalY || 40;
        const totalTitle = "Sales By Day";    
        doc.text(totalTitle, 20, finalY + 20); // Adjust y coordinate as needed
        
            
         const tableColumn = ["Date","Ice Creams","Drinks", "Ath", "Cash","Total"];
         console.log("Timestamp", timestamp)

         const tableRows = []


             // Format data and add to table rows
        allSales.forEach(item => {
            const rowData = [
            item.Date,
            item.IceCreams,
            item.Drinks,
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
             startY: finalY +25,
             theme: 'grid'
         });

         

     
 
         doc.save(`${timestamp}.pdf`);
 
         console.log("Report generated")

            // setAllSales(response.data)
        }).catch(error =>{
            console.log("Error", error)
        })
        
        



        
    }
    const [idToDelete,setIDtoDelete] = useState(0);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = (saleId) => {
      setDeleteShow(true);
      setIDtoDelete(saleId)
    }
    const [submitShow, setSubmitShow] = useState(false);
    const handleSubmitClose = () => setSubmitShow(false);
    const handleSubmitShow = () => setSubmitShow(true);


    const handleDownload = (reportUrl) => {
        window.open(reportUrl, '_blank');
    };

    const [charts,setCharts] = useState(false);

    const toggleCharts = () => {
        setCharts((prevState) => !prevState);
    };

  

    return (
        <div>
        
        <Modal show={submitShow} onHide={handleSubmitClose}>
        {isSubmitted?<Modal.Body>Submiting Report:{submitMessage}</Modal.Body> :<>
            <Modal.Header closeButton>
          <Modal.Title>Submmiting Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>Warning, you're about to submit a sale!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmitClose}>
            Cancel
          </Button>
          <button className='btn btn-primary' onClick={handleSubmit}>
            Submit
          </button>
        </Modal.Footer>
        </>}
        </Modal>
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
        <div className='d-flex justify-content-start align-items-center flex-column' >
            <div className="d-flex flex-row">
                <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleToday}>{today ?'Today Sales':'All Sales'}</button>
            </div>
          
            { today ? <div className="text-center">
                <div className="d-flex justify-content-around align-items-center flex-row">
                    {/* <button className='btn btn-outline-primary rounded-pill p-3 m-2' onClick={handleReport}> Generate Today's Report</button> */}
                    {generate && 
                        <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleSubmitShow}> Submit Today's Report</button>
                    }
                </div>
            
                {generate &&  <div className="d-flex text-center flex-column align-items-center justify-content-center">
                <Table className=' ' striped bordered hover size='sm' responsive='md'>
                    <thead>
                        <tr className='text-center'>
                            <th>Date</th>
                            {/* <th>Rolls</th>
                            <th>Shakes</th>
                            <th>Banana</th>
                            <th>Puppy</th> */}
                            <th>ICs</th>
                            <th>Drinks</th>
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
                            <td>{drinks}</td>
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
                        <option value="Ice Creams per type">Ice Creams per type</option>
                        <option value="Top 5 Ingredients">Top 5 Ingredients</option>
                        <option value="Top 5 Toppings">Top 5 Toppings</option>
                    </select>
                </div>
                <div className='container d-flex '>
                    { itemsPerType && <BarChart  className='m-2' keys={['Rolls','Shakes','Banana','Puppy']} values={[rolls,shakes,banana,perro]}/>}
                    { top5Ings &&<BarChart  className='m-2' keys={ingredientLabels} values={ingredientData} />}
                    { top5Tops &&<BarChart  className='m-2' keys={toppingLabels} values={toppingData} />}
                </div>
                {/* <FileUpload></FileUpload> */}
                {isUploaded && <>{alert("File Uploaded!")}</>}

                </div>  }
            </div> :
            <div className='container w-100 text-center d-flex flex-column justify-content-center align-items-center'>
                  <div className="">
                        <button className='btn btn-outline-primary rounded-pill p-3 m-2' onClick={toggleCharts}>{charts ?'Charts':'Reports'}</button>

                    </div>
                    {charts ? <>
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
                    <select value={year}className='p-2' onChange={handleYear}>
                            {/* <option value="">Year</option> */}
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                    </select>
                    <button className="p-2 btn" onClick={handleSearch}>Search</button>
                    
                </div>
                
            <Table className='' striped bordered hover  >
            <thead>
                <tr className='text-center'>
                    <th>Date</th>
                    {/* <th>ICs</th> */}
                    {/* <th>Drinks</th> */}
                    {/* <th>ATH</th> */}
                    {/* <th>CASH</th> */}
                    <th>Total</th>
                    <th>Report</th> {/* Added a new column for Report */}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {allSales.map((sale) => (
                    <tr className='text-center' key={sale._id}>
                        <td>{sale.Date}</td>
                        {/* <td>{sale.IceCreams}</td> */}
                        {/* <td>{sale.Drinks}</td> */}
                        {/* <td>{<CurrencyFormatter value={sale.ATH} />}</td> */}
                        {/* <td>{<CurrencyFormatter value={sale.CASH} />}</td> */}
                        <td>{<CurrencyFormatter value={sale.Total} />}</td>
                        <td>
                            {sale.Report ? (
                                <button
                                    className='btn text-secondary'
                                    onClick={() => handleDownload(sale.Report)}
                                >
                                    Open
                                </button>
                            ) : (
                                'No Report'
                            )}
                        </td>
                        <td>
                            <button className='btn text-secondary' onClick={() => handleDeleteShow(sale._id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </Table>
            <button className='btn btn-outline-dark rounded-pill p-3 m-2' onClick={handleSearchReport}>Generate Report of Search</button>

                    </>:<div className=" d-flex flex-column justify-content-around align-items-center w-100 ">
                    <div className="">
                    <select value={stat}lassName='p-2 m-4' onChange={handleStat}>

                            <option value="0">Total Sales</option>
                            <option value="1">Average Sale by day of the week</option>
                            {/* <option value="2">2024</option> */}
                    </select> 
                    <select value={chartYear}className='p-2 m-4' onChange={handleChartYear}>
                            {/* <option value="">Year</option> */}
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                    </select>
                    {/* <div className="">Currently Displaying Stat {stat}</div>     */}
                    </div>
  {
    saleCharts.length > 0 && stat == "0" ? (
      <div className=' d-flex flex-wrap w-100 justify-content-around '>
        {
          Object.keys(saleCharts)
            .sort((keyA, keyB) => parseInt(saleCharts[keyA].Month) - parseInt(saleCharts[keyB].Month))
            .map((key) => (
            
            chartYear === saleCharts[key].Year ? (<div key={key}>
              {/* Replace this with your chart component */}
              {/* {if (key == '0'){
                <p>January Sales</p>
              } } */}
              {saleCharts[key].Month == "01" ? (<p>January {saleCharts[key].Year} Sales</p>):saleCharts[key].Month == "02" ?(<>February {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "03" ?(<>March {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "04" ?(<>April {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "05" ?(<>May {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "06" ?(<>June {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "07" ?(<>July {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "08" ?(<>August {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "09" ?(<>September {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "10" ?(<>October {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "11" ?(<>November {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "12" ?(<>December {saleCharts[key].Year} Sales</>):(<>Other Month</>)}
              
              {/* Example of using BarChart */}
              {/* Uncomment and configure if applicable */}
              {
              <BarChart
                className="m-5"
                keys={['Ice Creams', 'Drinks', 'ATH', 'Cash', 'Total']}
                values={[
                  saleCharts[key].IceCreams,
                  saleCharts[key].Drinks,
                  saleCharts[key].ATH,
                  saleCharts[key].Cash,
                  saleCharts[key].Total
                ]}
              />
              }
            </div>): (<></>)
          ))
        }
      </div>
    ) : saleCharts.length > 0 && stat == "1" ? (
        <div className=' d-flex flex-wrap w-100 justify-content-around '>
        {
          Object.keys(saleCharts)
            .sort((keyA, keyB) => parseInt(saleCharts[keyA].Month) - parseInt(saleCharts[keyB].Month))
            .map((key) => (
            
            chartYear === saleCharts[key].Year ? (<div key={key}>
              {/* Replace this with your chart component */}
              {/* {if (key == '0'){
                <p>January Sales</p>
              } } */}
              {saleCharts[key].Month == "01" ? (<p>January {saleCharts[key].Year} Sales</p>):saleCharts[key].Month == "02" ?(<>February {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "03" ?(<>March {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "04" ?(<>April {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "05" ?(<>May {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "06" ?(<>June {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "07" ?(<>July {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "08" ?(<>August {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "09" ?(<>September {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "10" ?(<>October {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "11" ?(<>November {saleCharts[key].Year} Sales</>):saleCharts[key].Month == "12" ?(<>December {saleCharts[key].Year} Sales</>):(<>Other Month</>)}
              
              {/* Example of using BarChart */}
              {/* Uncomment and configure if applicable */}
              {
              saleCharts[key].DayTotals ? (<BarChart
                className="m-5"
                keys={["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]}
                values={[
                  saleCharts[key].DayTotals["Sundays"],
                  saleCharts[key].DayTotals["Mondays"],
                  saleCharts[key].DayTotals["Tuesdays"],
                  saleCharts[key].DayTotals["Wednesdays"],
                  saleCharts[key].DayTotals["Thursdays"],
                  saleCharts[key].DayTotals["Fridays"],
                  saleCharts[key].DayTotals["Saturdays"],
                  
                ]}
              />):(<BarChart
                className="m-5"
                keys={["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]}
                values={[
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  
                ]}
              />)
              }
            </div>): (<></>)
          ))
        }
      </div>
    ) : (<>No Sales</>)
    
  }
</div>}

            </div>}
        </div>
        </div>
    )
}

export default Sales