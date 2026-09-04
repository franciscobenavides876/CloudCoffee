import React, { useState } from 'react';
import '../CSS/Olvidaste_Contraseña.css';

export default function OlvidasteContraseña({ onBack, onNavigateToLogin, onNavigateToRestore }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 800);
  };

  // VISTA 2: Enlace Enviado (Revisa tu Correo)
  if (enviado) {
    return (
      <div className="mobile-wrapper">
        <div className="screen-container">
          <button className="back-button" onClick={() => setEnviado(false)} type="button">
            ← Volver
          </button>

          <div className="reset-content reset-centered-view">
            <div className="reset-icon-circle">📩</div>

            <span className="reset-pill-badge">ENLACE GENERADO</span>
            <h1 className="title" style={{ color: '#0052CC' }}>Revisa tu Correo</h1>

            <p className="subtitle">
              Hemos enviado un enlace de acceso directo para restablecer tu contraseña a:
            </p>

            <div className="reset-email-chip">
              <span>👤</span>
              <strong>{email}</strong>
            </div>

            <p className="reset-hint-text">
              Haz clic en el enlace de tu correo para crear una nueva clave de acceso.
            </p>

            <div className="reset-actions-column">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onNavigateToRestore || onNavigateToLogin}
              >
                Volver a Iniciar Sesión
              </button>

              <button
                type="button"
                className="link-highlight link-resend"
                onClick={() => alert(`✓ Enlace reenviado a ${email}`)}
              >
                ¿No recibiste el correo? Reenviar enlace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 1: Formulario Recuperar Acceso
  return (
    <div className="mobile-wrapper">
      <div className="screen-container">
        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="reset-content">
          <header className="header-section">
            <h1 className="title">Recuperar Acceso</h1>
            <p className="subtitle">
              Ingresa tu correo registrado para recibir el enlace de restablecimiento.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="input-group">
              <label htmlFor="reset-email">CORREO ELECTRÓNICO</label>
              <input
                id="reset-email"
                type="email"
                placeholder="ejemplo@uct.cl o personal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={cargando}>
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