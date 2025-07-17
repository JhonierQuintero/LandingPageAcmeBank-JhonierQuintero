# AcmeBank – Plataforma Web de Autogestión Bancaria

**AcmeBank** es una aplicación web desarrollada con HTML, CSS y JavaScript que permite a los usuarios gestionar sus cuentas bancarias en línea de forma segura y rápida. La plataforma incluye funcionalidades clave como autenticación, creación de cuentas, recuperación de contraseñas, movimientos financieros y generación de reportes bancarios.

## 🚀 Funcionalidades Principales

### 🔐 Autenticación
- Inicio de sesión con tipo y número de identificación y contraseña.
- Validación de credenciales y mensajes de error claros.
- Redirección automática al dashboard tras login exitoso.

### 📝 Registro de Cuenta
- Formulario de registro con validación en tiempo real.
- Captura de información personal y de contacto.
- Asignación automática de número de cuenta y fecha de apertura.
- Resumen de cuenta y acceso directo al login.

### 🔑 Recuperación de Contraseña
- Verificación mediante tipo de identificación, número y correo electrónico.
- Asignación de nueva contraseña si los datos coinciden.
- Validaciones completas y mensajes visuales.

### 🖥️ Dashboard Interactivo
Panel principal que incluye:
- Resumen de cuenta (número, saldo actual, fecha de creación).
- Menú lateral con las siguientes opciones:

#### 📄 Resumen de Transacciones
- Muestra las 10 transacciones más recientes.
- Incluye fecha, referencia, tipo, descripción y valor.
- Botón para imprimir resumen.

#### 💳 Consignación Electrónica
- Formulario para ingresar una cantidad a consignar.
- Actualización del saldo y registro de la transacción.
- Generación de resumen imprimible.

#### 💸 Retiro de Dinero
- Permite ingresar una cantidad a retirar.
- Disminuye el saldo y registra la transacción.
- Muestra un resumen imprimible.

#### 🧾 Pago de Servicios Públicos
- Selección de tipo de servicio (Energía, Agua, Gas Natural, Internet).
- Registro de referencia y valor a pagar.
- Actualización de saldo y movimiento.
- Resumen detallado e imprimible.

#### 📆 Extracto Bancario
- Permite seleccionar un año y mes.
- Muestra todos los movimientos en el período seleccionado.

#### 📜 Certificado Bancario
- Genera un certificado que acredita la existencia de la cuenta.
- Muestra número de cuenta y fecha de creación.
- Formato imprimible.

#### 🚪 Cerrar Sesión
- Finaliza sesión y redirige a la pantalla de login.

## 💾 Persistencia de Datos

- Uso de `localStorage` para mantener persistencia entre sesiones.
- Datos estructurados en formato JSON para cuentas, usuarios y transacciones.

## 🎨 Diseño y Usabilidad

- Diseño responsivo compatible con móviles, tablets y escritorios.
- Tipografías modernas desde Google Fonts.
- Paleta de colores profesional: azul, blanco y tonos grises.
- Validaciones y retroalimentación visual clara en todos los formularios.

## 📁 Estructura del Proyecto

ProyectoAcmebank/
│
├── html/
│ ├── login.html
│ ├── registro.html
│ ├── recuperacion.html
│ └── dashboard.html
│
├── css/
│ ├── login.css
│ ├── registro.css
│ ├── recuperacion.css
│ └── dashboard.css
│
├── js/
│ ├── login.js
│ ├── registro.js
│ ├── recuperacion.js
│ └── dashboard.js
│
├── README.md
└── .gitignore


## ▶️ Cómo Ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JhonierQuintero/LandingPageAcmeBank-JhonierQuintero.git

Abre el archivo html/login.html en tu navegador o utiliza una extensión como Live Server desde VS Code.

✉️ Contacto
Para dudas o sugerencias, puedes contactar a el desarrollador mediante GitHub.

### Autor

-Jhonier Quintero software developer