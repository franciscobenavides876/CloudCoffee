import React, { useState, useEffect } from 'react';
import '../CSS/Mi_Pedido.css';

export default function MiPedido({ onBack, currentOrder }) {
  // Cargar órdenes del cliente desde localStorage si no viene una por prop
  const [orders, setOrders] = useState(() => {
    if (currentOrder) return [currentOrder];
    const saved = localStorage.getItem('cajero_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'PED-101',
        folio: 'CC-9801',
        hashQR: 'hash_sha256_mock_101',
        cliente: 'Ignacio Soto',
        email: 'ignacio.soto@uct.cl',
        hora: '10:15 AM',
        cafeName: 'Cafetería Central',
        items: [
          { name: 'Café Americano 12oz', qty: 2, price: 1800 },
          { name: 'Croissant Jamón y Queso', qty: 1, price: 2500 }
        ],
        total: 6100,
        status: 'listo'
      },
      {
        id: 'PED-102',
        folio: 'CC-9802',
        hashQR: 'hash_sha256_mock_102',
        cliente: 'Camila Vergara',
        email: 'camila.v@uct.cl',
        hora: '10:22 AM',
        cafeName: 'Cafetería Central',
        items: [
          { name: 'Jugo Natural Naranja 300ml', qty: 2, price: 2000 }
        ],
        total: 4000,
        status: 'pagado'
      }
    ];
  });

  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="mobile-wrapper">
      <div className="screen-container my-order-container">
        
        {/* Botón Volver */}
        <button className="back-button-light" onClick={onBack} type="button">
          ← Volver
        </button>

        {/* Encabezado */}
        <header className="my-order-header">
          <div className="my-order-badge">SEGUIMIENTO DE RETIRO</div>
          <h1 className="my-order-title">Mis Pedidos</h1>
          <p className="my-order-subtitle">
            Presenta este código QR o tu folio en la barra de la cafetería para retirar tu compra.
          </p>
        </header>

        {/* Selector de Pedidos Rediseñado */}
        {orders.length > 1 && (
          <div className="order-selector-container">
            <span className="order-selector-label">Selecciona una orden activa:</span>
            <div className="order-selector-tabs">
              {orders.map((ord) => {
                const isActive = activeOrder?.id === ord.id;
                return (
                  <button
                    key={ord.id}
                    type="button"
                    className={`order-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedOrderId(ord.id)}
                  >
                    <span className="tab-order-id">{ord.id}</span>
                    <span className={`tab-order-badge ${ord.status || 'pagado'}`}>
                      {ord.status === 'listo' ? 'Listo 🟢' : 'Pagado 🔵'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!activeOrder ? (
          <div className="my-order-empty-state">
            <span className="empty-order-icon">☕</span>
            <h3>No tienes pedidos activos</h3>
            <p>Cuando realices una compra en el carrito, aquí verás tu código QR para el retiro.</p>
            <button className="btn-go-menu" onClick={onBack} type="button">
              Ir al Menú
            </button>
          </div>
        ) : (
          <div className="order-details-card">
            
            {/* Header del Ticket */}
            <div className="ticket-top">
              <div className="ticket-cafe">
                <span className="ticket-cafe-icon">📍</span>
                <div>
                  <strong>{activeOrder.cafeName || 'Cafetería Central'}</strong>
                  <small>{activeOrder.hora || 'Reciente'}</small>
                </div>
              </div>
              <span className={`status-pill ${activeOrder.status || 'pagado'}`}>
                {activeOrder.status === 'pagado' && '🔵 Pagado'}
                {activeOrder.status === 'listo' && '🟢 Listo para Retiro'}
                {activeOrder.status === 'entregado' && '⚪ Entregado'}
              </span>
            </div>

            {/* Bloque QR y Folio */}
            <div className="qr-box-section">
              <div className="qr-code-wrapper">
                <svg
                  className="simulated-qr-svg"
                  viewBox="0 0 160 160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="160" height="160" fill="#FFFFFF" rx="8" />
                  <rect x="12" y="12" width="40" height="40" fill="#0052CC" rx="4" />
                  <rect x="18" y="18" width="28" height="28" fill="#FFFFFF" rx="2" />
                  <rect x="24" y="24" width="16" height="16" fill="#0052CC" />

                  <rect x="108" y="12" width="40" height="40" fill="#0052CC" rx="4" />
                  <rect x="114" y="18" width="28" height="28" fill="#FFFFFF" rx="2" />
                  <rect x="120" y="24" width="16" height="16" fill="#0052CC" />

                  <rect x="12" y="108" width="40" height="40" fill="#0052CC" rx="4" />
                  <rect x="18" y="114" width="28" height="28" fill="#FFFFFF" rx="2" />
                  <rect x="24" y="120" width="16" height="16" fill="#0052CC" />

                  <rect x="62" y="20" width="8" height="16" fill="#1D2433" />
                  <rect x="76" y="14" width="16" height="8" fill="#1D2433" />
                  <rect x="62" y="44" width="12" height="12" fill="#1D2433" />
                  <rect x="80" y="38" width="14" height="14" fill="#0052CC" />
                  <rect x="20" y="62" width="16" height="8" fill="#1D2433" />
                  <rect x="44" y="62" width="8" height="16" fill="#1D2433" />
                  <rect x="60" y="66" width="38" height="26" fill="#1D2433" rx="4" />
                  <rect x="106" y="62" width="14" height="14" fill="#1D2433" />
                  <rect x="128" y="62" width="18" height="8" fill="#1D2433" />
                  <rect x="20" y="80" width="14" height="18" fill="#1D2433" />
                  <rect x="110" y="84" width="16" height="14" fill="#0052CC" />
                  <rect x="134" y="80" width="12" height="20" fill="#1D2433" />
                  <rect x="62" y="102" width="20" height="8" fill="#1D2433" />
                  <rect x="90" y="102" width="8" height="20" fill="#1D2433" />
                  <rect x="62" y="120" width="14" height="18" fill="#0052CC" />
                  <rect x="84" y="130" width="24" height="12" fill="#1D2433" />
                  <rect x="116" y="116" width="14" height="14" fill="#1D2433" />
                  <rect x="138" y="124" width="10" height="18" fill="#1D2433" />
                </svg>
              </div>

              <div className="folio-pill">
                <span>FOLIO CORTO:</span>
                <strong>{activeOrder.folio || 'CC-9801'}</strong>
              </div>
              <small className="qr-hint">ID de orden: {activeOrder.id}</small>
            </div>

            {/* Desglose de Productos */}
            <div className="ticket-items-section">
              <h4>Productos Comprados</h4>
              <div className="ticket-items-list">
                {activeOrder.items?.map((it, idx) => (
                  <div key={idx} className="ticket-item-row">
                    <span>{it.qty || it.quantity}x {it.name}</span>
                    <strong>${((it.price || 0) * (it.qty || it.quantity || 1)).toLocaleString('es-CL')}</strong>
                  </div>
                ))}
              </div>

              <div className="ticket-total-row">
                <span>Total Pagado</span>
                <strong>${activeOrder.total?.toLocaleString('es-CL')}</strong>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="payment-confirmation-badge">
              <span className="mp-icon">💙</span>
              <div>
                <strong>Pagado con Mercado Pago</strong>
                <small>Comprobante digital sincronizado</small>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}