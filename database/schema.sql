-- =====================================================
-- REINICIO COMPLETO DE LA BASE DE DATOS INVENTARY
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

DROP TABLE IF EXISTS `movements`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `providers`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- =====================================================
-- TABLA USERS
-- =====================================================

CREATE TABLE `users` (
  `idusers` varchar(50) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `password` varchar(5000) NOT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA CATEGORIES
-- =====================================================

CREATE TABLE `categories` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`idcategoria`),
  UNIQUE KEY `idcategorias_UNIQUE` (`idcategoria`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA PROVIDERS
-- =====================================================

CREATE TABLE `providers` (
  `idprovider` int NOT NULL AUTO_INCREMENT,
  `provider_name` varchar(500) NOT NULL,
  `contact` int NOT NULL,
  PRIMARY KEY (`idprovider`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- El dump actual usa 0 para productos sin proveedor asignado.
INSERT INTO `providers` (`idprovider`, `provider_name`, `contact`)
VALUES (0, 'SIN PROVEEDOR', 0);

-- =====================================================
-- TABLA PRODUCTS
-- =====================================================

CREATE TABLE `products` (
  `idproducts` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) DEFAULT NULL,
  `product_name` varchar(100) NOT NULL,
  `amount` int NOT NULL DEFAULT 0,
  `description` varchar(500) DEFAULT 'SIN DESCRIPCION',
  `idcategoria` int NOT NULL,
  `idprovider` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`idproducts`),
  UNIQUE KEY `idproducts_UNIQUE` (`idproducts`),
  UNIQUE KEY `product_code_UNIQUE` (`product_code`),
  KEY `categoryKey_idx` (`idcategoria`),
  KEY `providerkey_idx` (`idprovider`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`idcategoria`) REFERENCES `categories` (`idcategoria`),
  CONSTRAINT `fk_products_provider`
    FOREIGN KEY (`idprovider`) REFERENCES `providers` (`idprovider`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- TABLA MOVEMENTS
-- =====================================================

CREATE TABLE `movements` (
  `idmovements` int NOT NULL AUTO_INCREMENT,
  `movement_type` varchar(50) NOT NULL,
  `date_movement` date NOT NULL,
  `amount` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `idusers` varchar(50) NOT NULL,
  PRIMARY KEY (`idmovements`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- INSERTAR USUARIO ADMIN
-- =====================================================

INSERT INTO `users` (
  `idusers`,
  `rol`,
  `password`
)
VALUES (
  'admin',
  'admin',
  '$2a$10$2zeJ96/Ic24dcX6IOrXibuei//.Ga3Wftr69OMq.qK8vLVcE/fsyq'
);

-- =====================================================
-- VOLVER A ACTIVAR CLAVES FORÁNEAS
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- VERIFICACIONES
-- =====================================================

SELECT * FROM `users`;

SELECT * FROM `categories`;

SELECT * FROM `products`;

SELECT * FROM `movements`;