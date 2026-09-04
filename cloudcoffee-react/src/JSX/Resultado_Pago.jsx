import React from 'react';
import '../CSS/Complementarias.css';

export default function ResultadoPago({ orderData, onGoToOrders, onGoToHome }) {
  const folio = orderData?.folio || 'CC-9805';
  const total = orderData?.total || 4300;

  return (
    <div className="mobile-wrapper">
      <div className="screen-container payment-result-container">
        <div className="payment-result-content">
          <div className="success-icon-badge">✓</div>

          <span className="payment-tag-mp">Mercado Pago Confirmado</span>
          <h1 className="payment-result-title">¡Tu pago fue exitoso!</h1>
          <p className="payment-result-subtitle">
            La cafetería ya recibió tu orden. Puedes retirar con tu código QR o presentando tu folio.
          </p>

          <div className="result-ticket-card">
            <div className="result-row">
              <span>Folio de Retiro</span>
              <strong>{folio}</strong>
            </div>
            <div className="result-row">
              <span>Total Pagado</span>
              <strong>${total.toLocaleString('es-CL')}</strong>
            </div>
            <div className="result-row">
              <span>Estado</span>
              <span className="status-pill pagado">🔵 Pagado</span>
            </div>
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="btn-primary-action"
              onClick={onGoToOrders}
            >
              Ver Código QR de Retiro
            </button>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={onGoToHome}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}