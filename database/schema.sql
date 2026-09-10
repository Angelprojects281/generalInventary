CREATE DATABASE IF NOT EXISTS `inventary`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `inventary`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `movements`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `idusers` varchar(50) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `password` varchar(5000) NOT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categories` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`idcategoria`),
  UNIQUE KEY `idcategorias_UNIQUE` (`idcategoria`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `products` (
  `idproducts` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `amount` int NOT NULL DEFAULT 0,
  `description` varchar(500) DEFAULT 'SIN DESCRIPCION',
  `idcategoria` int NOT NULL,
  PRIMARY KEY (`idproducts`),
  UNIQUE KEY `idproducts_UNIQUE` (`idproducts`),
  KEY `categoryKey_idx` (`idcategoria`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movements` (
  `idmovements` int NOT NULL AUTO_INCREMENT,
  `movement_type` varchar(50) NOT NULL,
  `date_movement` date NOT NULL,
  `amount` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `idusers` varchar(50) NOT NULL,
  PRIMARY KEY (`idmovements`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
