import React, { useState } from 'react';
import '../CSS/App.css';
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

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [campusSeleccionado, setCampusSeleccionado] = useState(
    localStorage.getItem('selected_campus_name') || 'Campus San Francisco'
  );

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

  if (vistaActual === 'consumidor') {
    return (
      <ConsumidorMain 
        currentCampus={campusSeleccionado}
        onNavigateToCampus={() => setVistaActual('campus')}
        onNavigateToCart={() => setVistaActual('carrito')}
        onNavigateToOrders={() => setVistaActual('mis_pedidos')}
        onNavigateToProfile={() => setVistaActual('perfil')}
      />
    );
  }

  if (vistaActual === 'perfil') {
    return (
      <MiPerfil
        onBack={() => setVistaActual('consumidor')}
        onLogout={handleLogout}
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
        onCheckoutSuccess={() => setVistaActual('mis_pedidos')}
        onGoToOrders={() => setVistaActual('mis_pedidos')}
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

  if (vistaActual === 'registro') {
    return (
      <RegistroSesion 
        onBack={() => setVistaActual('inicio')}
        onNavigateToLogin={() => setVistaActual('login')}
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

  // Portada Inicial
  return (
    <div className="mobile-wrapper">
      <div className="screen-container">
        
        {/* Cabecera Título CloudCoffee */}
        <header className="brand-header-centered">
          <h1 className="title" style={{ color: '#0284C7' }}>CloudCoffee</h1>
        </header>

        {/* Zona de Imagen */}
        <div className="image-wrapper">
          <img 
            src={process.env.PUBLIC_URL + '/Imagenes/Portada.png'} 
            alt="CloudCoffee Ilustración" 
            className="foreground-image"
          />
        </div>

        {/* Panel Inferior */}
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