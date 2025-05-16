import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ice-cream-rolls.css';

export default function IceCreamRollForm() {
  const [formData, setFormData] = useState({
    ingredients: ['', '', ''],
    toppings: ['', '', ''],
    quantity: 0,
  });

  const handleChange = (section, index, value) => {
    setFormData(prev => {
      const updated = [...prev[section]];
      updated[index] = value;
      return { ...prev, [section]: updated };
    });
  };

  const handleQuantity = value => {
    setFormData(prev => ({ ...prev, quantity: parseInt(value) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      prodname: 'Ice Cream Rolls',
      ingredients: formData.ingredients.join(','),
      toppings: formData.toppings.join(','),
      quantity: formData.quantity,
    };

    try {
      const res = await fetch('http://localhost:5000/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.location.href = 'new-order.php';
      } else {
        console.error('Error adding product');
      }
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  const ingredientOptions = ['Nutella', 'Fresa', 'Oreo'];

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between flex-column">
        <div className="col d-flex align-items-center justify-content-between w-100">
          <a href="/product">
            <img className="ima m-4" src="./img/left-arrow.png" alt="Back" />
          </a>
          <img className="logo" src="./img/logo1.png" alt="Logo" />
          <a href="./shopping">
            <img className="ima m-4" src="./img/shopping-cart(1).png" alt="Cart" />
          </a>
        </div>
        <div className="col col-12 d-flex align-items-center justify-content-center gy-3 m-2">
          <h4 className="text-light">Product: Ice Cream Rolls</h4>
        </div>
      </nav>

      <div className="container d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="tab row d-flex flex-column rounded-4 p-3">
          <h5>Ingredients</h5>
          {formData.ingredients.map((_, i) => (
            <div key={i} className="d-flex flex-row align-items-center mb-2">
              <h5 className="w-25">{i + 1}</h5>
              <select
                className="form-select p-3"
                value={formData.ingredients[i]}
                onChange={e => handleChange('ingredients', i, e.target.value)}
              >
                <option>Select Ingredient</option>
                {ingredientOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <h5 className="mt-4">Toppings</h5>
          {formData.toppings.map((_, i) => (
            <div key={i} className="d-flex flex-row align-items-center mb-2">
              <h5 className="w-25">{i + 1}</h5>
              <select
                className="form-select p-3"
                value={formData.toppings[i]}
                onChange={e => handleChange('toppings', i, e.target.value)}
              >
                <option>Select Topping</option>
                {ingredientOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <h5 className="mt-4">Quantity</h5>
          <div className="d-flex flex-row align-items-center">
            <select
              className="form-select w-50"
              value={formData.quantity}
              onChange={e => handleQuantity(e.target.value)}
            >
              {[0, 1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rosa p-3 btn btn-primary border-top-0 border-primary rounded-4 m-3"
          >
            Add to cart
          </button>
        </form>
      </div>
    </div>
  );
}