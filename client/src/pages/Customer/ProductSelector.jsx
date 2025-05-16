import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './new-order.css';

export default function ProductSelector() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const productDetails = {
    "Ice Cream Rolls": "Ice Cream Rolls description...",
    "Waffle Bowls": "Waffle Bowls description...",
    "Cone Rolls": "Cone Rolls description...",
    "Banana Split": "Banana Split description...",
    "To-Go Bowls": "To-Go Bowls description...",
    "Puppy Rolls": "Puppy Rolls description...",
  };

  const handleSelection = (e) => {
    const value = e.target.value;
    setSelectedProduct(value);
    if (value === 'Ice Cream Rolls') setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('A product has to be selected');
      return;
    }
    if (selectedProduct !== 'Ice Cream Rolls') {
      setError('Product Unavailable');
      return;
    }
    window.location.href = 'http://localhost/orders/ice-cream-rolls.php';
  };

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between">
        <a href="/customer">
          <img className="ima m-4" src="./img/left-arrow.png" alt="Back" />
        </a>
        <img className="logo" src="./img/logo1.png" alt="Logo" />
        <a href="/shopping">
          <img className="ima m-4" src="./img/shopping-cart(1).png" alt="Cart" />
        </a>
      </nav>

      <div className="conta container mt-3 rounded-3">
        <div className="row d-flex flex-column justify-content-center align-items-center">
          <div className="col d-flex justify-content-center align-item-center gy-3">
            <button type="button" className="rosa btn rounded-3 btn-lg" onClick={() => setShowForm(!showForm)}>
              New +
            </button>
          </div>

          {showForm ? (
            <div className="col bg-white contenido rounded-3 p-3 d-flex align-items-center flex-column text-secondary gy-4">
              <div className="col col-12 p-4 d-flex flex-column justify-content-center align-items-center gy-5">
                <h4 className="w-100">Product Type</h4>
                <select
                  className="form-select w-100 m-3"
                  onChange={handleSelection}
                  value={selectedProduct || '0'}
                >
                  <option value="0" disabled>
                    Select Product
                  </option>
                  {Object.keys(productDetails).map((product, i) => (
                    <option key={i} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col more-info p-4 w-100">
                <div className="col d-flex flex-row justify-content-between" id="prohe">
                  <h4>Product Information</h4>
                  <div className="flechas">
                    <button className="btn" onClick={() => setExpanded(false)}>
                      <img className="up" src="./img/upload.png" alt="Less" />
                    </button>
                    <button className="btn" onClick={() => setExpanded(true)}>
                      <img className="ima" src="./img/down-arrow (2).png" alt="More" />
                    </button>
                  </div>
                </div>

                {expanded && selectedProduct && (
                  <div className="mt-4">
                    <h5>{selectedProduct}</h5>
                    <p className="ms-3">{productDetails[selectedProduct]}</p>
                  </div>
                )}
              </div>

              <div className="col d-flex align-items-center justify-content-center">
                <form className="d-flex flex-column justify-content-center" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div className="text-center error text-danger">{error}</div>
                  </div>
                  <button className="btn btn-dark rounded-3 btn-lg" type="submit">
                    Continue
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div id="d" className="nuevo col d-flex justify-content-center gy-5">
              <p>Press button to add product to order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}