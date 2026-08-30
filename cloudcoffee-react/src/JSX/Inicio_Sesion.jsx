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

    const cleanEmail = (formData.email || '').trim().toLowerCase();

    // 1. Detección de roles por dominio
    const isCajero = cleanEmail.endsWith('@ca.cloudcoffee.cl');
    const isAdmin = !isCajero && cleanEmail.endsWith('@cloudcoffee.cl');
    
    let userRole = 'consumidor';
    if (isAdmin) userRole = 'admin';
    if (isCajero) userRole = 'cajero';

    // 2. Persistencia en localStorage
    localStorage.setItem('user_token', 'demo-token-jwt');
    localStorage.setItem('user_email', cleanEmail || 'estudiante@uct.cl');
    localStorage.setItem('user_role', userRole);

    // 3. Notificar a App.jsx con el rol correspondiente
    if (onLoginSuccess) {
      onLoginSuccess({
        email: cleanEmail,
        role: userRole,
        isAdmin: isAdmin,
        isCajero: isCajero
      });
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
              Ingresa tus credenciales para continuar al sistema.
            </p>
          </header>

          <form className="login-form" onSubmit={handleIngresar}>
            <div className="input-group">
              <label htmlFor="email">Correo Institucional / Administrativo</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@ca.cloudcoffee.cl o @uct.cl"
                value={formData.email}
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
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

            <button 
              type="submit" 
              className="btn btn-primary"
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