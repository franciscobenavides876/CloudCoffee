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
  // Vistas disponibles: 'inicio' | 'login' | 'registro' | 'reset' | 'consumidor' | 'campus' | 'carrito' | 'mis_pedidos' | 'perfil' | 'admin' | 'cajero'
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

  // 1. Login
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

  // 2. Cajero
  if (vistaActual === 'cajero') {
    return (
      <CajeroMain 
        onLogout={handleLogout}
        currentCafeName="Cafetería Central"
      />
    );
  }

  // 3. SuperAdmin
  if (vistaActual === 'admin') {
    return (
      <SuperAdmin 
        onLogout={handleLogout}
      />
    );
  }

  // 4. Consumidor (Home)
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

  // 5. Mi Perfil
  if (vistaActual === 'perfil') {
    return (
      <MiPerfil
        onBack={() => setVistaActual('consumidor')}
        onLogout={handleLogout}
      />
    );
  }

  // 6. Selección de Campus
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

  // 7. Carrito
  if (vistaActual === 'carrito') {
    return (
      <Carrito 
        onBack={() => setVistaActual('consumidor')}
        onCheckoutSuccess={() => setVistaActual('mis_pedidos')}
        onGoToOrders={() => setVistaActual('mis_pedidos')}
      />
    );
  }

  // 8. Mis Pedidos (QR de Retiro)
  if (vistaActual === 'mis_pedidos') {
    return (
      <MiPedido 
        onBack={() => setVistaActual('consumidor')}
      />
    );
  }

  // 9. Registro
  if (vistaActual === 'registro') {
    return (
      <RegistroSesion 
        onBack={() => setVistaActual('inicio')}
        onNavigateToLogin={() => setVistaActual('login')}
      />
    );
  }

  // 10. Recuperar Contraseña
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
        <div className="petroleum-background" />
        <div className="thin-circle tc-1" />
        <div className="thin-circle tc-2" />
        <div className="thin-circle tc-3" />

        <img 
          src={process.env.PUBLIC_URL + '/Imagenes/Portada.png'} 
          alt="Loro CloudCoffee" 
          className="foreground-image"
        />

        <div className="content">
          <header className="header-section">
            <h1 className="title">
              <span className="highlight-text">CloudCoffee</span>
            </h1>
            <p className="subtitle">
              Mejora tu experiencia en los campus de la Universidad Católica de Temuco.
            </p>
          </header>

          <div className="actions-section">
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={() => setVistaActual('registro')}
            >
              Registrarme Gratis
            </button>
            <button 
              className="btn btn-secondary" 
              type="button" 
              onClick={() => setVistaActual('login')}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}