# Sistema de inventario

Aplicación web multiempresa para administrar categorías, proveedores, productos, existencias y movimientos de inventario. Cada cuenta corresponde a una empresa con su inventario completamente aislado. El proyecto está dividido en un frontend construido con React + TypeScript y Vite, un backend construido con Node.js + Express y una base de datos MySQL.

## Contenido

- [Características](#características)
- [Interfaz y mensajes](#interfaz-y-mensajes)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Uso de la aplicación](#uso-de-la-aplicación)
- [Base de datos](#base-de-datos)
- [API REST](#api-rest)
- [Rutas del frontend](#rutas-del-frontend)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Problemas frecuentes](#problemas-frecuentes)
- [Scripts disponibles](#scripts-disponibles)

## Características

- Registro público de cuentas: usuario, nombre de empresa y contraseña.
- Inicio de sesión con usuario y contraseña.
- Cada cuenta/empresa tiene su propio inventario: categorías, proveedores, productos y movimientos aislados.
- Sin roles: todas las cuentas tienen los mismos permisos sobre su propio inventario.
- Contraseñas almacenadas con `bcrypt` y validadas con `zxcvbn`.
- Tokens JWT con duración de una hora, verificados en el backend mediante middleware.
- Cuenta:
  - Cambiar el nombre de usuario y el nombre de la empresa (con verificación de contraseña actual implícita en la sesión y token nuevo tras el cambio).
  - Cambiar la contraseña exigiendo la contraseña actual.
  - Eliminar la cuenta exigiendo la contraseña; borra en cascada todo el inventario de la empresa.
- Administración de categorías: crear, listar, editar y eliminar (elimina también sus productos).
- Administración de proveedores: crear, listar, editar y eliminar (elimina también sus productos). El proveedor predeterminado "SIN PROVEEDOR" está protegido.
- Administración de productos: crear con cantidad y descripción, filtrar por categoría, proveedor y cantidad máxima, editar y eliminar.
- Registro de movimientos de entrada y salida con actualización automática del stock.
- Filtrado de movimientos por tipo, categoría, producto, código y rango de fechas.
- Alertas visuales en el frontend mediante SweetAlert2, con mensajes de error consistentes.
- Interfaz en español e inglés, con botón para cambiar el idioma y preferencia guardada en el navegador.

## Interfaz y mensajes

- La interfaz usa una paleta monocromática de grises con acento azul suave (`--color-accent`); las acciones para editar conservan su acento azul y las de eliminar su acento rojo. Tipografía de sistema (`system-ui`, Segoe UI, Roboto) y tarjetas con radios y sombras amplios.
- La página de bienvenida es un héroe a dos columnas: titular y textos a la izquierda, composición ilustrativa (icono grande de `lucide-react` sobre formas flotantes) a la derecha, botones de crear cuenta e iniciar sesión en fila y una franja de tres tarjetas de características.
- Tras autenticarse se accede al panel (`/panel`), con saludo y botón de cerrar sesión a la derecha de la cabecera y una rejilla de tarjetas con icono y descripción por sección (Productos, Categorías, Proveedores, Movimientos y una tarjeta destacada de Mi cuenta). Cada sección tiene su propia pantalla; la pantalla de cuenta muestra una tarjeta de identidad con el monograma de la empresa y las acciones en fila.
- El fondo de la bienvenida y del panel lleva una malla 3D animada (efecto NET de Vanta sobre three.js) con la paleta del tema; el resto de la página usa un degradado radial fijo en `body`. Si el sistema pide movimiento reducido, Vanta no se monta y solo queda el degradado.
- Los formularios muestran sus campos en dos columnas cuando hay espacio y se adaptan a una columna en pantallas estrechas. Sus botones van en fila.
- Al abrir un formulario, el fondo se atenúa y desenfoca mientras el formulario permanece nítido; los formularios flotantes entran y salen animados con `motion` (`AnimatePresence`).
- Las pantallas, filas, tarjetas y controles tienen animaciones de entrada y hover definidas con `motion` y con `@keyframes` en `frontend/src/styles/styles.css`. Se respeta la preferencia del sistema por reducir el movimiento (`MotionConfig reducedMotion="user"` y consulta `prefers-reduced-motion`).
- Un botón fijo en la esquina inferior derecha alterna entre el tema claro y el oscuro. La preferencia se guarda en `localStorage` con la clave `inventario-theme`.
- Junto al botón de tema hay un botón de idioma que alterna entre español e inglés y muestra `ES` o `EN` según el idioma activo.
- El idioma predeterminado es español y la selección se guarda en `localStorage` con la clave `inventario-language`.
- El sistema de traducciones vive en `frontend/src/i18n.tsx`. El texto visible se envuelve con la función `t()` del hook `useTranslation`, y las alertas usan `translateText`. Las claves se escriben en español; si una clave no tiene traducción, se muestra el texto original.
- Los errores de la API se devuelven en la propiedad `error`, con mensajes breves en español y sin detalles internos de la base de datos. Las operaciones exitosas que devuelven confirmación usan `message`.

## Arquitectura

```text
Navegador
   |
   | React + TypeScript + Vite (http://localhost:4000)
   | Authorization: Bearer <JWT>
   | HTTP / JSON
   v
API Express (http://localhost:3000)
   | middleware auth: verifica el JWT y fija req.user.idusers
   |
   | mysql2
   v
MySQL - base de datos inventary
```

- El frontend guarda el JWT en `localStorage` con la clave `token` y lo adjunta a todas las llamadas mediante el helper `frontend/src/api.ts` (`apiFetch`). Si el backend responde `401`, se cierra la sesión y se vuelve a la bienvenida.
- El backend expone las rutas directamente desde `/`; no se utiliza un prefijo como `/api`.
- Todas las operaciones de inventario se filtran por `req.user.idusers`: una cuenta solo puede ver o modificar su propio inventario.

## Tecnologías

### Frontend

- React `19`.
- TypeScript `6`.
- Vite `8`.
- React Router.
- SweetAlert2 para mostrar mensajes.
- `lucide-react` para los iconos de la interfaz.
- `motion` para las animaciones de entrada, salida y hover.
- `vanta` con `three` para el fondo 3D animado de la bienvenida y el panel (carga diferida).
- ESLint para validación de estilo y errores comunes.

### Backend

- Node.js.
- Express `4`.
- MySQL mediante `mysql2`.
- `bcrypt` para hash de contraseñas.
- `jsonwebtoken` para autenticación.
- `zxcvbn` para validar la fortaleza de contraseñas.
- `cors`, `cookie-parser`, `morgan` y `dotenv`.

## Requisitos previos

Antes de instalar el proyecto se necesita:

- Node.js y npm instalados.
- MySQL Server en ejecución.
- Un cliente de MySQL, por ejemplo MySQL Workbench o el cliente `mysql`.
- Dos terminales para ejecutar frontend y backend al mismo tiempo.

Las versiones exactas de las dependencias se encuentran en:

- `backend/package.json`
- `frontend/package.json`

## Instalación

Desde la carpeta raíz del proyecto:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Después, configura MySQL siguiendo la sección [Base de datos](#base-de-datos) y crea el archivo de variables de entorno del backend siguiendo la sección [Configuración](#configuración).

## Configuración

### Variables del backend

El backend carga el secreto JWT desde `backend/secretKey.env` mediante `dotenv`:

```env
JWT_SECRET=coloca_aqui_un_secreto_largo_y_aleatorio
```

El archivo está incluido en `.gitignore`. No debe subirse al repositorio ni compartirse públicamente.

### Conexión MySQL

La conexión actual está definida en `backend/db/db.js` y utiliza estos valores por defecto:

| Parámetro     | Valor actual                         |
| ------------- | ------------------------------------ |
| Host          | `localhost`                          |
| Usuario       | `root`                               |
| Contraseña    | La configurada en `backend/db/db.js` |
| Base de datos | `inventary`                          |
| Zona horaria  | `local`                              |

Lo recomendable es migrar host, usuario, contraseña y nombre de base de datos a variables de entorno y evitar dejar credenciales reales escritas directamente en el código.

### URLs y puertos

- Backend: `http://localhost:3000`.
- Frontend: `http://localhost:4000`.
- CORS del backend: permite actualmente `http://localhost:4000`.

Si se cambia el puerto del frontend, también debe actualizarse el origen permitido en `backend/app.js` y la constante `API_URL` de `frontend/src/api.ts`.

## Ejecución

### Backend

En una terminal:

```bash
cd backend
npm start
```

El servidor escucha en el puerto `3000`, sal que el entorno defina `PORT`.

### Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:4000
```

Para generar la versión de producción:

```bash
cd frontend
npm run build
npm run preview
```

## Uso de la aplicación

1. Inicia MySQL.
2. Inicia el backend en el puerto `3000`.
3. Inicia el frontend en el puerto `4000`.
4. Abre `http://localhost:4000`: se muestra la página de bienvenida.
5. Crea una cuenta con "Crear una cuenta" (usuario, nombre de empresa y contraseña) o inicia sesión con una existente. Ambas acciones abren un formulario flotante.
6. Tras autenticarse accedes al panel, con un botón por sección: Productos, Categorías, Proveedores, Movimientos y Mi cuenta.
7. Cada sección es una pantalla propia con su cabecera y su botón de creación ("Nuevo producto +", "Nueva categoria +", "Nuevo proveedor +"); se vuelve al panel con el botón "atrás" del navegador.
8. En la pantalla Mi cuenta puedes cambiar tu usuario y el nombre de la empresa, cambiar tu contraseña (pide la actual), eliminar tu cuenta (pide la contraseña y borra todo el inventario) o cerrar sesión. También puedes cerrar sesión desde el panel.

Al volver atrás en el historial del navegador desde cualquier pantalla hacia la bienvenida se pide confirmación antes de cerrar la sesión; las vueltas atrás dentro del panel navegan normalmente sin preguntar. El token solo se elimina al confirmar el cierre, al eliminar la cuenta, ante un `401` del backend o automáticamente a los 20 minutos de inactividad, momento en el que se muestra un aviso al usuario.

## Base de datos

La aplicación espera una base de datos MySQL llamada `inventary` con cinco tablas. Cada tabla de inventario lleva una columna `idusers` que identifica a la empresa propietaria:

```text
users       1 ---- N categories
users       1 ---- N providers
users       1 ---- N products
users       1 ---- N movements
categories  1 ---- N products
providers   1 ---- N products
```

El esquema consolidado del proyecto está disponible en [`database/schema.sql`](database/schema.sql). Este archivo crea la base de datos y las cinco tablas, y elimina y recrea las tablas si ya existen: ejecútalo solo cuando quieras empezar de cero.

### Tablas esperadas

#### `users`

| Columna       | Uso                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `idusers`     | Identificador o nombre de usuario (PK). Se consulta de forma sensible a mayúsculas y minúsculas con `BINARY`.        |
| `company_name`| Nombre de la empresa propietaria del inventario.                                                                    |
| `password`    | Hash generado con `bcrypt`.                                                                                         |

No existe la columna `rol`: todas las cuentas tienen los mismos permisos sobre su propio inventario.

#### `categories`

| Columna       | Uso                                                             |
| ------------- | --------------------------------------------------------------- |
| `idcategoria` | Identificador de la categoría.                                  |
| `idusers`     | Empresa propietaria (FK a `users`, con `ON UPDATE/DELETE CASCADE`). |
| `category`    | Nombre de la categoría; único por empresa.                      |

#### `providers`

| Columna         | Uso                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `idprovider`    | Identificador del proveedor.                                        |
| `idusers`       | Empresa propietaria (nullable solo para la centinela global).        |
| `provider_name` | Nombre del proveedor; único por empresa.                            |
| `contact`       | Número de contacto del proveedor.                                   |

La fila `idprovider = 0` ("SIN PROVEEDOR", `idusers NULL`) es una centinela global que usan los productos sin proveedor; al listar por empresa nunca aparece y no se puede editar ni eliminar.

#### `products`

| Columna        | Uso                                                                              |
| -------------- | -------------------------------------------------------------------------------- |
| `idproducts`   | Identificador del producto.                                                      |
| `idusers`      | Empresa propietaria (FK con cascade).                                            |
| `product_code` | Código único por empresa.                                                        |
| `product_name` | Nombre único por empresa.                                                        |
| `amount`       | Cantidad disponible en inventario.                                               |
| `description`  | Descripción opcional; el esquema usa `SIN DESCRIPCION` por defecto.              |
| `idcategoria`  | Referencia a `categories.idcategoria` (cascade al eliminar la categoría).        |
| `idprovider`   | Referencia a `providers.idprovider`; `0` representa la centinela predeterminada. |

#### `movements`

| Columna         | Uso                                                                   |
| --------------- | --------------------------------------------------------------------- |
| `idmovements`   | Identificador del movimiento.                                         |
| `idusers`       | Empresa propietaria (FK con cascade).                                 |
| `movement_type` | Tipo de movimiento: `entrada` o `salida`.                             |
| `date_movement` | Fecha del movimiento. El esquema la define como `DATE`.               |
| `amount`        | Cantidad movida.                                                      |
| `category`      | Categoría registrada en el movimiento (copia histórica).              |
| `product_name`  | Producto afectado (copia histórica).                                  |
| `product_code`  | Código del producto en ese momento.                                   |

### Reglas de inventario

- Un producto requiere una categoría existente de la misma empresa.
- `amount` representa el stock actual del producto.
- Una `entrada` incrementa el stock; una `salida` lo disminuye.
- No se permite una salida mayor que el stock disponible.
- Al eliminar una categoría o un proveedor, el backend elimina primero los productos asociados y después el registro.
- Al renombrar el usuario de una cuenta, las claves foráneas con `ON UPDATE CASCADE` arrastran el inventario e historial al nuevo identificador.
- Al eliminar una cuenta se eliminan sus movimientos, productos, proveedores, categorías y finalmente la cuenta.

## API REST

Todas las respuestas usan JSON. La URL base local es:

```text
http://localhost:3000
```

Salvo `/register` y `/logIn`, todos los endpoints exigen el header:

```text
Authorization: Bearer <token>
```

y operan siempre sobre el inventario de la cuenta autenticada. Cuando una solicitud falla, la API responde con un objeto JSON que contiene `error`. Las operaciones exitosas de escritura pueden incluir `message`; las consultas de listas devuelven arreglos.

### Autenticación y cuenta

#### `POST /register`

Crea una cuenta/empresa e inicia sesión automáticamente. La contraseña debe alcanzar el nivel mínimo aceptado por `zxcvbn`.

```json
{
  "idusers": "usuario1",
  "companyName": "Ferretería Central",
  "password": "UnaContraseñaSegura"
}
```

Respuesta exitosa:

```json
{
  "message": "Cuenta creada correctamente.",
  "token": "eyJ...",
  "companyName": "Ferretería Central"
}
```

#### `POST /logIn`

Inicia sesión y devuelve un JWT válido durante una hora.

```json
{
  "idusers": "usuario1",
  "password": "UnaContraseñaSegura"
}
```

Respuesta exitosa:

```json
{
  "message": "Inicio de sesión exitoso.",
  "token": "eyJ...",
  "companyName": "Ferretería Central"
}
```

#### `GET /accountInfo`

Devuelve el usuario y el nombre de empresa de la cuenta autenticada.

```json
{
  "idusers": "usuario1",
  "companyName": "Ferretería Central"
}
```

#### `PUT /updateAccount`

Cambia el nombre de usuario, el nombre de la empresa o ambos. Devuelva un token nuevo porque el usuario puede haber cambiado.

```json
{
  "newIdusers": "usuario1",
  "companyName": "Ferretería Central 2"
}
```

Al menos uno de los dos campos es obligatorio.

#### `POST /changePassword`

Cambia la contraseña de la cuenta autenticada y exige la contraseña actual.

```json
{
  "currentPassword": "ContraseñaActual",
  "newPassword": "NuevaContraseñaSegura",
  "confirmPassword": "NuevaContraseñaSegura"
}
```

#### `DELETE /deleteAccount`

Elimina la cuenta autenticada y todo su inventario. Exige la contraseña.

```json
{
  "password": "UnaContraseñaSegura"
}
```

### Categorías

#### `GET /listCategories`

Devuelve las categorías de la empresa autenticada.

#### `POST /newCategory`

```json
{
  "categoryName": "Papelería"
}
```

#### `PUT /updateCategory`

```json
{
  "idcategoria": 1,
  "categoryName": "Papelería"
}
```

#### `DELETE /deleteCategory/:categoryName`

Elimina una categoría de la empresa y los productos asociados a ella.

### Proveedores

#### `GET /listProviders`

Devuelve los proveedores de la empresa (sin incluir la centinela predeterminada).

#### `POST /newProvider`

```json
{
  "provider_name": "Distribuidora Central",
  "contact": 555123456
}
```

#### `PUT /updateProvider`

```json
{
  "idprovider": 1,
  "provider_name": "Distribuidora Central",
  "contact": 555123456
}
```

El proveedor predeterminado (`idprovider = 0`) no se puede editar.

#### `DELETE /deleteProvider/:provider_name`

Elimina un proveedor de la empresa y los productos asociados. El proveedor predeterminado no se puede eliminar.

### Productos

#### `GET /filterProducts`

Lista los productos de la empresa y permite aplicar filtros opcionales:

```text
GET /filterProducts?categoryName=Papelería&provider_name=Distribuidora%20Central&amount=10
```

Parámetros:

- `product_code`
- `categoryName`
- `provider_name`
- `amount`: devuelve productos cuya cantidad sea menor o igual al valor indicado.

#### `POST /newProduct`

`product_code`, `product_name`, `categoryName` y `provider_name` son obligatorios; `amount` y `description` son opcionales. La categoría y el proveedor deben pertenecer a la empresa.

```json
{
  "product_code": "PAP-001",
  "product_name": "Cuaderno",
  "amount": 25,
  "description": "Cuaderno de 100 hojas",
  "categoryName": "Papelería",
  "provider_name": "Distribuidora Central"
}
```

#### `PUT /updateProduct`

Mismos campos que `newProduct` más `idproducts`.

#### `DELETE /deleteProduct/:product_name`

Elimina un producto de la empresa por nombre.

### Movimientos

#### `POST /newMovement`

Registra una entrada o salida, actualiza el stock y guarda el movimiento. El usuario que registra el movimiento se toma del token.

```json
{
  "type": "entrada",
  "amount": 10,
  "category_name": "Papelería",
  "product_name": "Cuaderno"
}
```

Valores válidos de `type`: `entrada` y `salida`. Para una salida, la cantidad no puede superar el stock disponible.

#### `GET /filterMovements`

Lista los movimientos de la empresa ordenados del más reciente al más antiguo. Todos los parámetros son opcionales:

```text
GET /filterMovements?type=salida&category_name=Papelería&product_name=Cuaderno&product_code=PAP-001&initDate=2026-01-01&finalDate=2026-12-31
```

## Rutas del frontend

| Ruta         | Acceso  | Pantalla                                                     |
| ------------ | ------- | ------------------------------------------------------------ |
| `/`          | Público | Bienvenida: crear cuenta o iniciar sesión                    |
| `/panel`     | Sesión  | Panel principal con acceso a cada sección                    |
| `/products`  | Sesión  | Administrador de productos                                   |
| `/categories`| Sesión  | Administrador de categorías                                  |
| `/providers` | Sesión  | Administrador de proveedores                                 |
| `/movements` | Sesión  | Administrador de movimientos                                 |
| `/account`   | Sesión  | Mi cuenta: usuario, empresa, contraseña y eliminación        |
| `*`          | Público | Redirige a la bienvenida                                     |

## Estructura del proyecto

```text
inventario/
├── backend/
│   ├── app.js                  # Configuración de Express, JSON, CORS y rutas
│   ├── package.json            # Dependencias y script de arranque
│   ├── secretKey.env           # Secreto JWT local, excluido de Git
│   ├── bin/www                  # Servidor HTTP y puerto
│   ├── db/db.js                # Conexión MySQL
│   ├── middleware/auth.js      # Verificación del JWT y req.user.idusers
│   ├── controllers/            # Controladores de cuenta, categorías, productos y movimientos
│   └── routes/routes.js        # Registro de endpoints (auth en casi todos)
├── frontend/
│   ├── package.json            # Dependencias y scripts de Vite
│   ├── vite.config.ts          # Puerto 4000 y plugin React
│   └── src/
│       ├── App.tsx             # Router, guardia de navegación y botones de tema e idioma
│       ├── api.ts              # apiFetch: adjunta el JWT y maneja el 401
│       ├── main.tsx            # Punto de entrada React
│       ├── i18n.tsx            # Traducciones (es/en), proveedor e hook de idioma
│       ├── welcome/            # Bienvenida: héroe, tarjetas y formularios de registro e inicio de sesión
│       ├── panel/              # Pantallas del panel (productos, categorías, proveedores, movimientos, cuenta) y sus formularios
│       ├── visual/             # Fondo animado Vanta (three.js, importación diferida)
│       ├── ruteProtection/      # Protección de rutas en el cliente
│       ├── session/            # Cierre de sesión y temporizador de inactividad
│       ├── alerts/             # Alertas de interfaz
│       └── styles/             # Estilos globales
├── database/
│   └── schema.sql              # Esquema SQL multiempresa
├── .gitignore
└── README.md
```

## Seguridad

- El middleware `backend/middleware/auth.js` valida el JWT en todos los endpoints salvo `/register` y `/logIn`.
- Cada consulta de inventario filtra por `req.user.idusers`; los identificadores que llegan en la petición (producto, categoría, proveedor) se contrastan siempre con la cuenta autenticada.
- Los cambios de cuenta y la eliminación exigen la contraseña actual.
- Antes de usar el sistema en producción se recomienda además:
  - Cambiar el secreto JWT por uno largo, aleatorio y exclusivo del entorno.
  - No versionar `backend/secretKey.env` ni credenciales de MySQL.
  - Mover host, usuario, contraseña y nombre de base de datos a variables de entorno.
  - Usar HTTPS.
  - Usar transacciones para actualizar el stock y registrar el movimiento como una operación atómica.
  - Configurar CORS con una lista de orígenes permitidos por entorno.
  - Rotar las credenciales si alguna contraseña o secreto ya fue expuesto.

## Problemas frecuentes

### El frontend no puede conectarse al backend

Comprueba que:

1. El backend esté ejecutándose en `http://localhost:3000`.
2. El frontend esté ejecutándose en `http://localhost:4000`.
3. MySQL esté iniciado.
4. La base de datos `inventary` exista con el esquema de `database/schema.sql`.
5. El origen del frontend coincida con la configuración CORS de `backend/app.js`.

### La aplicación vuelve sola a la página de bienvenida

El backend respondió `401`: la sesión no es válida o el token caducó (duración de una hora). Inicia sesión de nuevo.

### El usuario no puede iniciar sesión

Verifica que la cuenta exista (el registro es público desde la bienvenida), que la contraseña se haya almacenado mediante `bcrypt` y que `backend/secretKey.env` contenga `JWT_SECRET`.

### Error de conexión con MySQL

Revisa las credenciales en `backend/db/db.js`, el nombre `inventary`, el puerto de MySQL y que el servidor acepte conexiones locales.

## Scripts disponibles

### Backend

```bash
npm start
```

Inicia el servidor Express.

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev`: inicia Vite en modo desarrollo.
- `build`: ejecuta TypeScript y genera la compilación de producción.
- `lint`: ejecuta ESLint.
- `preview`: sirve localmente la compilación generada.

## Estado del proyecto

El proyecto está preparado para desarrollo local. Para un entorno productivo todavía deben completarse, como mínimo, la gestión de secretos por entorno, el manejo transaccional de movimientos y una estrategia de despliegue con HTTPS.
