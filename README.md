# Sistema de inventario

Aplicación web para administrar usuarios, categorías, productos, existencias y movimientos de inventario. El proyecto está dividido en un frontend construido con React + TypeScript y Vite, un backend construido con Node.js + Express y una base de datos MySQL.

## Contenido

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Uso de la aplicación](#uso-de-la-aplicación)
- [Base de datos](#base-de-datos)
- [API REST](#api-rest)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Problemas frecuentes](#problemas-frecuentes)
- [Scripts disponibles](#scripts-disponibles)

## Características

- Inicio de sesión con usuario y contraseña.
- Contraseñas almacenadas con `bcrypt`.
- Tokens JWT con duración de una hora.
- Separación de permisos por rol: `admin` y `regular`.
- Administración de usuarios:
  - Crear usuarios.
  - Filtrar usuarios por rol.
  - Cambiar contraseñas.
  - Eliminar usuarios, excepto el usuario que realiza la operación.
- Administración de categorías:
  - Crear categorías.
  - Listar categorías.
  - Eliminar categorías y sus productos relacionados.
- Administración de productos:
  - Crear productos con cantidad y descripción opcionales.
  - Filtrar productos por categoría y cantidad máxima.
  - Eliminar productos.
- Registro de movimientos de entrada y salida.
- Actualización automática del stock al registrar un movimiento.
- Filtrado de movimientos por tipo, categoría, producto y rango de fechas.
- Alertas visuales en el frontend mediante SweetAlert2.

## Arquitectura

```text
Navegador
   |
   | React + TypeScript + Vite (http://localhost:4000)
   |
   | HTTP / JSON
   v
API Express (http://localhost:3000)
   |
   | mysql2
   v
MySQL - base de datos inventary
```

El frontend guarda el JWT en `localStorage` con la clave `token`. El rol incluido en el token determina la pantalla inicial y las rutas visibles. El backend expone actualmente las rutas directamente desde `/`; no se utiliza un prefijo como `/api`.

> Importante: las rutas de protección del frontend mejoran la experiencia de navegación, pero no sustituyen un middleware de autorización en el backend. Para un despliegue real, las operaciones administrativas deben validar el JWT y el rol en el servidor.

## Tecnologías

### Frontend

- React `19`.
- TypeScript `6`.
- Vite `8`.
- React Router.
- `jwt-decode` para leer el rol del token.
- SweetAlert2 para mostrar mensajes.
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
- Acceso a dos terminales para ejecutar frontend y backend al mismo tiempo.

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

Para otros entornos, modifica la configuración de conexión y evita dejar credenciales reales escritas directamente en el código. Lo recomendable es migrar estos valores a variables de entorno, por ejemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventary
DB_TIMEZONE=local
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

### URLs y puertos

- Backend: `http://localhost:3000`.
- Frontend: `http://localhost:4000`.
- CORS del backend: permite actualmente `http://localhost:4000`.

Si se cambia el puerto del frontend, también debe actualizarse el origen permitido en `backend/app.js` y las URLs usadas por las llamadas `fetch` del frontend.

## Ejecución

### Backend

En una terminal:

```bash
cd backend
npm start
```

El servidor escucha en el puerto `3000`, salvo que el entorno defina `PORT`.

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
4. Abre `http://localhost:4000`.
5. Inicia sesión con un usuario existente.
6. Según el valor de `rol`:
   - `admin`: accede al panel de usuarios, categorías y movimientos.
   - `regular`: accede al panel de productos y al registro de movimientos desde la gestión de productos.
7. Para cerrar sesión, utiliza el botón correspondiente. El token se elimina de `localStorage`.

El frontend también elimina el token al volver atrás en el historial del navegador y al cargar nuevamente la pantalla de inicio de sesión.

## Base de datos

La aplicación espera una base de datos MySQL llamada `inventary` con cuatro tablas principales:

```text
users       1 ---- N movements
categories  1 ---- N products
```

El esquema consolidado del proyecto está disponible en [`database/schema.sql`](database/schema.sql). Este archivo crea la base de datos y las cuatro tablas, y recrea las tablas si ya existen.

### Tablas esperadas

#### `users`

| Columna    | Uso                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `idusers`  | Identificador o nombre de usuario. Se consulta de forma sensible a mayúsculas y minúsculas en algunas operaciones. |
| `password` | Hash generado con `bcrypt`.                                                                                        |
| `rol`      | Rol de la cuenta, normalmente `admin` o `regular`.                                                                 |

#### `categories`

| Columna       | Uso                            |
| ------------- | ------------------------------ |
| `idcategoria` | Identificador de la categoría. |
| `category`    | Nombre de la categoría.        |

#### `products`

| Columna        | Uso                                                              |
| -------------- | ---------------------------------------------------------------- |
| `idproducts`   | Identificador del producto.                                      |
| `product_name` | Nombre único usado por las operaciones actuales.                 |
| `amount`       | Cantidad disponible en inventario.                               |
| `description`  | Descripción opcional; el dump usa `SIN DESCRIPCION` por defecto. |
| `idcategoria`  | Referencia a `categories.idcategoria`.                           |

#### `movements`

| Columna         | Uso                                                  |
| --------------- | ---------------------------------------------------- |
| `movement_type` | Tipo de movimiento: `entrada` o `salida`.            |
| `date_movement` | Fecha del movimiento. El dump la define como `DATE`. |
| `amount`        | Cantidad movida.                                     |
| `category`      | Categoría registrada en el movimiento.               |
| `product_name`  | Producto afectado.                                   |
| `idusers`       | Usuario que registra el movimiento.                  |

### Restaurar el dump disponible

El volcado disponible en `C:\Users\l\Documents\dumps\Dump20260909` contiene estos archivos:

- `inventary_users.sql`
- `inventary_categories.sql`
- `inventary_products.sql`
- `inventary_movements.sql`

Son dumps de estructura generados con MySQL 8.0.44. Cada archivo crea o selecciona la base de datos `inventary`, elimina la tabla del mismo nombre si ya existe y vuelve a crearla. El volcado contiene la definición de las tablas; no sustituye una copia de los datos de producción.

Puedes restaurarlos desde la carpeta del proyecto con el cliente de MySQL. Importa primero las tablas independientes y después las tablas que dependen lógicamente de ellas:

```bash
mysql -u root -p < "C:\\Users\\l\\Documents\\dumps\\Dump20260909\\inventary_users.sql"
mysql -u root -p < "C:\\Users\\l\\Documents\\dumps\\Dump20260909\\inventary_categories.sql"
mysql -u root -p < "C:\\Users\\l\\Documents\\dumps\\Dump20260909\\inventary_products.sql"
mysql -u root -p < "C:\\Users\\l\\Documents\\dumps\\Dump20260909\\inventary_movements.sql"
```

También puedes ejecutar los archivos desde MySQL Workbench. No ejecutes estos scripts si necesitas conservar las tablas actuales, porque cada uno contiene `DROP TABLE IF EXISTS`.

El esquema real del dump es el siguiente:

- `users.idusers`: `VARCHAR(50)`, clave primaria.
- `users.rol`: `VARCHAR(50)` obligatorio.
- `users.password`: `VARCHAR(5000)` obligatorio.
- `categories.idcategoria`: `INT` autoincremental, clave primaria.
- `categories.category`: `VARCHAR(50)` obligatorio.
- `products.idproducts`: `INT` autoincremental, clave primaria.
- `products.product_name`: `VARCHAR(100)` obligatorio.
- `products.amount`: `INT` obligatorio, valor predeterminado `0`.
- `products.description`: `VARCHAR(500)`, valor predeterminado `SIN DESCRIPCION`.
- `products.idcategoria`: `INT` obligatorio, con índice `categoryKey_idx`.
- `movements.idmovements`: `INT` autoincremental, clave primaria.
- `movements.movement_type`: `VARCHAR(50)` obligatorio.
- `movements.date_movement`: `DATE` obligatorio.
- `movements.amount`: `INT` obligatorio.
- `movements.category`: `VARCHAR(50)` obligatorio.
- `movements.product_name`: `VARCHAR(50)` obligatorio.
- `movements.idusers`: `VARCHAR(50)` obligatorio.

El dump no declara claves foráneas entre `products`, `categories`, `movements` y `users`; esas relaciones se mantienen mediante la lógica de los controladores. El backend usa nombres de columnas concretos en sus consultas. Si el esquema local utiliza nombres distintos, las consultas de los controladores también deben actualizarse.

Si no tienes acceso al dump, puedes crear una estructura inicial manual. Este ejemplo debe revisarse y adaptarse antes de producción:

```sql
CREATE DATABASE IF NOT EXISTS inventary;
USE inventary;

CREATE TABLE users (
  idusers VARCHAR(100) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL
);

CREATE TABLE categories (
  idcategoria INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
  idproducts INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL UNIQUE,
  amount INT NOT NULL DEFAULT 0,
  description TEXT NULL,
  idcategoria INT NOT NULL,
  CONSTRAINT fk_products_categories
    FOREIGN KEY (idcategoria) REFERENCES categories(idcategoria)
);

CREATE TABLE movements (
  idmovement INT AUTO_INCREMENT PRIMARY KEY,
  movement_type VARCHAR(20) NOT NULL,
  date_movement DATE NOT NULL,
  amount INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  idusers VARCHAR(100) NOT NULL
);
```

El backend usa nombres de columnas concretos en sus consultas. Si el esquema local utiliza nombres distintos, las consultas de los controladores también deben actualizarse.

### Reglas de inventario

- Un producto requiere una categoría existente.
- `amount` representa el stock actual del producto.
- Una `entrada` incrementa el stock.
- Una `salida` disminuye el stock.
- No se permite una salida mayor que el stock disponible.
- Al eliminar una categoría, el backend elimina primero los productos asociados y después la categoría.
- El registro de movimientos conserva el nombre de producto y categoría usados en ese momento.

## API REST

Todas las respuestas usan JSON. La URL base local es:

```text
http://localhost:3000
```

Actualmente no hay un middleware general que exija el JWT en cada endpoint. El frontend controla el acceso visual por rol, pero el backend debe reforzarse antes de exponerlo fuera de un entorno local.

### Autenticación y usuarios

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
  "token": "eyJ..."
}
```

#### `POST /newUser`

Crea un usuario. La contraseña debe alcanzar el nivel mínimo aceptado por `zxcvbn`.

```json
{
  "idusers": "usuario1",
  "password": "UnaContraseñaSegura",
  "rol": "regular"
}
```

#### `GET /listUsers?rol=regular`

Lista usuarios. El parámetro `rol` es opcional.

#### `POST /changePassword`

Cambia la contraseña y exige confirmación.

```json
{
  "idusers": "usuario1",
  "newPassword": "NuevaContraseñaSegura",
  "confirmPassword": "NuevaContraseñaSegura"
}
```

#### `DELETE /deleteUser/:idusers/:tokenUser`

Elimina un usuario. `tokenUser` se utiliza para impedir que la cuenta se elimine a sí misma.

Ejemplo:

```text
DELETE /deleteUser/usuario2/usuario1
```

### Categorías

#### `GET /listCategories`

Devuelve todas las categorías.

#### `POST /newCategory`

Crea una categoría.

```json
{
  "categoryName": "Papelería"
}
```

#### `DELETE /deleteCategory/:categoryName`

Elimina una categoría y los productos asociados a ella.

Ejemplo:

```text
DELETE /deleteCategory/Papelería
```

### Productos

#### `GET /filterProducts`

Lista productos y permite aplicar filtros opcionales:

```text
GET /filterProducts?categoryName=Papelería&amount=10
```

Parámetros:

- `categoryName`: filtra por nombre de categoría.
- `amount`: devuelve productos cuya cantidad sea menor o igual al valor indicado.

La respuesta incluye `idproducts`, `product_name`, `amount`, `description` y `category`.

#### `POST /newProduct`

Crea un producto. `product_name` y `categoryName` son obligatorios; `amount` y `description` son opcionales.

```json
{
  "product_name": "Cuaderno",
  "amount": 25,
  "description": "Cuaderno de 100 hojas",
  "categoryName": "Papelería"
}
```

#### `DELETE /deleteProduct/:product_name`

Elimina un producto por nombre.

Ejemplo:

```text
DELETE /deleteProduct/Cuaderno
```

### Movimientos

#### `POST /newMovement`

Registra una entrada o salida, actualiza el stock y guarda el movimiento.

```json
{
  "type": "entrada",
  "amount": 10,
  "category_name": "Papelería",
  "product_name": "Cuaderno",
  "userName": "usuario1"
}
```

Valores válidos de `type`:

- `entrada`
- `salida`

Para una salida, la cantidad no puede superar el stock disponible.

#### `GET /filterMovements`

Lista los movimientos ordenados del más reciente al más antiguo. Todos los parámetros son opcionales:

```text
GET /filterMovements?type=salida&category_name=Papelería&product_name=Cuaderno&initDate=2026-01-01&finalDate=2026-12-31
```

Parámetros:

- `type`
- `category_name`
- `product_name`
- `initDate`
- `finalDate`

El filtro de fechas se aplica cuando se proporcionan `initDate` y `finalDate`.

## Rutas del frontend

| Ruta              | Acceso    | Pantalla                           |
| ----------------- | --------- | ---------------------------------- |
| `/`               | Público   | Inicio de sesión                   |
| `/adminMain`      | `admin`   | Panel principal de administración  |
| `/adminUsers`     | `admin`   | Administración de usuarios         |
| `/adminCategory`  | `admin`   | Administración de categorías       |
| `/adminMovements` | `admin`   | Consulta de movimientos            |
| `/regularMain`    | `regular` | Panel principal de usuario regular |
| `/productsReg`    | `regular` | Gestión de productos               |

## Estructura del proyecto

```text
inventario/
├── backend/
│   ├── app.js                  # Configuración de Express, JSON, CORS y rutas
│   ├── package.json            # Dependencias y script de arranque
│   ├── secretKey.env           # Secreto JWT local, excluido de Git
│   ├── bin/www                  # Servidor HTTP y puerto
│   ├── db/db.js                # Conexión MySQL
│   ├── controllers/            # Controladores de usuarios, categorías, productos y movimientos
│   └── routes/routes.js         # Registro de endpoints
├── frontend/
│   ├── package.json            # Dependencias y scripts de Vite
│   ├── vite.config.ts          # Puerto 4000 y plugin React
│   └── src/
│       ├── App.tsx             # Router y rutas protegidas
│       ├── main.tsx            # Punto de entrada React
│       ├── general/            # Inicio de sesión
│       ├── admin/               # Vistas y operaciones administrativas
│       ├── regular/             # Vistas para usuarios regulares
│       ├── ruteProtection/      # Protección de rutas en el cliente
│       ├── alerts/              # Alertas de interfaz
│       └── styles/              # Estilos globales
├── database/
│   └── schema.sql                # Esquema SQL consolidado de la base de datos
├── .gitignore
└── README.md
```

## Seguridad

Antes de usar el sistema en producción, se recomienda:

- Cambiar el secreto JWT por uno largo, aleatorio y exclusivo del entorno.
- No versionar `backend/secretKey.env` ni credenciales de MySQL.
- Mover host, usuario, contraseña y nombre de base de datos a variables de entorno.
- Añadir middleware de autenticación JWT en el backend.
- Validar el rol en el servidor para cada operación administrativa.
- Usar HTTPS.
- Validar y limitar los valores de `amount`, incluyendo explícitamente cantidades cero, decimales y valores no numéricos.
- Usar transacciones para actualizar el stock y registrar el movimiento como una operación atómica.
- Añadir claves foráneas e índices adecuados para productos, categorías, usuarios y movimientos.
- Evitar devolver detalles internos de errores de base de datos en producción.
- Configurar CORS con una lista de orígenes permitidos por entorno.
- Rotar las credenciales si alguna contraseña o secreto ya fue expuesto.

## Problemas frecuentes

### El frontend no puede conectarse al backend

Comprueba que:

1. El backend esté ejecutándose en `http://localhost:3000`.
2. El frontend esté ejecutándose en `http://localhost:4000`.
3. MySQL esté iniciado.
4. La base de datos `inventary` exista.
5. Las tablas y columnas coincidan con las consultas del backend.
6. El origen del frontend coincida con la configuración CORS de `backend/app.js`.

### Error de conexión con MySQL

Revisa las credenciales de `backend/db/db.js`, el nombre `inventary`, el puerto de MySQL y que el servidor acepte conexiones locales.

### El usuario no puede iniciar sesión

Verifica que el registro exista, que la contraseña se haya almacenado mediante `bcrypt` y que `backend/secretKey.env` contenga `JWT_SECRET`.

### El acceso por rol no funciona

El valor de `rol` debe ser exactamente `admin` o `regular`. El frontend decodifica el JWT y compara esos valores literalmente.

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

El proyecto está preparado para desarrollo local. Para un entorno productivo todavía deben completarse, como mínimo, la gestión de secretos por entorno, la autorización en el backend, las migraciones de base de datos, el manejo transaccional de movimientos y una estrategia de despliegue con HTTPS.
