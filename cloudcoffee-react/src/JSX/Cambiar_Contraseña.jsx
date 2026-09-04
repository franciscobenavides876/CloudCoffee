import React, { useState } from 'react';
import '../CSS/Complementarias.css';

export default function CambiarContraseña({ onBack, onSuccess }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nueva !== confirmar) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    alert('✓ Tu contraseña ha sido actualizada correctamente.');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container change-pwd-container">
        <button className="back-button-light" onClick={onBack} type="button">
          ← Volver al Perfil
        </button>

        <div className="change-pwd-content">
          <header className="change-pwd-header">
            <div className="pwd-badge">SEGURIDAD</div>
            <h1>Cambiar Contraseña</h1>
            <p>Actualiza la clave de acceso para tu cuenta institucional.</p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="change-pwd-form">
            <div className="form-group">
              <label>Contraseña Actual *</label>
              <input
                type="password"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                placeholder="Ingresa tu clave actual"
                required
              />
            </div>

            <div className="form-group">
              <label>Nueva Contraseña *</label>
              <input
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nueva Contraseña *</label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite la nueva clave"
                required
              />
            </div>

            <button type="submit" className="btn-save-pwd">
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}