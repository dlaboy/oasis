import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

function Sales(){
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
        <div className='bg-light d-flex justify-content-center align-items-center' style={{height:"90vh"}}>
                <button className='btn btn-outline-primary rounded-pill p-3'> Generate Today's Report</button>


        </div>
        </div>
    )
}

export default Sales