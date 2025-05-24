import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Toaster, toast } from 'react-hot-toast';


export default function NameForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ← nuevo estado

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name) {
      // setError('A name is required');
      toast.error('Se requiere poner un nombre');

      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      // setError('Item name must be letters and spaces only');
      toast.error('Item name must be letters and spaces only');

      return;
    }

    setError('');
    setLoading(true); // ← activamos loading

    try {
      localStorage.setItem('selfName', JSON.stringify(name));
      // Pequeño delay para que se vea el spinner
      setTimeout(() => {
        window.location.href = `/product`;
      }, 500);
    } catch (err) {
      console.error(err);
      setError('Failed to submit name');
      toast.error('Failed to submit name');

      
      setLoading(false);
    }
  };

  return (
    <div className='name-form'>
      <Toaster position="bottom-center" />

      <nav className="nave navbar navbar-expand navbar-dark bg-black w-100 d-flex align-items-center justify-content-center">
        <img className="logo" src="/logo1.png" alt="Logo" />
      </nav>
      <div className="container conta d-flex justify-content-center align-items-center ">
        <div className="row welcome mt-5 rounded-4 d-flex flex-column ">
          <div className="col d-flex flex-column align-items-center justify-content-center ">
            <h1 className="display-1" style={{ fontWeight: 'bold' }}>Bienvenido</h1>
            <p className="fs-2">Introduce tu nombre</p>
            <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-center gap-3">
              <div className="form-group w-100 d-flex flex-row justify-content-center">
                <input
                  type="text"
                  className={`form-control w-100 p-3 fs-2 justify-content-center align-items-center`}
                  placeholder="Juan del Pueblo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}                       // ← deshabilitado mientras carga
                />
              </div>
              {error && <div className="text-light bg-danger p-1 mt-2">{error}</div>}
              <button
                className={`btn w-100 fs-2 d-flex justify-content-center align-items-center
                  ${loading ? 'btn-loading' : 'btn-outline-light text-white'}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Cargando
                    <span
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  <>
                    Continuar
                    <i className="bi bi-chevron-right fs-2 ms-3"></i>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
