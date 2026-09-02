import React, { useState } from 'react';
import '../CSS/Registro_Sesion.css';

export default function RegistroSesion({ onBack, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      onNavigateToLogin();
    }, 1000);
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container register-container">
        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="register-content">
          <header className="header-section">
            <h1 className="title">
              Crear <span className="highlight-text">Cuenta</span>
            </h1>
            <p className="subtitle">
              Regístrate para comprar y pedir tu café sin filas en los campus UCT.
            </p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nombreCompleto">Nombre Completo</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Ej. Francisca Pérez"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@uct.cl o personal"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={cargando}
            >
              {cargando ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <footer className="footer-section">
            <p className="footer-text">
              ¿Ya tienes cuenta?{' '}
              <button 
                type="button" 
                className="link-highlight"
                onClick={onNavigateToLogin}
              >
                Inicia sesión aquí
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}