import React, { useState, useEffect, useRef } from 'react';
import '../CSS/Super_Admin.css';

const DEFAULT_CAMPUS = [
  { id: 1, name: 'Campus San Francisco', direccion: 'Manuel Montt 056, Temuco' },
  { id: 2, name: 'Campus San Juan Pablo II', direccion: 'Rudecindo Ortega 02950, Temuco' },
  { id: 3, name: 'Campus Luis Rivas del Canto', direccion: 'Luis Rivas del Canto s/n, Temuco' },
  { id: 4, name: 'Campus Menchaca Lira', direccion: 'Alejandro Menchaca Lira 040, Temuco' }
];

const MOCK_CAFETERIAS = [
  {
    id: 101,
    nombreComercial: 'Cafetería Central',
    razonSocial: 'Servicios Gastronómicos UCT SpA',
    rut: '76.123.456-7',
    campusId: 1,
    campusName: 'Campus San Francisco',
    direccionInterna: 'Pabellón Central - Piso 1',
    horarioApertura: '08:00',
    horarioCierre: '18:30',
    correoContacto: 'central@cloudcoffee.cl',
    telefonoContacto: '+56911223344',
    cuentaPago: 'MP-ACC-99881',
    estado: 'activa',
    admins: [{ id: 'ADM-101', email: 'admin.central@admin.cloudcoffee.cl', nombre: 'Carlos Mendoza', activo: true }]
  },
  {
    id: 102,
    nombreComercial: 'Kiosko Pabellón D',
    razonSocial: 'Alimentos Campus UCT Ltda',
    rut: '77.890.123-4',
    campusId: 1,
    campusName: 'Campus San Francisco',
    direccionInterna: 'Patio Techado',
    horarioApertura: '08:30',
    horarioCierre: '17:00',
    correoContacto: 'kioskod@cloudcoffee.cl',
    telefonoContacto: '+56922334455',
    cuentaPago: 'MP-ACC-99882',
    estado: 'activa',
    admins: [{ id: 'ADM-102', email: 'admin.kioskod@admin.cloudcoffee.cl', nombre: 'Marcela Soto', activo: true }]
  },
  {
    id: 103,
    nombreComercial: 'Cafetería Biblioteca JP II',
    razonSocial: 'Coffee & Books UCT SpA',
    rut: '78.345.678-9',
    campusId: 2,
    campusName: 'Campus San Juan Pablo II',
    direccionInterna: 'Edificio Biblioteca - Nivel 2',
    horarioApertura: '08:30',
    horarioCierre: '19:00',
    correoContacto: 'biblioteca.jp2@cloudcoffee.cl',
    telefonoContacto: '+56933445566',
    cuentaPago: 'MP-ACC-99883',
    estado: 'activa',
    admins: [{ id: 'ADM-103', email: 'admin.jp2@admin.cloudcoffee.cl', nombre: 'Rodrigo Fuentes', activo: true }]
  },
  {
    id: 104,
    nombreComercial: 'Casino Luis Rivas',
    razonSocial: 'Alimentos del Sur SpA',
    rut: '79.112.233-4',
    campusId: 3,
    campusName: 'Campus Luis Rivas del Canto',
    direccionInterna: 'Sector Casino Principal',
    horarioApertura: '08:00',
    horarioCierre: '17:30',
    correoContacto: 'luisrivas@cloudcoffee.cl',
    telefonoContacto: '+56944556677',
    cuentaPago: 'MP-ACC-99884',
    estado: 'activa',
    admins: [{ id: 'ADM-104', email: 'admin.rivas@admin.cloudcoffee.cl', nombre: 'Patricia Lara', activo: true }]
  }
];

const MOCK_USUARIOS_INICIALES = [
  { id: 'USR-1', nombre: 'Ignacio Soto', email: 'ignacio.soto@uct.cl', rol: 'cliente', estado: 'activo' },
  { id: 'USR-2', nombre: 'Camila Vergara', email: 'camila.v@uct.cl', rol: 'cliente', estado: 'activo' },
  { id: 'CAJ-1', nombre: 'Matías Rivas (Caja 1)', email: 'cajero1@ca.cloudcoffee.cl', rol: 'cajero', estado: 'activo' },
  { id: 'CAJ-2', nombre: 'Sofía Muñoz (Caja 2)', email: 'cajero2@ca.cloudcoffee.cl', rol: 'cajero', estado: 'activo' },
  { id: 'ADM-101', nombre: 'Carlos Mendoza', email: 'admin.central@admin.cloudcoffee.cl', rol: 'administrador', estado: 'activo' },
  { id: 'ADM-102', nombre: 'Marcela Soto', email: 'admin.kioskod@admin.cloudcoffee.cl', rol: 'administrador', estado: 'activo' }
];

export default function SuperAdmin({ onLogout }) {
  // 'campus' | 'cafeterias' | 'catalogo' | 'admins' | 'usuarios'
  const [tab, setTab] = useState('campus');

  // --- REFS Y DRAG-TO-SCROLL ---
  const navTabsRef = useRef(null);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [tabsStartX, setTabsStartX] = useState(0);
  const [tabsScrollLeft, setTabsScrollLeft] = useState(0);

  const handleMouseDownTabs = (e) => {
    setIsDraggingTabs(true);
    setTabsStartX(e.pageX - navTabsRef.current.offsetLeft);
    setTabsScrollLeft(navTabsRef.current.scrollLeft);
  };
  const handleMouseLeaveTabs = () => setIsDraggingTabs(false);
  const handleMouseUpTabs = () => setIsDraggingTabs(false);
  const handleMouseMoveTabs = (e) => {
    if (!isDraggingTabs) return;
    e.preventDefault();
    const x = e.pageX - navTabsRef.current.offsetLeft;
    const walk = (x - tabsStartX) * 1.6;
    navTabsRef.current.scrollLeft = tabsScrollLeft - walk;
  };

  const roleFilterRef = useRef(null);
  const [isDraggingRole, setIsDraggingRole] = useState(false);
  const [roleStartX, setRoleStartX] = useState(0);
  const [roleScrollLeft, setRoleScrollLeft] = useState(0);

  const handleMouseDownRole = (e) => {
    setIsDraggingRole(true);
    setRoleStartX(e.pageX - roleFilterRef.current.offsetLeft);
    setRoleScrollLeft(roleFilterRef.current.scrollLeft);
  };
  const handleMouseLeaveRole = () => setIsDraggingRole(false);
  const handleMouseUpRole = () => setIsDraggingRole(false);
  const handleMouseMoveRole = (e) => {
    if (!isDraggingRole) return;
    e.preventDefault();
    const x = e.pageX - roleFilterRef.current.offsetLeft;
    const walk = (x - roleStartX) * 1.6;
    roleFilterRef.current.scrollLeft = roleScrollLeft - walk;
  };

  // --- 1. ESTADO DE CAMPUS (POST /catalog/campus & DELETE) ---
  const [campusList, setCampusList] = useState(() => {
    const saved = localStorage.getItem('cloudcoffee_campus');
    if (!saved) return DEFAULT_CAMPUS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CAMPUS;
    } catch {
      return DEFAULT_CAMPUS;
    }
  });

  const [campusForm, setCampusForm] = useState({
    nombre: '',
    direccion: ''
  });

  // --- 2. ESTADO DE CAFETERÍAS ---
  const [cafeterias, setCafeterias] = useState(() => {
    const saved = localStorage.getItem('cloudcoffee_cafeterias');
    if (!saved) return MOCK_CAFETERIAS;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return MOCK_CAFETERIAS;

      return parsed.map((c, index) => ({
        id: c.id || Date.now() + index,
        nombreComercial: c.nombreComercial || c.name || `Cafetería #${index + 1}`,
        razonSocial: c.razonSocial || 'Razón Social UCT',
        rut: c.rut || '76.000.000-0',
        campusId: Number(c.campusId) || 1,
        campusName: c.campusName || c.campus || 'Campus San Francisco',
        direccionInterna: c.direccionInterna || c.location || 'Pabellón Central',
        horarioApertura: c.horarioApertura || '08:00',
        horarioCierre: c.horarioCierre || '18:00',
        correoContacto: c.correoContacto || 'contacto@cloudcoffee.cl',
        telefonoContacto: c.telefonoContacto || '+56900000000',
        cuentaPago: c.cuentaPago || 'MP-DEFAULT',
        estado: c.estado || 'activa',
        admins: c.admins || []
      }));
    } catch {
      return MOCK_CAFETERIAS;
    }
  });

  // --- 3. CATEGORÍAS MAESTRAS ---
  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem('cloudcoffee_categorias');
    return saved ? JSON.parse(saved) : ['Snacks', 'Bebidas', 'Pastelería', 'Café', 'Sándwiches', 'Ensaladas', 'Postres', 'Desayunos'];
  });

  // --- 4. CATÁLOGO MAESTRO ---
  const [catalogoMaestro, setCatalogoMaestro] = useState(() => {
    const saved = localStorage.getItem('cloudcoffee_catalogo_maestro');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'Café Americano 12oz', categoria: 'Café', descripcion: 'Espresso doble tostado medio', estado: 'activo' },
      { id: 2, nombre: 'Croissant Jamón y Queso', categoria: 'Pastelería', descripcion: 'Hojaldre mantequilla horneado a diario', estado: 'activo' }
    ];
  });

  // --- 5. CUENTAS DE USUARIOS ---
  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem('cloudcoffee_usuarios_sistema');
    return saved ? JSON.parse(saved) : MOCK_USUARIOS_INICIALES;
  });

  // Sincronización continua en localStorage
  useEffect(() => {
    localStorage.setItem('cloudcoffee_campus', JSON.stringify(campusList));
  }, [campusList]);

  useEffect(() => {
    localStorage.setItem('cloudcoffee_cafeterias', JSON.stringify(cafeterias));
  }, [cafeterias]);

  useEffect(() => {
    localStorage.setItem('cloudcoffee_categorias', JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem('cloudcoffee_catalogo_maestro', JSON.stringify(catalogoMaestro));
  }, [catalogoMaestro]);

  useEffect(() => {
    localStorage.setItem('cloudcoffee_usuarios_sistema', JSON.stringify(usuarios));
  }, [usuarios]);

  // Formularios secundarios
  const [cafeForm, setCafeForm] = useState({
    nombreComercial: '',
    razonSocial: '',
    rut: '',
    campusId: campusList[0]?.id || 1,
    direccionInterna: '',
    horarioApertura: '08:00',
    horarioCierre: '18:30',
    correoContacto: '',
    telefonoContacto: '',
    cuentaPago: '',
    adminNombre: '',
    adminEmail: ''
  });

  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL');
  const [extraAdminForm, setExtraAdminForm] = useState({
    cafeteriaId: cafeterias[0]?.id || 101,
    nombre: '',
    email: ''
  });

  const [filtroRolUsuario, setFiltroRolUsuario] = useState('ALL');

  const filteredCafeteriasForAdmin = cafeterias.filter((c) => {
    if (selectedCampusFilter === 'ALL') return true;
    return Number(c.campusId) === Number(selectedCampusFilter);
  });

  useEffect(() => {
    if (filteredCafeteriasForAdmin.length > 0) {
      setExtraAdminForm((prev) => ({ ...prev, cafeteriaId: filteredCafeteriasForAdmin[0].id }));
    } else {
      setExtraAdminForm((prev) => ({ ...prev, cafeteriaId: '' }));
    }
  }, [selectedCampusFilter]);

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [productoForm, setProductoForm] = useState({
    nombre: '',
    categoria: categorias[0] || 'Café',
    descripcion: '',
    imagenUrl: ''
  });

  // --- MANEJADORES ---
  const handleCrearCampus = (e) => {
    e.preventDefault();
    if (!campusForm.nombre.trim() || !campusForm.direccion.trim()) {
      alert('Por favor ingresa el nombre y la dirección del campus (*).');
      return;
    }

    const existe = campusList.some(
      (c) => c.name.toLowerCase() === campusForm.nombre.trim().toLowerCase()
    );
    if (existe) {
      alert('Ya existe un campus registrado con ese nombre.');
      return;
    }

    const nuevoCampus = {
      id: Date.now(),
      name: campusForm.nombre.trim(),
      direccion: campusForm.direccion.trim()
    };

    setCampusList([...campusList, nuevoCampus]);
    alert(`✓ catalog-service: Campus "${nuevoCampus.name}" creado exitosamente (campusId: ${nuevoCampus.id}).`);

    setCampusForm({ nombre: '', direccion: '' });
  };

  const handleDeleteCampus = (camp) => {
    const cafeteriasAsociadas = cafeterias.filter((c) => Number(c.campusId) === Number(camp.id));
    if (cafeteriasAsociadas.length > 0) {
      alert(
        `⛔ No se puede eliminar el campus "${camp.name}":\nTiene ${cafeteriasAsociadas.length} cafetería(s) asociada(s). Debes eliminar o reasignar las cafeterías primero.`
      );
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el "${camp.name}" del sistema?`)) {
      return;
    }

    setCampusList(campusList.filter((c) => c.id !== camp.id));
    alert(`✓ Campus "${camp.name}" eliminado correctamente.`);
  };

  const handleAltaCafeteria = (e) => {
    e.preventDefault();
    if (!cafeForm.nombreComercial || !cafeForm.rut || !cafeForm.adminEmail) {
      alert('Completa los campos obligatorios (*).');
      return;
    }

    const campus = campusList.find((c) => c.id === Number(cafeForm.campusId));
    const adminId = `ADM-${Date.now()}`;

    const newCafe = {
      id: Date.now(),
      nombreComercial: cafeForm.nombreComercial.trim(),
      razonSocial: cafeForm.razonSocial.trim(),
      rut: cafeForm.rut.trim(),
      campusId: Number(cafeForm.campusId),
      campusName: campus?.name || 'Campus UCT',
      direccionInterna: cafeForm.direccionInterna.trim(),
      horarioApertura: cafeForm.horarioApertura,
      horarioCierre: cafeForm.horarioCierre,
      correoContacto: cafeForm.correoContacto.trim(),
      telefonoContacto: cafeForm.telefonoContacto.trim(),
      cuentaPago: cafeForm.cuentaPago.trim() || 'MP-DEFAULT',
      estado: 'activa',
      admins: [
        {
          id: adminId,
          email: cafeForm.adminEmail.trim(),
          nombre: cafeForm.adminNombre.trim() || 'Admin Responsable',
          activo: true
        }
      ]
    };

    setCafeterias([newCafe, ...cafeterias]);

    const nuevoAdminUser = {
      id: adminId,
      nombre: cafeForm.adminNombre.trim() || 'Admin Responsable',
      email: cafeForm.adminEmail.trim(),
      rol: 'administrador',
      estado: 'activo'
    };
    setUsuarios((prev) => [nuevoAdminUser, ...prev]);

    alert(`Cafetería creada con éxito. Correo de activación enviado a ${newCafe.admins[0].email}`);

    setCafeForm({
      nombreComercial: '',
      razonSocial: '',
      rut: '',
      campusId: campusList[0]?.id || 1,
      direccionInterna: '',
      horarioApertura: '08:00',
      horarioCierre: '18:30',
      correoContacto: '',
      telefonoContacto: '',
      cuentaPago: '',
      adminNombre: '',
      adminEmail: ''
    });
  };

  const handleAddExtraAdmin = (e) => {
    e.preventDefault();
    if (!extraAdminForm.email.trim() || !extraAdminForm.cafeteriaId) {
      alert('Por favor selecciona una cafetería e ingresa el email.');
      return;
    }

    const newAdminId = `ADM-${Date.now()}`;

    setCafeterias(
      cafeterias.map((c) => {
        if (c.id === Number(extraAdminForm.cafeteriaId)) {
          return {
            ...c,
            admins: [
              ...c.admins,
              { id: newAdminId, email: extraAdminForm.email.trim(), nombre: extraAdminForm.nombre.trim(), activo: true }
            ]
          };
        }
        return c;
      })
    );

    const extraAdminUser = {
      id: newAdminId,
      nombre: extraAdminForm.nombre.trim(),
      email: extraAdminForm.email.trim(),
      rol: 'administrador',
      estado: 'activo'
    };
    setUsuarios((prev) => [extraAdminUser, ...prev]);

    alert(`Administrador asignado. Correo de activación enviado a ${extraAdminForm.email}`);
    setExtraAdminForm((prev) => ({ ...prev, nombre: '', email: '' }));
  };

  const handleDeleteUser = (user) => {
    if (user.estado === 'eliminado') {
      alert('Esta cuenta ya ha sido eliminada y anonimizada previamente.');
      return;
    }

    if (user.rol === 'cliente') {
      const orders = JSON.parse(localStorage.getItem('cajero_orders') || '[]');
      const hasActiveOrders = orders.some(
        (o) =>
          o.email === user.email &&
          (o.status === 'pendiente' ||
            o.status === 'preparando' ||
            o.status === 'listo' ||
            o.status === 'no_retirado_revision')
      );

      if (hasActiveOrders) {
        alert(
          '⛔ Solicitud rechazada por auth-service:\nEl cliente tiene órdenes en estado pagado/listo para retiro o no retirado-pendiente de revisión.'
        );
        return;
      }
    }

    if (!window.confirm(`¿Confirmas la eliminación y anonimización de los datos de ${user.nombre}?`)) {
      return;
    }

    const updatedUsers = usuarios.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          nombre: 'Usuario Anonimizado',
          email: `anonimo_${Date.now()}@deleted.cloudcoffee.cl`,
          estado: 'eliminado'
        };
      }
      return u;
    });

    setUsuarios(updatedUsers);

    if (user.rol === 'administrador') {
      setCafeterias((prevCafes) =>
        prevCafes.map((cafe) => ({
          ...cafe,
          admins: cafe.admins.map((adm) => (adm.email === user.email ? { ...adm, activo: false } : adm))
        }))
      );
    }

    alert(`✓ Confirmación auth-service: Cuenta ${user.id} eliminada y datos personales anonimizados con éxito.`);
  };

  const handleToggleEstadoCafeteria = (cafe) => {
    const nuevoEstado = cafe.estado === 'activa' ? 'inactiva' : 'activa';

    if (nuevoEstado === 'inactiva') {
      const pendingOrders = JSON.parse(localStorage.getItem('cajero_orders') || '[]')
        .filter((o) => o.status === 'pendiente' || o.status === 'preparando' || o.status === 'listo');

      if (pendingOrders.length > 0) {
        alert('⚠️ No se puede desactivar: Existen órdenes pagadas o listas para retiro pendientes.');
        return;
      }
    }

    setCafeterias(
      cafeterias.map((c) => (c.id === cafe.id ? { ...c, estado: nuevoEstado } : c))
    );
    alert(`Cafetería ${cafe.nombreComercial} cambió su estado a: ${nuevoEstado}`);
  };

  const handleCrearCategoria = (e) => {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;
    if (categorias.includes(nuevaCategoria.trim())) {
      alert('La categoría ya existe.');
      return;
    }
    setCategorias([...categorias, nuevaCategoria.trim()]);
    setNuevaCategoria('');
  };

  const handleCrearProductoMaestro = (e) => {
    e.preventDefault();
    if (!productoForm.nombre.trim()) return;

    const newProd = {
      id: Date.now(),
      nombre: productoForm.nombre.trim(),
      categoria: productoForm.categoria,
      descripcion: productoForm.descripcion.trim(),
      imagenUrl: productoForm.imagenUrl.trim(),
      estado: 'activo'
    };

    setCatalogoMaestro([newProd, ...catalogoMaestro]);
    alert(`Producto "${newProd.nombre}" añadido a la categoría ${newProd.categoria}.`);

    setProductoForm({
      nombre: '',
      categoria: categorias[0] || 'Café',
      descripcion: '',
      imagenUrl: ''
    });
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtroRolUsuario === 'ALL') return true;
    return u.rol === filtroRolUsuario;
  });

  return (
    <div className="mobile-wrapper">
      <div className="screen-container superadmin-mobile-container">

        {/* Header Superior */}
        <header className="mobile-top-bar superadmin-topbar">
          <div className="superadmin-brand">
            <span className="brand-badge">SuperAdmin</span>
            <h2>Panel de Control</h2>
          </div>
          <button type="button" className="btn-logout" onClick={onLogout}>
            Salir ⎋
          </button>
        </header>

        {/* Pestañas Principales */}
        <nav
          className={`superadmin-nav-tabs ${isDraggingTabs ? 'grabbing' : ''}`}
          ref={navTabsRef}
          onMouseDown={handleMouseDownTabs}
          onMouseLeave={handleMouseLeaveTabs}
          onMouseUp={handleMouseUpTabs}
          onMouseMove={handleMouseMoveTabs}
        >
          <button
            type="button"
            className={`sa-tab-btn ${tab === 'campus' ? 'active' : ''}`}
            onClick={() => setTab('campus')}
          >
            🏛️ Campus
          </button>
          <button
            type="button"
            className={`sa-tab-btn ${tab === 'cafeterias' ? 'active' : ''}`}
            onClick={() => setTab('cafeterias')}
          >
            🏢 Locales
          </button>
          <button
            type="button"
            className={`sa-tab-btn ${tab === 'catalogo' ? 'active' : ''}`}
            onClick={() => setTab('catalogo')}
          >
            📦 Catálogo
          </button>
          <button
            type="button"
            className={`sa-tab-btn ${tab === 'admins' ? 'active' : ''}`}
            onClick={() => setTab('admins')}
          >
            👥 Admins
          </button>
          <button
            type="button"
            className={`sa-tab-btn ${tab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setTab('usuarios')}
          >
            🗑️ Cuentas
          </button>
        </nav>

        {/* Contenido Scrollable */}
        <div className="superadmin-mobile-content">

          {/* PESTAÑA: AGREGAR Y GESTIONAR CAMPUS */}
          {tab === 'campus' && (
            <div className="sa-section-stack">
              <section className="superadmin-card">
                <h2>Agregar Campus</h2>
                <p className="sa-helper-text">
                  El alta de un campus es un paso previo obligatorio para crear cafeterías, ya que cada local requiere un campusId existente.
                </p>

                <form onSubmit={handleCrearCampus} className="superadmin-form">
                  <div className="form-group">
                    <label>Nombre del Campus *</label>
                    <input
                      type="text"
                      placeholder="Ej: Campus San Francisco, Campus Norte..."
                      value={campusForm.nombre}
                      onChange={(e) => setCampusForm({ ...campusForm, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dirección del Campus *</label>
                    <input
                      type="text"
                      placeholder="Ej: Manuel Montt 056, Temuco"
                      value={campusForm.direccion}
                      onChange={(e) => setCampusForm({ ...campusForm, direccion: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-super">
                    Añadir
                  </button>
                </form>
              </section>

              <section className="superadmin-card">
                <h2>Campus Registrados</h2>
                <div className="sa-card-list">
                  {campusList.map((camp) => {
                    const cantCafes = cafeterias.filter((c) => Number(c.campusId) === Number(camp.id)).length;
                    return (
                      <div key={camp.id} className="sa-item-box">
                        <div className="sa-item-info">
                          <div className="sa-item-header">
                            <strong>{camp.name}</strong>
                          </div>
                          <small>📍 {camp.direccion}</small>
                          <small>☕ {cantCafes} cafeterías en este campus</small>
                        </div>
                        
                        <button
                          type="button"
                          className="btn-delete-account"
                          onClick={() => handleDeleteCampus(camp)}
                          title="Eliminar campus"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* PESTAÑA: CAFETERÍAS */}
          {tab === 'cafeterias' && (
            <div className="sa-section-stack">
              <section className="superadmin-card">
                <h2>Añadir Cafeteria</h2>
                <form onSubmit={handleAltaCafeteria} className="superadmin-form">
                  <div className="form-group">
                    <label>Nombre Comercial *</label>
                    <input
                      type="text"
                      placeholder="Ej: Cafetería Central"
                      value={cafeForm.nombreComercial}
                      onChange={(e) => setCafeForm({ ...cafeForm, nombreComercial: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Razón Social *</label>
                      <input
                        type="text"
                        placeholder="Ej: SpA / Alimentos UCT"
                        value={cafeForm.razonSocial}
                        onChange={(e) => setCafeForm({ ...cafeForm, razonSocial: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>RUT *</label>
                      <input
                        type="text"
                        placeholder="76.xxx.xxx-x"
                        value={cafeForm.rut}
                        onChange={(e) => setCafeForm({ ...cafeForm, rut: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Campus *</label>
                    <select
                      value={cafeForm.campusId}
                      onChange={(e) => setCafeForm({ ...cafeForm, campusId: e.target.value })}
                    >
                      {campusList.map((camp) => (
                        <option key={camp.id} value={camp.id}>{camp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Dirección Interna *</label>
                    <input
                      type="text"
                      placeholder="Ej: Pabellón Central - Piso 1"
                      value={cafeForm.direccionInterna}
                      onChange={(e) => setCafeForm({ ...cafeForm, direccionInterna: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Apertura</label>
                      <input
                        type="time"
                        value={cafeForm.horarioApertura}
                        onChange={(e) => setCafeForm({ ...cafeForm, horarioApertura: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Cierre</label>
                      <input
                        type="time"
                        value={cafeForm.horarioCierre}
                        onChange={(e) => setCafeForm({ ...cafeForm, horarioCierre: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Admin: Correo Activación *</label>
                    <input
                      type="email"
                      placeholder="admin.central@admin.cloudcoffee.cl"
                      value={cafeForm.adminEmail}
                      onChange={(e) => setCafeForm({ ...cafeForm, adminEmail: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-super">
                    Añadir
                  </button>
                </form>
              </section>

              <section className="superadmin-card">
                <h2>Cafeterías Registradas</h2>
                <div className="sa-card-list">
                  {cafeterias.map((c) => (
                    <div key={c.id} className={`sa-item-box ${c.estado}`}>
                      <div className="sa-item-info">
                        <div className="sa-item-header">
                          <strong>{c.nombreComercial}</strong>
                          <span className={`sa-badge-status ${c.estado}`}>{c.estado}</span>
                        </div>
                        <small>📍 {c.campusName} — {c.direccionInterna}</small>
                        <small>⏰ {c.horarioApertura} a {c.horarioCierre} | RUT: {c.rut}</small>
                        <small>👤 {c.admins?.length} administradores asignados</small>
                      </div>

                      <button
                        type="button"
                        className={`btn-sa-toggle ${c.estado === 'activa' ? 'btn-warn' : 'btn-success'}`}
                        onClick={() => handleToggleEstadoCafeteria(c)}
                      >
                        {c.estado === 'activa' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PESTAÑA: CATÁLOGO */}
          {tab === 'catalogo' && (
            <div className="sa-section-stack">
              <section className="superadmin-card">
                <h2>Añadir Categorias</h2>
                <form onSubmit={handleCrearCategoria} className="sa-inline-form">
                  <input
                    type="text"
                    placeholder="Nueva categoría (ej: Ensaladas)"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                  />
                  <button type="submit" className="btn-primary-super">Añadir</button>
                </form>

                <div className="sa-categories-grid">
                  {categorias.map((cat, i) => (
                    <span key={i} className="sa-cat-chip">
                      {cat}
                      <button
                        type="button"
                        className="btn-remove-cat"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la categoría "${cat}" del catálogo?`)) {
                            setCategorias(categorias.filter((c) => c !== cat));
                          }
                        }}
                        title="Eliminar categoría"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </section>

              <section className="superadmin-card">
                <h2>Añadir producto a categoria</h2>
                <form onSubmit={handleCrearProductoMaestro} className="superadmin-form">
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      placeholder="Ej: Muffin Arándano 120g"
                      value={productoForm.nombre}
                      onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Categoría Maestra *</label>
                    <select
                      value={productoForm.categoria}
                      onChange={(e) => setProductoForm({ ...productoForm, categoria: e.target.value })}
                    >
                      {categorias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Descripción Base</label>
                    <input
                      type="text"
                      placeholder="Descripción para el catálogo global..."
                      value={productoForm.descripcion}
                      onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary-super">
                    Añadir
                  </button>
                </form>

                <div className="sa-card-list" style={{ marginTop: '0.8rem' }}>
                  {catalogoMaestro.map((p) => (
                    <div key={p.id} className="sa-item-box">
                      <div className="sa-item-info">
                        <strong>{p.nombre}</strong>
                        <span className="sa-cat-chip" style={{ fontSize: '0.66rem', padding: '0.15rem 0.45rem' }}>
                          {p.categoria}
                        </span>
                        <small>{p.descripcion}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PESTAÑA: ADMINISTRADORES */}
          {tab === 'admins' && (
            <div className="sa-section-stack">
              <section className="superadmin-card">
                <h2>Agregar Administrador</h2>
                <p className="sa-helper-text">
                  Selecciona el campus para filtrar las cafeterías y asignar administradores.
                </p>

                <form onSubmit={handleAddExtraAdmin} className="superadmin-form">
                  <div className="form-group">
                    <label>Filtrar por Campus</label>
                    <select
                      value={selectedCampusFilter}
                      onChange={(e) => setSelectedCampusFilter(e.target.value)}
                    >
                      <option value="ALL">🏢 Todos los Campus</option>
                      {campusList.map((camp) => (
                        <option key={camp.id} value={camp.id}>📍 {camp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cafetería Destino *</label>
                    {filteredCafeteriasForAdmin.length === 0 ? (
                      <div className="sa-no-cafes-alert">
                        No hay cafeterías registradas en este campus.
                      </div>
                    ) : (
                      <select
                        value={extraAdminForm.cafeteriaId}
                        onChange={(e) => setExtraAdminForm({ ...extraAdminForm, cafeteriaId: e.target.value })}
                        required
                      >
                        {filteredCafeteriasForAdmin.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombreComercial}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Nombre del Administrador *</label>
                    <input
                      type="text"
                      placeholder="Ej: Marcela Soto"
                      value={extraAdminForm.nombre}
                      onChange={(e) => setExtraAdminForm({ ...extraAdminForm, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="ejemplo@admin.cloudcoffee.cl"
                      value={extraAdminForm.email}
                      onChange={(e) => setExtraAdminForm({ ...extraAdminForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary-super"
                    disabled={filteredCafeteriasForAdmin.length === 0}
                  >
                    Añadir
                  </button>
                </form>
              </section>
            </div>
          )}

          {/* PESTAÑA: GESTIÓN DE CUENTAS */}
          {tab === 'usuarios' && (
            <div className="sa-section-stack">
              <section className="superadmin-card">
                <h2>Eliminar Cuentas del Sistema</h2>
                <p className="sa-helper-text">
                  Mantén presionado y arrastra para filtrar por tipo de cuenta:
                </p>

                <div
                  className={`sa-role-filter-bar ${isDraggingRole ? 'grabbing' : ''}`}
                  ref={roleFilterRef}
                  onMouseDown={handleMouseDownRole}
                  onMouseLeave={handleMouseLeaveRole}
                  onMouseUp={handleMouseUpRole}
                  onMouseMove={handleMouseMoveRole}
                >
                  <button
                    type="button"
                    className={`sa-role-filter-btn ${filtroRolUsuario === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFiltroRolUsuario('ALL')}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    className={`sa-role-filter-btn ${filtroRolUsuario === 'cliente' ? 'active' : ''}`}
                    onClick={() => setFiltroRolUsuario('cliente')}
                  >
                    👤 Clientes
                  </button>
                  <button
                    type="button"
                    className={`sa-role-filter-btn ${filtroRolUsuario === 'cajero' ? 'active' : ''}`}
                    onClick={() => setFiltroRolUsuario('cajero')}
                  >
                    📟 Cajeros
                  </button>
                  <button
                    type="button"
                    className={`sa-role-filter-btn ${filtroRolUsuario === 'administrador' ? 'active' : ''}`}
                    onClick={() => setFiltroRolUsuario('administrador')}
                  >
                    🏢 Administradores
                  </button>
                </div>

                <div className="sa-card-list">
                  {usuariosFiltrados.length === 0 ? (
                    <p className="empty-text">No hay cuentas con el rol seleccionado.</p>
                  ) : (
                    usuariosFiltrados.map((user) => (
                      <div key={user.id} className={`sa-item-box ${user.estado === 'eliminado' ? 'inactiva' : ''}`}>
                        <div className="sa-item-info">
                          <div className="sa-item-header">
                            <strong>{user.nombre}</strong>
                            <span className={`sa-badge-role role-${user.rol}`}>{user.rol}</span>
                          </div>
                          <small>✉️ {user.email}</small>
                          <small>🆔 {user.id} • Estado: <strong>{user.estado}</strong></small>
                        </div>

                        {user.estado !== 'eliminado' ? (
                          <button
                            type="button"
                            className="btn-delete-account"
                            onClick={() => handleDeleteUser(user)}
                            title="DELETE /auth/users/{id}"
                          >
                            🗑️ Eliminar
                          </button>
                        ) : (
                          <span className="sa-anon-tag">Anonimizada ✓</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}