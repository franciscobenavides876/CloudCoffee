================================================================================
           SISTEMA DE VENTAS ONLINE PARA CAFETERÍAS UCT (SaaS)
================================================================================
Proyecto de Integración IV - Universidad Católica de Temuco
Documento de Perfil, Arquitectura y Requisitos (Versión Agosto 2026)

--------------------------------------------------------------------------------
1. DESCRIPCIÓN DEL PROYECTO
--------------------------------------------------------------------------------
El proyecto consiste en el diseño e implementación de una plataforma de gestión
de ventas online bajo la modalidad Software as a Service (SaaS), destinada a las 
cafeterías ubicadas en los distintos campus de la Universidad Católica de Temuco (UCT).

Permite a estudiantes, académicos y funcionarios realizar compras anticipadas a 
través de una aplicación móvil o web, comparar precios entre cafeterías dentro de un
mismo campus, y retirar sus pedidos en el punto de venta mediante la validación de 
un código QR de un solo uso.

Componentes principales:
- Panel de gestión web: Para administradores de cafeterías y cajeros (catálogo, stock,
  precios, órdenes, validación QR y proveedores).
- Plataforma de compra cliente: App web y móvil (Android / iOS) con exploración por
  campus, carrito, reserva de stock, módulo de pago y seguimiento de productos.


--------------------------------------------------------------------------------
2. PROBLEMA QUE RESUELVE
--------------------------------------------------------------------------------
- Tiempos de espera prolongados en horarios punta (recreos y cambios de bloque).
- Falta de visibilidad de precios y disponibilidad de productos por punto de venta.
- Frustración por quiebres de stock al llegar físicamente al local.
- Ausencia de mecanismos automáticos de reposición entre cafeterías y proveedores.


--------------------------------------------------------------------------------
3. ROLES DEL SISTEMA
--------------------------------------------------------------------------------
- Super Administrador: Administra el catálogo maestro, aprueba nuevas cafeterías y
  supervisa administradores.
- Administrador de Cafetería: Gestiona catálogo local (precios/stock), proveedores,
  solicitudes de reposición y cuentas de cajero asignadas a su local.
- Cajero: Visualiza pedidos entrantes y valida códigos QR en la entrega.
- Cliente Comprador: Explora por campus, compara precios, compra, recibe QR y sigue
  productos agotados.
- Proveedor (Externo): Recibe correos automáticos consolidados para reposición de stock.


--------------------------------------------------------------------------------
4. ARQUITECTURA Y MICROSERVICIOS
--------------------------------------------------------------------------------
Arquitectura basada en microservicios con persistencia independiente (Database per Service)
y comunicación híbrida (REST síncrono y eventos asíncronos con RabbitMQ).

Listado de Microservicios:
1. api-gateway:
   - Punto de entrada único (Spring Cloud Gateway).
   - Enrutamiento y validación centralizada de tokens JWT.

2. auth-service:
   - Registro y autenticación de usuarios.
   - Emisión y validación de tokens JWT (Spring Security).
   - Gestión de roles y permisos.

3. catalog-service:
   - Gestión de catálogo maestro, campus, cafeterías y ofertas locales.
   - Control de precios y stock atómico.
   - Gestión de suscripciones/seguimiento de productos y configuración de proveedores.

4. order-service:
   - Ciclo de vida completo de órdenes (pendiente, pagado, listo, entregado, etc.).
   - Reserva temporal de stock con expiración para evitar sobreventas.
   - Módulo de pago simulado (mock con ciclo de vida completo: intención, confirmación, callback).
   - Generación y validación de código QR (ZXing).
   - Control de plazos de retiro y aplicación de políticas de no reembolso.

5. notification-service:
   - Envío de correos SMTP (Spring Mail): QR de retiro, reportes diarios a proveedores,
     y alertas de cierre de local.
   - Notificaciones push móviles (Firebase Cloud Messaging - FCM) por reposición de stock.


--------------------------------------------------------------------------------
5. STACK TECNOLÓGICO
--------------------------------------------------------------------------------
- Frontend Web:        React 18
- Frontend Móvil:      React Native (Android / iOS)
- Backend:             Java 21 (LTS) + Spring Boot 4.0.1
- Gateway:             Spring Cloud Gateway
- Seguridad:           Spring Security + JJWT (JSON Web Token)
- Broker Mensajería:   RabbitMQ 3.13
- Base de Datos:       PostgreSQL 16 (Database per service)
- Notificaciones:      Firebase Cloud Messaging (FCM) & Spring Mail (SMTP)
- Procesamiento QR:    ZXing (Zebra Crossing)
- Contenedores:        Docker 26+ & Docker Compose
- Pruebas:             JUnit 5 & Mockito
- Documentación API:   SpringDoc OpenAPI (Swagger UI)
- Build Tool:          Maven
- Control de Versiones:Git & GitHub


--------------------------------------------------------------------------------
6. REGLAS DE NEGOCIO CLAVE
--------------------------------------------------------------------------------
- [RN-05/06] Catálogo Maestro: Todo producto local debe derivar de un catálogo maestro centralizado.
- [RN-11/12] Contexto de Campus: La búsqueda y comparación de precios es relativa al campus elegido.
- [RN-13]    Orden Unitaria: Una orden de compra solo puede contener ítems de una misma cafetería.
- [RN-14/18] Reserva Temporal: Al crear la orden, el stock se reserva temporalmente. Si el pago
             expira, se libera de inmediato evitando bloqueos o sobreventa.
- [RN-15/16] Código QR Seguro: QR único de un solo uso por compra, enviado al correo electrónico.
- [RN-25/27] Plazo de Retiro: Pedidos no retirados antes del cierre del día pasan a 'no retirado'
             sin derecho a reembolso (alertando 30 min antes).
- [RN-23/24] Reposición: Generación de correos diarios con aprobación previa del administrador.


--------------------------------------------------------------------------------
7. ALCANCE Y CONSIDERACIONES (NOTA TÉCNICA)
--------------------------------------------------------------------------------
- Módulo de Pago Simulado:
  Debido a requisitos comerciales de afiliación (persona jurídica, cuenta comercial) no
  aplicables en esta etapa académica, se implementa una simulación en order-service que
  emula la interfaz y flujo de Webpay Plus / Mercado Pago, permitiendo un desacople limpio
  para integración futura directa.
- Fuera de Alcance Inicial:
  No incluye delivery/despacho, facturación electrónica SII, ni soporte multi-institución.


--------------------------------------------------------------------------------
8. ESTRUCTURA RECOMENDADA DEL REPOSITORIO
--------------------------------------------------------------------------------
.
├── docker-compose.yml
├── README.txt (o README.md)
├── api-gateway/
├── auth-service/
├── catalog-service/
├── order-service/
├── notification-service/
├── frontend-web/
└── frontend-mobile/