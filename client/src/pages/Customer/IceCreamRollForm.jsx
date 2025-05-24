import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function IceCreamRollForm() {
  const [formData, setFormData] = useState({
    ingredients: ['', '', ''],
    quantity: 0,
    toppings: {},
  });

  const [combination, setCombination] = useState('');

  const ingredientOptions = ['I Love Coffee', 'Strawberry Shortcake', 'Cookies & Cream'];
  const toppingOptions = ['Whipped Cream', 'Oreo', 'Maní'];

  useEffect(() => {
    const qty = formData.quantity;
    setFormData(prev => {
      const newToppings = { ...prev.toppings };
      for (let i = 1; i <= qty; i++) {
        if (!newToppings[i]) newToppings[i] = [];
      }
      Object.keys(newToppings).forEach(key => {
        if (parseInt(key) > qty) delete newToppings[key];
      });
      return { ...prev, toppings: newToppings };
    });
  }, [formData.quantity]);

  const handleChange = (section, index, value) => {
    if (section === 'ingredients') {
      let ingredients = [];
      if (value === 'I Love Coffee') ingredients = ['Café', 'Caramelo', 'Almendra'];
      else if (value === 'Strawberry Shortcake') ingredients = ['Fresa', 'Cheesecake', 'Almendra'];
      else if (value === 'Cookies & Cream') ingredients = ['Oreo', 'Queso', 'Chips'];

      setFormData(prev => (combination === value
        ? { ...prev, ingredients: ['', '', ''] }
        : { ...prev, ingredients }));

      setCombination(prev => (prev === value ? '' : value));
    }
  };

  const handleQuantity = value => {
    setFormData(prev => ({ ...prev, quantity: parseInt(value) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const storedItems = localStorage.getItem('selfItems');
    let selfItems = storedItems ? JSON.parse(storedItems) : [];

    for (let i = 1; i <= formData.quantity; i++) {
      selfItems.push({
        combination,
        ingredients: formData.ingredients,
        toppings: formData.toppings[i] || [],
      });
    }

    localStorage.setItem('selfItems', JSON.stringify(selfItems));
    setFormData({ ingredients: ['', '', ''], quantity: 0, toppings: {} });
    setCombination('');
    window.location.href = `/product`;
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-black w-100 d-flex flex-column py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a href="#" onClick={() => window.history.back()} className="text-white fs-3">
            <i className="bi bi-chevron-left"></i>
          </a>
          <img src="/logo.png" alt="Logo" />
          <a href="/shopping" className="text-white fs-3">
            <i className="bi bi-cart"></i>
          </a>
        </div>
        <div className="text-white text-center mt-2 fs-4 fw-semibold">
          Producto: Ice Cream Rolls
        </div>
      </nav>

      {/* Form */}
      <div className="container mt-4">
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow-lg">

          {/* Ice Cream Selection */}
          <h4 className="text-secondary mb-3">Ice Cream</h4>
          <div className="d-flex flex-wrap gap-3 mb-4">
            {ingredientOptions.map((opt, idx) => (
              <button
                type="button"
                key={idx}
                className={`btn btn-outline-primary fw-bold px-4 py-3 fs-4 rounded-3 ${
                  combination === opt ? 'active' : ''
                }`}
                onClick={() => handleChange('ingredients', idx, opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Quantity Selector */}
          {combination && (
            <>
              <h4 className="text-secondary mb-2">Cantidad</h4>
              <select
                className="form-select form-select-lg mb-4 fs-4"
                value={formData.quantity}
                onChange={e => handleQuantity(e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </>
          )}

          {/* Toppings Section */}
          {formData.quantity >= 1 && (
            <>
              <h4 className="text-secondary mb-3">Toppings por helado</h4>
              {Array.from({ length: formData.quantity }, (_, i) => {
                const heladoNum = i + 1;
                const toppingSet = formData.toppings[heladoNum] || [];
                return (
                  <div key={heladoNum} className="mb-4">
                    <h5>Helado #{heladoNum}</h5>
                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {toppingOptions.map((opt, idx) => (
                        <button
                          type="button"
                          key={idx}
                          className={`btn btn-outline-primary fw-bold px-4 py-3 fs-5 rounded-3 ${
                            toppingSet.includes(opt) ? 'active' : ''
                          }`}
                          onClick={() => {
                            const updatedSet = [...toppingSet];
                            const index = updatedSet.indexOf(opt);
                            if (index > -1) {
                              updatedSet.splice(index, 1);
                            } else if (updatedSet.length < 3) {
                              updatedSet.push(opt);
                            }

                            setFormData(prev => ({
                              ...prev,
                              toppings: {
                                ...prev.toppings,
                                [heladoNum]: updatedSet,
                              },
                            }));
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Selection Summary */}
          {formData.quantity > 0 && (
            <div className="mt-4 bg-light p-4 rounded-4 shadow-sm">
              <h4 className="text-secondary">Tu selección</h4>
              <ul className="list-group mt-3">
                <li className="list-group-item d-flex justify-content-between align-items-center fs-5">
                  <strong>Ice Cream:</strong> {combination}
                  <button
                    type="button"
                    className="btn btn-danger btn-lg fs-5 px-4 py-2 rounded-3"
                    onClick={() => {
                      setCombination('');
                      setFormData(prev => ({ ...prev, ingredients: ['', '', ''] }));
                    }}
                  >
                    Quitar
                  </button>
                </li>
                {Object.entries(formData.toppings).map(([key, tSet]) => (
                  <li key={key} className="list-group-item fs-5">
                    <strong>Toppings Helado #{key}:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {tSet.length > 0 ? (
                        tSet.map((topping, i) => (
                          <span key={i} className="badge bg-primary fs-5 p-3 rounded-pill">
                            {topping}
                            <button
                              type="button"
                              className="btn btn-sm btn-light ms-2 py-0 px-2"
                              onClick={() => {
                                setFormData(prev => {
                                  const updated = [...prev.toppings[key]];
                                  updated.splice(i, 1);
                                  return {
                                    ...prev,
                                    toppings: {
                                      ...prev.toppings,
                                      [key]: updated
                                    }
                                  };
                                });
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">Ninguno</span>
                      )}
                    </div>
                  </li>
                ))}
                <li className="list-group-item fs-5">
                  <strong>Cantidad:</strong> {formData.quantity}
                </li>
              </ul>
            </div>
          )}

          {/* Submit Button */}
          {combination && (
            <button
              type="submit"
              className="btn btn-dark btn-lg fs-4 py-3 w-100 mt-4 rounded-4"
            >
              Add to cart
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
