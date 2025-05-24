import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

export default function ShoppingCart() {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const price = 5.0;

  useEffect(() => {
    const storedItems = localStorage.getItem('selfItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        const enrichedItems = parsedItems.map(item => ({
          ...item,
          price: price.toFixed(2),
          qty: 1,
          idname: item.ingredients.join(' + '),
        }));
        setItemsInCart(enrichedItems);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'paymentConfirmed' && event.newValue === 'true') {
        setIsPaymentConfirmed(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let interval;
    if (showPendingModal && currentOrderId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/orders/pending_orders/${currentOrderId}`);
          if (res.data.paymentConfirmed) {
            setIsPaymentConfirmed(true);
            clearInterval(interval);

            const transformedItems = itemsInCart.map(item => ({
              ...item,
              ings: item.ingredients,
              tops: item.toppings,
              item_id: Math.floor(Math.random() * 100000),
            })).map(({ ingredients, toppings, price, ...rest }) => rest);

            await axios.post('/orders', {
              name: JSON.parse(localStorage.getItem('selfName')),
              items: transformedItems,
              payment_method: paymentMethod,
              total: total
            });

            localStorage.removeItem('selfItems');
            localStorage.removeItem('selfName');
          }
        } catch (err) {
          console.error('Error polling order status:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showPendingModal, currentOrderId]);

  const deleteItem = indexToRemove => {
    const updatedItems = itemsInCart.filter((_, index) => index !== indexToRemove);
    setItemsInCart(updatedItems);
    localStorage.setItem('selfItems', JSON.stringify(updatedItems));
  };

  const handlePay = async () => {
    setShowPendingModal(true);
    try {
      const response = await axios.post('/orders/pending_order', {
        name: JSON.parse(localStorage.getItem('selfName')),
        items: itemsInCart,
        payment_method: paymentMethod,
        total: total
      });

      const orderId = response.data._id;
      setCurrentOrderId(orderId);
      localStorage.setItem('currentOrderId', orderId);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleClose = () => {
    setShowPendingModal(false);
    window.location.href = `/customer`;
  };

  const total = itemsInCart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="text-secondary">
      <nav className="navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between px-3">
        <a href="#" onClick={() => window.history.back()} className="text-white fs-3">
          <i className="bi bi-chevron-left"></i>
        </a>
        <img className="logo" src="/logo.png" alt="Logo" />
        <div className="me-3"></div>
      </nav>

      <div className="container py-5 px-3">
        {!showConfirmation ? (
          <div className="bg-white rounded-4 p-4 shadow">
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-hover table-striped text-center align-middle fs-4">
                <thead className="table-dark">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsInCart.map((item, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{item.combination}</td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-lg px-4 py-2"
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

            <div className="text-end pe-2 mb-4">
              <h3 className="text-dark fw-bold">Total: ${total.toFixed(2)}</h3>
            </div>

            <div className="mb-4">
              <button className="btn btn-dark btn-lg fs-4 w-100 py-3" onClick={() => setShowPayment(!showPayment)}>
                Proceed to Checkout
              </button>
            </div>

            {showPayment && (
              <div>
                <p className="fs-4 mb-3">Choose payment method:</p>

                <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                  <button
                    className={`btn ${paymentMethod === 'ATH' ? 'btn-dark' : 'btn-outline-dark'} btn-lg w-100 py-3 fs-4`}
                    onClick={() => setPaymentMethod('ATH')}
                  >
                    ATH Móvil
                  </button>
                  <button
                    className={`btn ${paymentMethod === 'CASH' ? 'btn-dark' : 'btn-outline-dark'} btn-lg w-100 py-3 fs-4`}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    Efectivo
                  </button>
                </div>

                <p className="fs-5 mb-3">Método seleccionado: <strong>{paymentMethod}</strong></p>

                <button
                  id="ATHMovil_Checkout_Button"
                  className="btn btn-dark btn-lg w-100 py-3 fs-4"
                  onClick={handlePay}
                  disabled={!paymentMethod}
                >
                  Pay
                </button>
              </div>
            )}

            <Modal show={showPendingModal} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fs-3 fw-bold">Order Pending</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center py-5">
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

            <Modal.Footer className="border-0 justify-content-center">
              <button className="btn btn-dark btn-lg fs-5 px-5 py-3" onClick={handleClose}>
                Back to Home Page
              </button>
            </Modal.Footer>
          </Modal>

          </div>
        ) : (
          <div className="text-center py-5">
            <img src="./img/check.png" alt="Check" className="mb-4" style={{ maxHeight: '120px' }} />
            <h2>Pago Completado</h2>
          </div>
        )}
      </div>
    </div>
  );
}
