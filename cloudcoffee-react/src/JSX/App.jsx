import React, { useState } from 'react';
import '../CSS/App.css';
import InicioSesion from './Inicio_Sesion';
import RegistroSesion from './Registro_Sesion';
import OlvidasteContraseña from './Olvidaste_Contraseña';
import ConsumidorMain from './Consumidor_Main';
import Campus from './Campus';
import Carrito from './Carrito';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio' | 'login' | 'registro' | 'reset' | 'consumidor' | 'campus' | 'carrito'
  const [campusSeleccionado, setCampusSeleccionado] = useState(
    localStorage.getItem('selected_campus_name') || 'Campus San Francisco'
  );

  if (vistaActual === 'login') {
    return (
      <InicioSesion 
        onBack={() => setVistaActual('inicio')}
        onNavigateToRegister={() => setVistaActual('registro')}
        onNavigateToReset={() => setVistaActual('reset')}
        onLoginSuccess={() => setVistaActual('consumidor')}
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
        onCheckoutSuccess={() => setVistaActual('consumidor')}
      />
    );
  }

  if (vistaActual === 'consumidor') {
    return (
      <ConsumidorMain 
        currentCampus={campusSeleccionado}
        onNavigateToCampus={() => setVistaActual('campus')}
        onNavigateToCart={() => setVistaActual('carrito')}
      />
    );
  }

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
              Regístrate hoy de forma gratuita y empieza a disfrutar tu café a tiempo.
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