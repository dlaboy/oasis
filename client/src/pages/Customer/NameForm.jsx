import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './style.css';

export default function NameForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name) {
      setError('A name is required');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setError('Item name must be letters and spaces only');
      return;
    }

    setError('');

    try {
      // Assuming you have a backend endpoint for handling this logic
      const res = await fetch('http://localhost:5000/submit-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: name }),
      });

      if (res.ok) {
        window.location.href = 'http://localhost/orders/new-order.php';
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit name');
    }
  };

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-center">
        <img className="logo" src="./img/logo1.png" alt="Logo" />
      </nav>
      <div className="container conta">
        <div className="row welcome mt-5 rounded-4 d-flex flex-column">
          <div className="col d-flex flex-column align-items-center justify-content-center">
            <h1>Bienvenidos</h1>
            <p>Introduce un nombre y presiona para continuar</p>
            <form onSubmit={handleSubmit} className="d-flex flex-row justify-content-center">
              <div className="form-group w-100 d-flex flex-column justify-content-center">
                <input
                  type="text"
                  className="form-control w-100 p-2"
                  placeholder="Juan del Pueblo"
                  name="nombre"
                  id="n"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {error && <div className="text-light bg-danger p-1 mt-2">{error}</div>}
              </div>
              <button className="btn" type="submit" name="submit">
                <img className="ima" src="./img/right-arrow(1).png" alt="Submit" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
