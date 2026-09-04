import React, { useState } from 'react';
import '../CSS/Complementarias.css';

export default function RestaurarContraseña({ onBack, onSuccess }) {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return;
    }

    setError('');
    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      alert('✓ Tu contraseña ha sido reestablecida exitosamente.');
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container">
        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="reset-content">
          <header className="header-section">
            <h1 className="title" style={{ color: '#0052CC' }}>
              Restablecer Contraseña
            </h1>
            <p className="subtitle">
              Crea una nueva contraseña segura para acceder a tu cuenta.
            </p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="input-group">
              <label htmlFor="nueva-pass">NUEVA CONTRASEÑA *</label>
              <input
                id="nueva-pass"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={nuevaPassword}
                onChange={(e) => {
                  setNuevaPassword(e.target.value);
                  if (error) setError('');
                }}
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmar-pass">CONFIRMAR NUEVA CONTRASEÑA *</label>
              <input
                id="confirmar-pass"
                type="password"
                placeholder="Repite la nueva contraseña"
                value={confirmarPassword}
                onChange={(e) => {
                  setConfirmarPassword(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}