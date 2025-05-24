import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Toaster, toast } from 'react-hot-toast';

export default function ProductSelector() {
  useEffect(() => {
    if (document.referrer.includes('/customer')) {
      const nombre = JSON.parse(localStorage.getItem('selfName') || '""');
      toast.success(`¡Bienvenido ${nombre}! 🍦`);
    }
  }, []);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const productDetails = {
    "Ice Cream Rolls": "Helado artesanal, 8 onzas preparado al momento. Escoge entre nuestras combinaciones favoritas (siguiente página) y toppings para el mismo."
    // "Waffle Bowls": "Waffle en forma de bowl, base perfecta para helado y toppings.",
    // "Cone Rolls": "Rollos de helado servidos dentro de conos crujientes.",
    // "Banana Split": "Clásico Banana Split con tres bolas de helado, frutas y toppings.",
    // "To-Go Bowls": "Opción para llevar, 8 onzas de helado en envase desechable.",
    // "Puppy Rolls": "Helado sin azúcar y sin lactosa, seguro para mascotas.",
  };

  const handleSelection = (e) => {
    const value = e.target.value;
    setSelectedProduct(value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Debe seleccionar un producto');
      return;
    }
    if (!productDetails[selectedProduct]) {
      setError('Producto no disponible');
      return;
    }
    window.location.href = `/icrform`;
  };

  useEffect(() => {
    if (selectedProduct) setExpanded(true);
  }, [selectedProduct]);

  return (
    <div className='prod-selector'>
      <Toaster position="bottom-center" />

      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between">
        <a href="/customer" className='ms-3'>
          <i className="bi bi-chevron-left fs-2 nav-icon"></i>
        </a>
        <img className="logo" src="/logo.png" alt="Logo" />
        <a href="/shopping" className='me-3'>
          <i className="bi bi-cart fs-2 nav-icon"></i>
        </a>
      </nav>

      <div className="conta container mt-3 rounded-3">
        <div className="row d-flex flex-column justify-content-center align-items-center">
          <div className="col d-flex justify-content-center align-item-center gy-3">
            <button type="button" className="rosa btn  text-light rounded-3 btn-lg boton-nuevo" onClick={() => setShowForm(!showForm)}>
              Nuevo +
            </button>
          </div>

          {showForm ? (
            <div className="col bg-white contenido rounded-3 p-3 d-flex align-items-center flex-column text-secondary gy-4">
              <section className="card shadow-sm p-4 mt-3 w-100">
                <h5 className="text-secondary mb-3">Tipo de Producto</h5>
                <select
                  className="form-select fs-4"
                  onChange={handleSelection}
                  value={selectedProduct || '0'}
                  aria-label="Selecciona tipo de producto"
                >
                  <option value="0" disabled>Selecciona el producto</option>
                  {Object.keys(productDetails).map((product, i) => (
                    <option key={i} value={product}>{product}</option>
                  ))}
                </select>
              </section>

              <section className="card shadow-sm p-4 mt-3 w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-secondary">Información del Producto</h5>
                  <button className="btn" onClick={() => setExpanded(prev => !prev)}>
                    <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                </div>

                {expanded && selectedProduct && (
                  <div className="mt-4">
                    <h5 className="fw-bold">{selectedProduct}</h5>
                    <p className="text-secondary">{productDetails[selectedProduct]}</p>
                  </div>
                )}
              </section>

              <section className="mt-4 w-100">
                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="d-flex justify-content-center">
                  <button className="btn btn-dark btn-lg fs-4 py-3 w-100 mt-4 rounded-4" type="submit">
                    Continuar
                  </button>
                </form>
              </section>
            </div>
          ) : (
            <div id="d" className="nuevo col d-flex justify-content-center gy-5 mt-4">
              <p className='lead presiona-nuevo'>Presiona <strong className='fw-bold'>Nuevo</strong> para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
