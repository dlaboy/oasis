import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ice-cream-rolls.css';

export default function IceCreamRollForm() {
  const [formData, setFormData] = useState({
  ingredients: ['', '', ''],
  quantity: 0,
  toppings: {}, // ← será un objeto tipo { 1: ['Oreo', 'Miel'], 2: ['Almendra'], ... }
});

  const [combination, setCombination] = useState('');

useEffect(() => {
  const qty = formData.quantity;
  setFormData(prev => {
    const newToppings = { ...prev.toppings };
    for (let i = 1; i <= qty; i++) {
      if (!newToppings[i]) {
        newToppings[i] = [];
      }
    }

    // Eliminar toppings de helados que ya no existen
    Object.keys(newToppings).forEach(key => {
      if (parseInt(key) > qty) {
        delete newToppings[key];
      }
    });

    return { ...prev, toppings: newToppings };
  });
}, [formData.quantity]);


const handleChange = (section, index, value) => {
  console.log("Change");

  if (section === 'ingredients') {
    let ingredients = [];

    if (value === 'I Love Coffee') {
      ingredients = ['Café', 'Caramelo', 'Almendra'];
    } else if (value === 'Strawberry Shortcake') {
      ingredients = ['Fresa', 'Cheesecake', 'Almendra'];
    } else if (value === 'Cookies & Cream') {
      ingredients = ['Oreo', 'Queso', 'Chips'];
    }

    setFormData(prev => {
      // Si ya está seleccionada esta combinación, la quitamos
      if (combination === value) {
        return { ...prev, ingredients: ['', '', ''] }; // borra los 3 ingredientes
      } else {
        return { ...prev, ingredients };
      }
    });

    // Si se seleccionó nuevamente la misma combinación, limpiar `combination`
    setCombination(prev => (prev === value ? '' : value));
  } else {
    // Para toppings u otras secciones
    setFormData(prev => {
      const updated = [...prev[section]];
      updated[index] = value;
      return { ...prev, [section]: updated };
    });
  }
};


  const handleQuantity = value => {
    setFormData(prev => ({ ...prev, quantity: parseInt(value) }));
  };

const handleSubmit = async e => {
  e.preventDefault();

  // Obtener el array existente de localStorage (o inicializar)
  const storedItems = localStorage.getItem('selfItems');
  let selfItems = storedItems ? JSON.parse(storedItems) : [];

  // Agregar cada helado individualmente
  for (let i = 1; i <= formData.quantity; i++) {
    const heladoItem = {
      ingredients: formData.ingredients,
      toppings: formData.toppings[i] || []
    };

    selfItems.push(heladoItem);
  }

  // Guardar de nuevo en localStorage
  localStorage.setItem('selfItems', JSON.stringify(selfItems));
    // ✅ Limpiar formulario
  setFormData({
    ingredients: ['', '', ''],
    quantity: 0,
    toppings: {},
  });
  setCombination('');

  // Redirigir si deseas
  window.location.href = 'http://localhost:3000/product';
};



  const ingredientOptions = ['I Love Coffee', 'Strawberry Shortcake', 'Cookies & Cream'];
  const toppingOptions = ['Whipped Cream', 'Oreo', 'Maní'];

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between flex-column">
        <div className="col d-flex align-items-center justify-content-between w-100">
          <a href="#" onClick={() => window.history.back()} className='ms-3'>
            <i className="bi bi-chevron-left"></i>
          </a>
          <img className="logo" src="/logo.png" alt="Logo" />
          <a href="/shopping" className='me-3'>
            <i className="bi bi-cart"></i>
          </a>
        </div>
        <div className="col col-12 d-flex align-items-center justify-content-center gy-3 m-2">
          <h4 className="text-light">Product: Ice Cream Rolls</h4>
        </div>
      </nav>

      <div className="container d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="tab row d-flex flex-column rounded-4 p-3 gap-4">
          <div className="d-flex flex-row justify-content-between">
            <h5>Ice Cream</h5>
            <div className="">
              <input type="text" name="" id="" />
              <button className='btn'><i className="bi bi-search"></i></button>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {ingredientOptions.map((opt, idx) => (
              <button
                type="button"  // ✅ <-- ESTO es lo importante
                key={idx}
                className={`btn btn-outline-primary p-3 rounded-0 ${
                  combination === opt ? 'active' : ''
                }`}
                style={{ minWidth: '120px' }}
                onClick={() => handleChange('ingredients',idx,opt)}
              >
                {opt}
              </button>
            ))}
          </div>

{ combination != "" && (
  <>
  
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
  </>
)}
          

 {formData.quantity >= 1 && (
  <div className="mt-4">
    <h5>Selecciona toppings por helado:</h5>
    {Array.from({ length: formData.quantity }, (_, i) => {
      const heladoNum = i + 1;
      const toppingSet = formData.toppings[heladoNum] || [];
      return (
        <div key={heladoNum} className="mb-3">
          <h6>Helado #{heladoNum}</h6>
          <div className="d-flex flex-wrap gap-2">
            {toppingOptions.map((opt, idx) => (
              <button
                type="button"  // ✅ <-- ESTO es lo importante
                key={idx}
                className={`btn btn-outline-primary p-2 rounded-0 ${
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
  </div>
)}




{formData.quantity > 0 && (
  <div className="mt-4">
    <h5>Tu selección:</h5>
    <ul className="list-group mb-3">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Ice Cream: {combination}
        <button
          type="button"  // ✅ <-- ESTO es lo importante
          className="btn btn-sm btn-danger"
          onClick={() => {
            setCombination('');
            setFormData(prev => ({ ...prev, ingredients: ['', '', ''] }));
          }}
        >
          Quitar
        </button>
      </li>
      {Object.entries(formData.toppings).map(([key, tSet]) => (
        <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
          Toppings Helado #{key}: {tSet.join(', ') || 'Ninguno'}
          <button
            type="button"  // ✅ <-- ESTO es lo importante
            className="btn btn-sm btn-danger"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                toppings: {
                  ...prev.toppings,
                  [key]: [],
                },
              }));
            }}
          >
            Quitar
          </button>
        </li>
      ))}
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Cantidad: {formData.quantity}
        {/* <button
          className="btn btn-sm btn-danger"
          onClick={() => setFormData(prev => ({ ...prev, quantity: 0 }))}
        >
          Quitar
        </button> */}
      </li>
    </ul>
  </div>
)}




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