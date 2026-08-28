import React, { useState } from 'react';
import '../CSS/Inicio_Sesion.css';

export default function InicioSesion({ onBack, onNavigateToRegister, onNavigateToReset, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleIngresar = (e) => {
    e.preventDefault();
    console.log("Ingresando con datos:", formData);

    // Guardar credenciales de sesión local
    localStorage.setItem('user_token', 'demo-token-jwt');
    localStorage.setItem('user_email', formData.email || 'estudiante@uct.cl');
    
    // Cambiar a la vista del consumidor
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container">
        {/* Fondo y círculos vectoriales */}
        <div className="petroleum-background" />
        <div className="thin-circle tc-1" />
        <div className="thin-circle tc-2" />
        <div className="thin-circle tc-3" />

        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="login-content">
          <header className="header-section">
            <h1 className="title">
              Iniciar <span className="highlight-text">Sesión</span>
            </h1>
            <p className="subtitle">
              Ingresa tus datos institucionales de la UCT para continuar.
            </p>
          </header>

          <form className="login-form" onSubmit={handleIngresar}>
            <div className="input-group">
              <label htmlFor="email">Correo Institucional</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@uct.cl"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="forgot-password">
              <button 
                type="button" 
                className="link-button"
                onClick={onNavigateToReset}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón con onClick y type="submit" garantizados */}
            <button 
              type="submit" 
              className="btn btn-primary"
              onClick={handleIngresar}
            >
              Ingresar
            </button>
          </form>

          <footer className="footer-section">
            <p className="footer-text">
              ¿No tienes una cuenta?{' '}
              <button 
                type="button" 
                className="link-highlight"
                onClick={onNavigateToRegister}
              >
                Regístrate gratis
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}