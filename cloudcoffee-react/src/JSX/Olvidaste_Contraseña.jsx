import React, { useState } from 'react';
import '../CSS/Olvidaste_Contraseña.css';

export default function OlvidasteContraseña({ onBack, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setMensaje(null);

    try {
      console.log('Solicitando enlace de restablecimiento para:', email);
      
      // Simulación de envío hacia auth-service
      setTimeout(() => {
        setCargando(false);
        setMensaje('Hemos enviado las instrucciones a tu correo.');
      }, 1000);
    } catch (err) {
      setCargando(false);
      setError('Error al procesar la solicitud. Intenta nuevamente.');
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container reset-card-container">
        {/* Fondo azul petróleo y círculos vectoriales */}
        <div className="petroleum-background" />
        <div className="thin-circle tc-1" />
        <div className="thin-circle tc-2" />
        <div className="thin-circle tc-3" />

        {/* Botón de retorno */}
        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="reset-content">
          <header className="header-section">
            <h1 className="title">
              Recuperar <span className="highlight-text">Acceso</span>
            </h1>
            <p className="subtitle">
              Ingresa tu correo registrado para recibir el enlace de restablecimiento.
            </p>
          </header>

          {error && <div className="error-banner">{error}</div>}
          {mensaje && <div className="success-banner">{mensaje}</div>}

          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                required
                placeholder="ejemplo@uct.cl o personal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={cargando}
            >
              {cargando ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </form>

          <footer className="footer-section">
            <p className="footer-text">
              ¿Recordaste tu contraseña?{' '}
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