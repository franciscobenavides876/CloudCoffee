import React, { useState } from 'react';
import '../CSS/App.css';
import '../CSS/Complementarias.css';

// Pantallas principales
import InicioSesion from './Inicio_Sesion';
import RegistroSesion from './Registro_Sesion';
import OlvidasteContraseña from './Olvidaste_Contraseña';
import ConsumidorMain from './Consumidor_Main';
import Campus from './Campus';
import Carrito from './Carrito';
import MiPedido from './Mi_Pedido';
import MiPerfil from './Mi_Perfil';
import SuperAdmin from './Super_Admin';
import CajeroMain from './Cajero_Main';

// Pantallas complementarias (Punto 5)
import DetalleProducto from './Detalle_Producto';
import ResultadoPago from './Resultado_Pago';
import VerificarCorreo from './Verificar_Correo';
import CambiarContraseña from './Cambiar_Contraseña';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [campusSeleccionado, setCampusSeleccionado] = useState(
    localStorage.getItem('selected_campus_name') || 'Campus San Francisco'
  );

  // Estados de datos contextuales para navegación fluida
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  const handleLoginSuccess = (userData) => {
    if (userData?.isCajero) {
      setVistaActual('cajero');
    } else if (userData?.isAdmin) {
      setVistaActual('admin');
    } else {
      setVistaActual('consumidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setVistaActual('inicio');
  };

  // Función para agregar al carrito desde el detalle extendido
  const handleAddToCartFromDetail = (product, offer, quantity) => {
    const savedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const existingIndex = savedCart.findIndex(
      (item) => item.id === product.id && item.cafeId === offer.cafeId
    );

    if (existingIndex > -1) {
      savedCart[existingIndex].quantity += quantity;
    } else {
      savedCart.push({
        id: product.id,
        name: product.name,
        price: offer.price,
        cafeId: offer.cafeId,
        cafeName: offer.cafeName,
        quantity: quantity
      });
    }

    localStorage.setItem('cart_items', JSON.stringify(savedCart));
    alert(`✓ ${quantity}x "${product.name}" agregado(s) al carrito.`);
    setVistaActual('carrito');
  };

  // --- 1. FLUJOS DE AUTENTICACIÓN Y REGISTRO ---
  if (vistaActual === 'login') {
    return (
      <InicioSesion 
        onBack={() => setVistaActual('inicio')}
        onNavigateToRegister={() => setVistaActual('registro')}
        onNavigateToReset={() => setVistaActual('reset')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (vistaActual === 'registro') {
    return (
      <RegistroSesion 
        onBack={() => setVistaActual('inicio')}
        onNavigateToLogin={() => setVistaActual('login')}
        onRegistrationSuccess={(email) => {
          setPendingVerificationEmail(email);
          setVistaActual('verificar_correo');
        }}
      />
    );
  }

  if (vistaActual === 'verificar_correo') {
    return (
      <VerificarCorreo 
        email={pendingVerificationEmail}
        onVerifySuccess={() => setVistaActual('login')}
      />
    );
  }

  if (vistaActual === 'reset') {
    return (
      <OlvidasteContraseña 
        onBack={() => setVistaActual('login')}
        onNavigateToLogin={() => setVistaActual('login')}
      />
    );
  }

  // --- 2. ROLES DE CAJERO Y SUPERADMIN ---
  if (vistaActual === 'cajero') {
    return (
      <CajeroMain 
        onLogout={handleLogout}
        currentCafeName="Cafetería Central"
      />
    );
  }

  if (vistaActual === 'admin') {
    return (
      <SuperAdmin 
        onLogout={handleLogout}
      />
    );
  }

  // --- 3. FLUJO DE CONSUMIDOR Y CATÁLOGO ---
  if (vistaActual === 'consumidor') {
    return (
      <ConsumidorMain 
        currentCampus={campusSeleccionado}
        onNavigateToCampus={() => setVistaActual('campus')}
        onNavigateToCart={() => setVistaActual('carrito')}
        onNavigateToOrders={() => setVistaActual('mis_pedidos')}
        onNavigateToProfile={() => setVistaActual('perfil')}
        onSelectProductDetail={(product) => {
          setProductoDetalle(product);
          setVistaActual('detalle_producto');
        }}
      />
    );
  }

  if (vistaActual === 'detalle_producto') {
    return (
      <DetalleProducto 
        product={productoDetalle}
        onBack={() => setVistaActual('consumidor')}
        onAddToCart={handleAddToCartFromDetail}
      />
    );
  }

  if (vistaActual === 'campus') {
    return (
      <Campus 
        onBack={() => setVistaActual('consumidor')}
        onSelectCampus={(nombre) => {
          setCampusSeleccionado(nombre);
          setVistaActual('consumidor');
        }}
      />
    );
  }

  if (vistaActual === 'carrito') {
    return (
      <Carrito 
        onBack={() => setVistaActual('consumidor')}
        onCheckoutSuccess={(orderInfo) => {
          setLastCompletedOrder(orderInfo || { folio: 'CC-9805', total: 4300 });
          setVistaActual('resultado_pago');
        }}
        onGoToOrders={() => setVistaActual('mis_pedidos')}
      />
    );
  }

  if (vistaActual === 'resultado_pago') {
    return (
      <ResultadoPago 
        orderData={lastCompletedOrder}
        onGoToOrders={() => setVistaActual('mis_pedidos')}
        onGoToHome={() => setVistaActual('consumidor')}
      />
    );
  }

  if (vistaActual === 'mis_pedidos') {
    return (
      <MiPedido 
        onBack={() => setVistaActual('consumidor')}
      />
    );
  }

  // --- 4. PERFIL Y SEGURIDAD AUTENTICADA ---
  if (vistaActual === 'perfil') {
    return (
      <MiPerfil
        onBack={() => setVistaActual('consumidor')}
        onLogout={handleLogout}
        onNavigateToChangePassword={() => setVistaActual('cambiar_password')}
      />
    );
  }

  if (vistaActual === 'cambiar_password') {
    return (
      <CambiarContraseña 
        onBack={() => setVistaActual('perfil')}
        onSuccess={() => setVistaActual('perfil')}
      />
    );
  }

  // --- 5. PORTADA INICIAL ---
  return (
    <div className="mobile-wrapper">
      <div className="screen-container">
        
        <header className="brand-header-centered">
          <h1 className="title" style={{ color: '#0284C7' }}>CloudCoffee</h1>
        </header>

        <div className="image-wrapper">
          <img 
            src={process.env.PUBLIC_URL + '/Imagenes/Portada.png'} 
            alt="CloudCoffee Ilustración" 
            className="foreground-image"
          />
        </div>

        <div className="content">
          <p className="subtitle">
            Pide tu café y snacks con anticipación para retirar sin esperas en el campus.
          </p>

          <div className="actions-section">
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={() => setVistaActual('registro')}
            >
              Crear cuenta
            </button>
            <button 
              className="btn btn-secondary" 
              type="button" 
              onClick={() => setVistaActual('login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}