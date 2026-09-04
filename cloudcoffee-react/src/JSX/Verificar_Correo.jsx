import React, { useState } from 'react';
import '../CSS/Complementarias.css';

export default function VerificarCorreo({ email, onVerifySuccess, onRejectAccount }) {
  const [cargando, setCargando] = useState(false);

  const handleConfirmar = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      alert('✓ Tu correo ha sido validado con éxito.');
      if (onVerifySuccess) onVerifySuccess();
    }, 800);
  };

  const handleRechazar = () => {
    const confirmarRechazo = window.confirm(
      '¿Estás seguro de que no creaste esta cuenta? Se cancelará el registro de forma inmediata.'
    );
    if (!confirmarRechazo) return;

    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_profile_data');

    alert('Has rechazado la solicitud. El registro fue cancelado.');
    if (onRejectAccount) {
      onRejectAccount();
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container verify-container">
        <div className="verify-content">
          <div className="verify-icon">✉️</div>
          
          <span className="verify-badge">VERIFICACIÓN DE CUENTA</span>
          <h1>Confirma tu Correo</h1>

          <p className="verify-question">
            ¿Has solicitado crear una cuenta en <strong>CloudCoffee</strong> con la siguiente dirección?
          </p>

          <div className="verify-email-card">
            <span className="verify-email-icon">👤</span>
            <strong>{email || 'estudiante@uct.cl'}</strong>
          </div>

          <div className="verify-actions-group">
            <button
              type="button"
              className="btn-confirm-email"
              onClick={handleConfirmar}
              disabled={cargando}
            >
              {cargando ? 'Validando...' : 'Sí, confirmar mi correo'}
            </button>

            <button
              type="button"
              className="link-reject-email"
              onClick={handleRechazar}
              disabled={cargando}
            >
              No he creado una cuenta en esta app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}