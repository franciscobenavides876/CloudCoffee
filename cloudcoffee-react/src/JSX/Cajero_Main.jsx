import React, { useState, useEffect } from 'react';
import '../CSS/Cajero_Main.css';

export default function CajeroMain({ onLogout, currentCafeName = 'Cafetería Central' }) {
  // 'pedidos' | 'inventario' | 'no_retirados'
  const [activeTab, setActiveTab] = useState('pedidos');

  // --- FILTRO Y BÚSQUEDA EN PESTAÑA PEDIDOS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('todos'); // 'todos' | 'pagado' | 'listo'

  // --- FILTRO Y BÚSQUEDA EN PESTAÑA INVENTARIO / STOCK ---
  const [searchInventoryQuery, setSearchInventoryQuery] = useState('');
  const [categoryInventoryFilter, setCategoryInventoryFilter] = useState('todos');

  // --- 3.2.3 ESTADO DE ÓRDENES ACTIVAS ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('cajero_orders');
    return savedOrders
      ? JSON.parse(savedOrders)
      : [
          {
            id: 'PED-101',
            folio: 'CC-9801',
            hashQR: 'hash_sha256_mock_101',
            cliente: 'Ignacio Soto',
            email: 'ignacio.soto@uct.cl',
            hora: '10:15 AM',
            cafeName: 'Cafetería Central',
            items: [
              { ordenItemId: 'ITM-101-1', name: 'Café Americano 12oz', qty: 1, price: 1800, ofertaId: 1 },
              { ordenItemId: 'ITM-101-2', name: 'Croissant Jamón y Queso', qty: 1, price: 2500, ofertaId: 2 }
            ],
            total: 4300,
            status: 'listo' // 'pagado' | 'listo' | 'entregado' | 'no_retirado_revision'
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
              { ordenItemId: 'ITM-102-1', name: 'Jugo Natural Naranja 300ml', qty: 2, price: 2000, ofertaId: 4 }
            ],
            total: 4000,
            status: 'pagado'
          }
        ];
  });

  // --- 3.2.5 INVENTARIO Y CONTROL DE STOCK ---
  const [inventory, setInventory] = useState(() => {
    const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    return savedProducts.length > 0
      ? savedProducts
      : [
          {
            id: 1,
            name: 'Café Americano 12oz',
            category: 'Café',
            offers: [{ cafeName: currentCafeName, stock: 15, inStock: true, price: 1800 }]
          },
          {
            id: 2,
            name: 'Croissant Jamón y Queso',
            category: 'Pastelería',
            offers: [{ cafeName: currentCafeName, stock: 8, inStock: true, price: 2500 }]
          },
          {
            id: 3,
            name: 'Sándwich Ave Palta',
            category: 'Sándwiches',
            offers: [{ cafeName: currentCafeName, stock: 0, inStock: false, price: 3200 }]
          },
          {
            id: 4,
            name: 'Jugo Natural Naranja 300ml',
            category: 'Bebidas',
            offers: [{ cafeName: currentCafeName, stock: 12, inStock: true, price: 2000 }]
          }
        ];
  });

  // --- 3.2.6 ÓRDENES NO RETIRADAS PENDIENTES DE REVISIÓN ---
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedFechaNoRetirados, setSelectedFechaNoRetirados] = useState(todayDateStr);

  const [noRetiradosList, setNoRetiradosList] = useState(() => {
    const saved = localStorage.getItem('cajero_no_retirados');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'PED-099',
            folio: 'CC-9780',
            cliente: 'Diego Morales',
            fecha: todayDateStr,
            cafeName: 'Cafetería Central',
            items: [
              { ordenItemId: 'NR-1', name: 'Muffin Chocolate', qty: 2, ofertaId: 2, accion: null },
              { ordenItemId: 'NR-2', name: 'Bebida Coca-Cola 350ml', qty: 1, ofertaId: 4, accion: null }
            ]
          }
        ];
  });

  // --- 3.2.4 VALIDACIÓN QR Y FOLIO ---
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [manualFolioInput, setManualFolioInput] = useState('');
  const [modalDetalleEntrega, setModalDetalleEntrega] = useState(null);

  // Sincronización continua
  useEffect(() => {
    localStorage.setItem('cajero_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('cajero_no_retirados', JSON.stringify(noRetiradosList));
  }, [noRetiradosList]);

  // Validar QR (POST /orders/qr/validar)
  const handleValidarQR = (orderToValidate) => {
    if (!orderToValidate) {
      alert('⚠️ Código QR inválido o no reconocido.');
      return;
    }

    if (orderToValidate.status === 'entregado') {
      alert('⚠️ Este código QR ya fue utilizado anteriormente.');
      return;
    }

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderToValidate.id ? { ...ord, status: 'entregado', qrUsado: true } : ord
      )
    );

    setShowQRScanner(false);
    setModalDetalleEntrega(orderToValidate);
  };

  const handleBuscarPorFolio = (e) => {
    e.preventDefault();
    if (!manualFolioInput.trim()) return;

    const encontrada = orders.find(
      (o) =>
        o.folio.toLowerCase() === manualFolioInput.trim().toLowerCase() ||
        o.id.toLowerCase() === manualFolioInput.trim().toLowerCase()
    );

    if (encontrada) {
      handleValidarQR(encontrada);
      setManualFolioInput('');
    } else {
      alert(`No se encontró ninguna orden con el código/folio: ${manualFolioInput}`);
    }
  };

  // Actualizar Stock (PATCH /catalog/ofertas/{id})
  const handleUpdateStockUnits = (productId, delta) => {
    const updated = inventory.map((prod) => {
      if (prod.id === productId) {
        const updatedOffers = prod.offers.map((off) => {
          const currentStock = off.stock ?? (off.inStock ? 10 : 0);
          const newStock = Math.max(0, currentStock + delta);
          return {
            ...off,
            stock: newStock,
            inStock: newStock > 0
          };
        });
        return { ...prod, offers: updatedOffers };
      }
      return prod;
    });

    setInventory(updated);
  };

  // Gestión de No Retirados
  const handleSetItemAction = (ordenId, ordenItemId, accion) => {
    setNoRetiradosList((prev) =>
      prev.map((ord) => {
        if (ord.id === ordenId) {
          const updatedItems = ord.items.map((it) =>
            it.ordenItemId === ordenItemId ? { ...it, accion } : it
          );
          return { ...ord, items: updatedItems };
        }
        return ord;
      })
    );
  };

  const handleResolverOrdenNoRetirada = (orden) => {
    const faltan = orden.items.some((it) => !it.accion);
    if (faltan) {
      alert('Debes seleccionar una acción (Reingresar o Descartar) para cada ítem antes de confirmar.');
      return;
    }

    orden.items.forEach((it) => {
      if (it.accion === 'reingresar') {
        setInventory((prevInv) =>
          prevInv.map((prod) => {
            if (prod.id === it.ofertaId) {
              const updatedOffers = prod.offers.map((off) => ({
                ...off,
                stock: (off.stock || 0) + it.qty,
                inStock: true
              }));
              return { ...prod, offers: updatedOffers };
            }
            return prod;
          })
        );
      }
    });

    setNoRetiradosList((prev) => prev.filter((o) => o.id !== orden.id));
    alert(`✓ POST /orders/${orden.id}/no-retirado/revisar: Orden procesada y stock sincronizado.`);
  };

  // --- FILTROS CALCULADOS DE PEDIDOS ---
  const activeOrders = orders.filter((o) => o.status !== 'entregado');

  const filteredOrders = activeOrders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'todos' || o.status === orderStatusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.cliente.toLowerCase().includes(q) ||
      o.folio.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  // --- FILTROS CALCULADOS DE STOCK ---
  const availableCategories = ['todos', ...Array.from(new Set(inventory.map((p) => p.category).filter(Boolean)))];

  const filteredInventory = inventory.filter((prod) => {
    const matchesCategory =
      categoryInventoryFilter === 'todos' || prod.category === categoryInventoryFilter;
    const q = searchInventoryQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      (prod.category && prod.category.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const noRetiradosFiltrados = noRetiradosList.filter((o) => o.fecha === selectedFechaNoRetirados);

  return (
    <div className="mobile-wrapper">
      <div className="screen-container cajero-mobile-container">
        
        {/* Header Superior Móvil */}
        <header className="mobile-top-bar cajero-header">
          <div className="cajero-brand-info">
            <span className="cajero-role-pill">POS Cajero</span>
            <h2>{currentCafeName}</h2>
          </div>
          <button type="button" className="btn-cajero-logout" onClick={onLogout}>
            Salir ⎋
          </button>
        </header>

        {/* Pestañas de Navegación con Notificación de Pelotita Roja */}
        <nav className="cajero-mobile-tabs">
          <button
            type="button"
            className={`cajero-m-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            <span>📋 Pedidos</span>
            {activeOrders.length > 0 && <span className="notification-dot" />}
          </button>

          <button
            type="button"
            className={`cajero-m-tab ${activeTab === 'inventario' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventario')}
          >
            <span>📦 Stock</span>
          </button>

          <button
            type="button"
            className={`cajero-m-tab ${activeTab === 'no_retirados' ? 'active' : ''}`}
            onClick={() => setActiveTab('no_retirados')}
          >
            <span>⚠️ No Retirados</span>
            {noRetiradosList.length > 0 && <span className="notification-dot warning" />}
          </button>
        </nav>

        {/* Contenido Scrollable */}
        <div className="cajero-mobile-content">
          
          {/* PESTAÑA 1: PEDIDOS ENTRANTES Y RETIRO */}
          {activeTab === 'pedidos' && (
            <div className="cajero-orders-stack">
              
              <div className="cajero-qr-actions-card">
                <button
                  type="button"
                  className="btn-open-scanner"
                  onClick={() => setShowQRScanner(true)}
                >
                  📷 Escanear Código QR
                </button>

                <form onSubmit={handleBuscarPorFolio} className="cajero-folio-search-form">
                  <input
                    type="text"
                    placeholder="O buscar folio corto (ej: CC-9801)"
                    value={manualFolioInput}
                    onChange={(e) => setManualFolioInput(e.target.value)}
                  />
                  <button type="submit" className="btn-search-folio">Validar</button>
                </form>
              </div>

              {/* BARRA DE BÚSQUEDA Y FILTRO DE CATEGORÍAS/ESTADO DE PEDIDOS */}
              <div className="cajero-filter-controls">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="cajero-filter-input"
                    placeholder="🔍 Buscar cliente, folio o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="status-filter-chips">
                  <button
                    type="button"
                    className={`chip-filter ${orderStatusFilter === 'todos' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter('todos')}
                  >
                    Todos ({activeOrders.length})
                  </button>
                  <button
                    type="button"
                    className={`chip-filter ${orderStatusFilter === 'pagado' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter('pagado')}
                  >
                    🔵 Pagados ({activeOrders.filter((o) => o.status === 'pagado').length})
                  </button>
                  <button
                    type="button"
                    className={`chip-filter ${orderStatusFilter === 'listo' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter('listo')}
                  >
                    🟢 Listos ({activeOrders.filter((o) => o.status === 'listo').length})
                  </button>
                </div>
              </div>

              <div className="cajero-orders-list">
                {filteredOrders.length === 0 ? (
                  <div className="mobile-empty-state">
                    <p>
                      {activeOrders.length === 0
                        ? `No hay pedidos pendientes para entrega en ${currentCafeName}.`
                        : 'No se encontraron pedidos con el filtro actual.'}
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="mobile-order-card">
                      <div className="m-order-header">
                        <div>
                          <strong>{order.id}</strong>
                          <span className="m-order-folio">Folio: {order.folio}</span>
                          <small className="m-order-time"> • {order.hora}</small>
                        </div>
                        <span className={`m-status-badge ${order.status}`}>
                          {order.status === 'pagado' && '🔵 Pagado'}
                          {order.status === 'listo' && '🟢 Listo para Retiro'}
                        </span>
                      </div>

                      <div className="m-order-client">
                        <span className="m-client-name">👤 {order.cliente}</span>
                        <small>{order.email}</small>
                      </div>

                      <div className="m-order-items">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="m-item-row">
                            <span>{it.qty}x {it.name}</span>
                            <strong>${(it.price * it.qty).toLocaleString('es-CL')}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="m-order-footer">
                        <span>Total Pagado:</span>
                        <strong>${order.total.toLocaleString('es-CL')}</strong>
                      </div>

                      <div className="m-order-actions">
                        {order.status === 'pagado' && (
                          <button
                            type="button"
                            className="btn-m-action btn-m-ready"
                            onClick={() =>
                              setOrders((prev) =>
                                prev.map((o) => (o.id === order.id ? { ...o, status: 'listo' } : o))
                              )
                            }
                          >
                            🔔 Marcar Listo para Retiro
                          </button>
                        )}

                        {order.status === 'listo' && (
                          <button
                            type="button"
                            className="btn-m-action btn-m-deliver"
                            onClick={() => handleValidarQR(order)}
                          >
                            ✓ Simular Escaneo y Entregar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PESTAÑA 2: ACTUALIZAR STOCK DE OFERTAS */}
          {activeTab === 'inventario' && (
            <div className="cajero-inventory-stack">
              <div className="sa-helper-text">
                3.2.5: Como cajero puedes aumentar o reducir las unidades en stock. Los precios y estados base están reservados al administrador.
              </div>

              {/* BARRA DE BÚSQUEDA Y FILTRO DE CATEGORÍAS DE STOCK */}
              <div className="cajero-filter-controls">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="cajero-filter-input"
                    placeholder="🔍 Buscar producto en stock..."
                    value={searchInventoryQuery}
                    onChange={(e) => setSearchInventoryQuery(e.target.value)}
                  />
                  {searchInventoryQuery && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setSearchInventoryQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="status-filter-chips">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`chip-filter ${categoryInventoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setCategoryInventoryFilter(cat)}
                    >
                      {cat === 'todos' ? `Todos (${inventory.length})` : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cajero-inventory-list">
                {filteredInventory.length === 0 ? (
                  <div className="mobile-empty-state">
                    <p>No se encontraron productos que coincidan con la búsqueda.</p>
                  </div>
                ) : (
                  filteredInventory.map((prod) => {
                    const offer = prod.offers?.[0] || { stock: 0, inStock: false, price: 0 };
                    const currentStock = offer.stock ?? (offer.inStock ? 10 : 0);

                    return (
                      <div key={prod.id} className="mobile-stock-item">
                        <div className="m-stock-info">
                          <strong>{prod.name}</strong>
                          <span className="m-stock-category">{prod.category}</span>
                          <small>Precio: ${offer.price?.toLocaleString('es-CL')}</small>
                        </div>

                        <div className="m-stock-stepper">
                          <button
                            type="button"
                            className="btn-stepper"
                            onClick={() => handleUpdateStockUnits(prod.id, -1)}
                            disabled={currentStock <= 0}
                          >
                            -
                          </button>
                          <span className={`stock-counter-badge ${currentStock === 0 ? 'out' : ''}`}>
                            {currentStock} un.
                          </span>
                          <button
                            type="button"
                            className="btn-stepper"
                            onClick={() => handleUpdateStockUnits(prod.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* PESTAÑA 3: PRODUCTOS NO RETIRADOS POR ÍTEM */}
          {activeTab === 'no_retirados' && (
            <div className="cajero-no-retirados-stack">
              <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                <label>Consultar por Fecha (America/Santiago)</label>
                <input
                  type="date"
                  value={selectedFechaNoRetirados}
                  onChange={(e) => setSelectedFechaNoRetirados(e.target.value)}
                />
              </div>

              <div className="cajero-no-retirados-list">
                {noRetiradosFiltrados.length === 0 ? (
                  <div className="mobile-empty-state">
                    <p>No hay órdenes no retiradas pendientes para la fecha seleccionada.</p>
                  </div>
                ) : (
                  noRetiradosFiltrados.map((ord) => (
                    <div key={ord.id} className="mobile-order-card nr-card">
                      <div className="m-order-header">
                        <strong>{ord.id} ({ord.folio})</strong>
                        <span className="sa-badge-status inactiva">No Retirado</span>
                      </div>
                      <small>👤 Cliente: {ord.cliente} • Fecha: {ord.fecha}</small>

                      <div className="nr-items-container">
                        <p className="nr-instruction">Decide la acción individual para cada ítem:</p>
                        {ord.items.map((it) => (
                          <div key={it.ordenItemId} className="nr-item-row">
                            <div className="nr-item-meta">
                              <strong>{it.qty}x {it.name}</strong>
                            </div>

                            <div className="nr-item-buttons">
                              <button
                                type="button"
                                className={`btn-nr-action ${it.accion === 'reingresar' ? 'selected-reingresar' : ''}`}
                                onClick={() => handleSetItemAction(ord.id, it.ordenItemId, 'reingresar')}
                              >
                                ♻️ Reingresar Stock
                              </button>
                              <button
                                type="button"
                                className={`btn-nr-action ${it.accion === 'descartar' ? 'selected-descartar' : ''}`}
                                onClick={() => handleSetItemAction(ord.id, it.ordenItemId, 'descartar')}
                              >
                                🗑️ Descartar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn-primary-super"
                        style={{ marginTop: '0.6rem' }}
                        onClick={() => handleResolverOrdenNoRetirada(ord)}
                      >
                        ✓ Confirmar Revisión de Orden
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL SIMULADOR QR */}
        {showQRScanner && (
          <div className="cajero-modal-overlay">
            <div className="cajero-modal-box">
              <h3>📷 Escanear QR de Cliente</h3>
              <p className="sa-helper-text">
                Simulador de lectura: Selecciona la orden que está presentando el cliente en el punto de retiro:
              </p>

              <div className="qr-sim-list">
                {activeOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    className="btn-sim-qr-entry"
                    onClick={() => handleValidarQR(ord)}
                  >
                    <div>
                      <strong>{ord.id}</strong> — {ord.cliente}
                    </div>
                    <small>Folio: {ord.folio} • {ord.items.length} ítems</small>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowQRScanner(false)}
              >
                Cerrar Escáner
              </button>
            </div>
          </div>
        )}

        {/* MODAL DETALLE DE ENTREGA */}
        {modalDetalleEntrega && (
          <div className="cajero-modal-overlay">
            <div className="cajero-modal-box delivery-box">
              <div className="delivery-icon-check">✓</div>
              <h3>QR Validado Correctamente</h3>
              <p className="delivery-subtitle">
                Entrega físicamente los siguientes productos al cliente:
              </p>

              <div className="delivery-order-meta">
                <strong>Orden: {modalDetalleEntrega.id}</strong>
                <span>Cliente: {modalDetalleEntrega.cliente}</span>
              </div>

              <div className="delivery-items-checklist">
                {modalDetalleEntrega.items.map((it, idx) => (
                  <div key={idx} className="delivery-item-pill">
                    <span className="delivery-qty">{it.qty}x</span>
                    <span className="delivery-name">{it.name}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-accept-delivery"
                onClick={() => setModalDetalleEntrega(null)}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}