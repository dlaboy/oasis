import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './shopping-cart.css';

export default function ShoppingCart() {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Replace with your actual backend endpoints
    fetch('http://localhost:5000/cart')
      .then(res => res.json())
      .then(data => setItemsInCart(data));

    fetch('http://localhost:5000/names')
      .then(res => res.json())
      .then(data => setNameList(data));
  }, []);

  const total = itemsInCart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const toggleProceed = () => {
    setShowPayment(!showPayment);
  };

  const completePayment = () => {
    setShowConfirmation(true);
  };

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between">
        <a href="#" onClick={() => window.history.back()} className='ms-3'>
            <i className="bi bi-chevron-left"></i>
        </a>
        <img className="logo" src="/logo.png" alt="Logo" />
        <img className="ima m-4" src="" alt="" />
      </nav>

      <div className="container d-flex justify-content-center">
        {!showConfirmation ? (
          <div id="sc" className="tab row d-flex flex-column rounded-4 p-3">
            <div className="col d-flex justify-content-center gy-3">
              <table className="table table-hover w-100 text-center">
                <thead>
                  <tr>
                    <th><h3>Item</h3></th>
                    <th><h3>Qty</h3></th>
                    <th><h3>Price</h3></th>
                  </tr>
                </thead>
                <tbody>
                  {itemsInCart.map((item, i) => (
                    <tr key={i}>
                      <td>{item.idname}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col d-flex justify-content-end gy-5">
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>

            <div className={`col gy-5 p-3 ${showPayment ? 'border-bottom border-3' : ''}`} id="proc">
              {nameList.map((n, i) => (
                <input key={i} type="hidden" id="n" name="nombreoNo" value={n.nom} />
              ))}

              {itemsInCart.map((i, idx) => (
                <div key={idx}>
                  <input type="hidden" name="is" value={i.ingredients} />
                  <input type="hidden" name="ts" value={i.toppings} />
                  <input type="hidden" name="q" value={i.qty} />
                </div>
              ))}

              <button className="btn btn-dark w-100 p-3" onClick={toggleProceed}>
                Proceed to Checkout
              </button>
            </div>

            {showPayment && (
              <div className="col gy-3" id="pay">
                <p>Choose payment method</p>
                <div id="ATHMovil_Checkout_Button" onClick={completePayment}></div>
              </div>
            )}
          </div>
        ) : (
          <div id="order-payed" className="tab d-flex align-items-center justify-content-center row rounded-4 p-3 text-center">
            <img className="payed" src="./img/check.png" alt="Check" />
            <h2>Pago Completado</h2>
          </div>
        )}
      </div>
    </div>
  );
}