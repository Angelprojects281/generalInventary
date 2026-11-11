-- =====================================================
-- REINICIO COMPLETO DE LA BASE DE DATOS INVENTARY
-- Esquema multiempresa con 6 tablas: users, categories,
-- providers, products, movements (cabecera del
-- historial) y movement_items (detalle por producto).
-- Cada usuario/empresa tiene su propio inventario
-- aislado mediante la columna idusers.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `inventary`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `inventary`;

-- Desactivar temporalmente las restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- ELIMINAR TABLAS
-- =====================================================

DROP TABLE IF EXISTS `movement_items`;
DROP TABLE IF EXISTS `movements`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `providers`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- =====================================================
-- TABLA USERS
-- Cada fila es una cuenta/empresa con su inventario.
-- No existe el campo rol: todas las cuentas tienen los
-- mismos permisos sobre su propio inventario.
-- =====================================================

CREATE TABLE `users` (
  `idusers` varchar(50) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `password` varchar(5000) NOT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA CATEGORIES
-- Las categorias pertenecen a una empresa (idusers).
-- El nombre unico es por empresa, no global.
-- =====================================================

CREATE TABLE `categories` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `idusers` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`idcategoria`),
  UNIQUE KEY `category_per_company_UNIQUE` (`idusers`, `category`),
  CONSTRAINT `fk_categories_user`
    FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA PROVIDERS
-- Los proveedores pertenecen a una empresa (idusers).
-- La fila 0 "SIN PROVEEDOR" es una centinela global
-- (idusers NULL) que usan los productos sin proveedor;
-- al listar por empresa nunca aparece.
-- =====================================================

CREATE TABLE `providers` (
  `idprovider` int NOT NULL AUTO_INCREMENT,
  `idusers` varchar(50) DEFAULT NULL,
  `provider_name` varchar(500) NOT NULL,
  `contact` bigint NOT NULL,
  PRIMARY KEY (`idprovider`),
  UNIQUE KEY `provider_per_company_UNIQUE` (`idusers`, `provider_name`),
  CONSTRAINT `fk_providers_user`
    FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- El backend usa 0 para productos sin proveedor asignado.
INSERT INTO `providers` (`idprovider`, `idusers`, `provider_name`, `contact`)
VALUES (0, NULL, 'SIN PROVEEDOR', 0);

-- =====================================================
-- TABLA PRODUCTS
-- Cada producto pertenece a una empresa (idusers).
-- El codigo y el nombre unicos son por empresa.
-- =====================================================

CREATE TABLE `products` (
  `idproducts` int NOT NULL AUTO_INCREMENT,
  `idusers` varchar(50) NOT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `product_name` varchar(100) NOT NULL,
  `amount` int NOT NULL DEFAULT 0,
  `description` varchar(500) DEFAULT 'SIN DESCRIPCION',
  `purchase_value` decimal(12,2) NOT NULL,
  `sale_value` decimal(12,2) NOT NULL,
  CONSTRAINT `chk_products_values`
    CHECK (`purchase_value` >= 0 AND `sale_value` > `purchase_value`),
  `idcategoria` int NOT NULL,
  `idprovider` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`idproducts`),
  UNIQUE KEY `product_code_per_company_UNIQUE` (`idusers`, `product_code`),
  UNIQUE KEY `product_name_per_company_UNIQUE` (`idusers`, `product_name`),
  KEY `categoryKey_idx` (`idcategoria`),
  KEY `providerkey_idx` (`idprovider`),
  CONSTRAINT `fk_products_user`
    FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`idcategoria`) REFERENCES `categories` (`idcategoria`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_products_provider`
    FOREIGN KEY (`idprovider`) REFERENCES `providers` (`idprovider`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA MOVEMENTS
-- Cabecera del historial: cada fila es un movimiento
-- (entrada o salida) de una empresa (idusers). El
-- detalle por producto con sus copias historicas y su
-- valor unitario vive en movement_items.
-- =====================================================

CREATE TABLE `movements` (
  `idmovements` int NOT NULL AUTO_INCREMENT,
  `idusers` varchar(50) NOT NULL,
  `movement_type` varchar(50) NOT NULL,
  `date_movement` datetime NOT NULL,
  PRIMARY KEY (`idmovements`),
  KEY `movements_user_idx` (`idusers`),
  CONSTRAINT `fk_movements_user`
    FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA MOVEMENT_ITEMS
-- Detalle de cada movimiento: una fila por producto.
-- idproducts es solo referencia de conveniencia (sin
-- clave foranea): product_name, product_code y category
-- son copias historicas, de modo que borrar un producto
-- o una categoria no borra el historial. unit_value
-- guarda el precio aplicado en ese momento (sale_value
-- en salida, purchase_value en entrada) y no cambia si
-- despues se edita el producto.
-- =====================================================

CREATE TABLE `movement_items` (
  `idmovement_item` int NOT NULL AUTO_INCREMENT,
  `idmovements` int NOT NULL,
  `idusers` varchar(50) NOT NULL,
  `idproducts` int NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `amount` int NOT NULL,
  `unit_value` decimal(12,2) NOT NULL,
  PRIMARY KEY (`idmovement_item`),
  KEY `movement_items_movement_idx` (`idmovements`),
  KEY `movement_items_user_idx` (`idusers`),
  CONSTRAINT `fk_movement_items_movement`
    FOREIGN KEY (`idmovements`) REFERENCES `movements` (`idmovements`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_movement_items_user`
    FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- No se crea ningun usuario predeterminado: cada
-- cuenta se crea desde la pagina de registro.
-- =====================================================

-- =====================================================
-- VOLVER A ACTIVAR CLAVES FORÁNEAS
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- VERIFICACIONES
-- =====================================================

SELECT * FROM `users`;

SELECT * FROM `categories`;

SELECT * FROM `providers`;

SELECT * FROM `products`;

SELECT * FROM `movements`;

SELECT * FROM `movement_items`;
