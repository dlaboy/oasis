import { useState,useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemContext } from '../../../context/ItemContext';
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
      localStorage.setItem('selfName',JSON.stringify(name))
      console.log(process.env.VITE_REACT_APP_DYNAMIC_URL)
      window.location.href = `/product`;

    } catch (err) {
      console.error(err);
      setError('Failed to submit name');
    }
  };

  return (
    <div>
      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-between">
         {/* <a href="#" onClick={() => window.history.back()} className='ms-3'> */}
         <a href="/" className='ms-3'>
            <i className="bi bi-chevron-left"></i>
          </a>
        <img className="logo" src="/logo.png" alt="Logo" />
        <div></div>
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
                {/* <img className="ima" src="./img/right-arrow(1).png" alt="Submit" /> */}
                <i className="bi bi-chevron-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
