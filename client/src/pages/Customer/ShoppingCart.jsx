import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './shopping-cart.css';
import { Nav, Modal, Button } from 'react-bootstrap'
import axios from 'axios';



export default function ShoppingCart() {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const price = 5.00;

  useEffect(() => {
    const storedItems = localStorage.getItem('selfItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        const enrichedItems = parsedItems.map(item => ({
          ...item,
          price: price.toFixed(2),
          qty: 1,
          idname: item.ingredients.join(' + ')
        }));
        setItemsInCart(enrichedItems);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }

    // fetch('http://localhost:5000/names')
    //   .then(res => res.json())
    //   .then(data => setNameList(data));
  }, []);

  const deleteItem = indexToRemove => {
    const updatedItems = itemsInCart.filter((_, index) => index !== indexToRemove);
    setItemsInCart(updatedItems);
    localStorage.setItem('selfItems', JSON.stringify(updatedItems));
  };

  const total = itemsInCart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const toggleProceed = () => {
    setShowPayment(!showPayment);
  };

  const completePayment = () => {
    setShowConfirmation(true);
    // Puedes limpiar el carrito después del pago si deseas:
    // setItemsInCart([]);
    // localStorage.removeItem('selfItems');

  };
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  useEffect(() => {
  const handleStorage = (event) => {
    if (event.key === 'paymentConfirmed' && event.newValue === 'true') {
      setIsPaymentConfirmed(true);
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}, []);

const [currentOrderId, setCurrentOrderId] = useState(null);

const handlePay = async () => {
  setShowPendingModal(true);
  try {
    const response = await axios.post('/orders/pending_order', {
      name: JSON.parse(localStorage.getItem('selfName')),
      items: itemsInCart,
      payment_method: paymentMethod,
      total: total
    });

    // Guarda el ID de la orden creada
    const orderId = response.data._id;
    setCurrentOrderId(orderId);
    localStorage.setItem('currentOrderId', orderId);
    console.log('Orden enviada con ID:', orderId);
  } catch (error) {
    console.error('Error', error);
  }
};
useEffect(() => {
  let interval;

  if (showPendingModal && currentOrderId) {
    interval = setInterval(async () => {
      try {
        const res = await axios.get(`/orders/pending_orders/${currentOrderId}`);
        if (res.data.paymentConfirmed) {
          setIsPaymentConfirmed(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error polling order status:', err);
      }
    }, 3000); // cada 3 segundos
  }

  return () => clearInterval(interval);
}, [showPendingModal, currentOrderId]);



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
                    <th><h3>Remove</h3></th> {/* Nueva columna */}
                  </tr>
                </thead>
                <tbody>
                  {itemsInCart.map((item, i) => (
                    <tr key={i}>
                      <td>{item.combination}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteItem(i)}
                        >
                          ✕
                        </button>
                      </td>
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
                  <input type="hidden" name="is" value={i.combination} />
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

                <div className="d-flex gap-3 mb-3">
                  <button
                    type="button"
                    className={`btn ${paymentMethod === 'ATH' ? 'btn-dark w-100 p-3' : 'btn-outline-dark  w-100 p-3'}`}
                    onClick={() => setPaymentMethod('ATH')}
                  >
                    ATH Móvil
                  </button>

                  <button
                    type="button"
                    className={`btn ${paymentMethod === 'CASH' ? 'btn-dark w-100 p-3' : 'btn-outline-dark w-100 p-3'}`}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    Efectivo
                  </button>
                </div>

                <p>Método seleccionado: <strong>{paymentMethod}</strong></p>

                {/* <div id="ATHMovil_Checkout_Button" onClick={completePayment}></div> */}
              <button
                id="ATHMovil_Checkout_Button"
                className="btn btn-dark w-100 p-3"
                onClick={handlePay}
                disabled={!paymentMethod}
              >
                Pay
              </button>

              </div>
            )}
            <Modal show={showPendingModal} onHide={() => setShowPendingModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{isPaymentConfirmed ? 'Payment Confirmed' : 'Order Pending'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {isPaymentConfirmed ? (
                <i className="bi bi-check-circle-fill text-success display-1 d-block mb-3"></i>
              ) : (
                <i className="bi bi-clock-history display-1 d-block mb-3"></i>
              )}
              <p className="fs-5">
                {isPaymentConfirmed
                  ? 'Payment confirmed by cashier!'
                  : 'Waiting for cashier to confirm payment...'}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={() => setShowPendingModal(false)}>
                Close
              </button>
            </Modal.Footer>
          </Modal>



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
