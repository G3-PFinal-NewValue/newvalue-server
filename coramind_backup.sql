-- MySQL dump 10.13  Distrib 9.5.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: coramind
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `psychologist_id` int NOT NULL,
  `date` datetime NOT NULL,
  `duration_minutes` int NOT NULL DEFAULT '50',
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text,
  `session_link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `availability_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointment_psychologist_id_date` (`psychologist_id`,`date`),
  KEY `appointment_patient_id_date` (`patient_id`,`date`),
  KEY `appointment_psychologist_id_date_unique` (`psychologist_id`,`date`),
  KEY `appointment_availability_id_foreign_idx` (`availability_id`),
  CONSTRAINT `appointment_availability_id_foreign_idx` FOREIGN KEY (`availability_id`) REFERENCES `availability` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_85` FOREIGN KEY (`patient_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_86` FOREIGN KEY (`psychologist_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (3,17,10,'2025-11-12 07:30:00',45,'confirmed','',NULL,'2025-11-10 12:41:42','2025-11-10 14:18:28',NULL,1),(4,17,10,'2025-11-12 15:45:00',45,'confirmed','',NULL,'2025-11-10 12:41:49','2025-11-10 14:18:32',NULL,1),(5,17,10,'2025-11-12 09:00:00',45,'confirmed','',NULL,'2025-11-10 16:59:28','2025-11-10 17:00:05',NULL,1),(6,17,10,'2025-11-13 10:00:00',45,'confirmed','',NULL,'2025-11-11 11:00:44','2025-11-12 09:11:13',NULL,2),(7,17,10,'2025-11-12 13:30:00',45,'confirmed','',NULL,'2025-11-12 09:09:15','2025-11-12 09:11:11',NULL,1);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `article_ibfk_61` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_ibfk_62` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `psychologist_id` int NOT NULL,
  `weekday` smallint DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('available','booked','unavailable') NOT NULL DEFAULT 'available',
  `specific_date` date NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `psychologist_id` (`psychologist_id`),
  CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`psychologist_id`) REFERENCES `psychologist` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` VALUES (1,10,3,'07:00:00','19:00:00','booked','2025-11-12',1,NULL),(2,10,4,'08:00:00','15:00:00','booked','2025-11-13',1,NULL);
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `name_31` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `user_id` int NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `therapy_goals` text,
  `medical_history` text,
  `photo` text,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (2,'1987-05-15','Femenino','Estos son unos objetivos de prueba',NULL,NULL,'active','2025-11-02 16:05:36','2025-11-02 16:05:36',NULL),(3,'2009-02-02','Masculino','Estos son objetivos de terapia',NULL,NULL,'active','2025-11-02 16:13:29','2025-11-02 16:13:29',NULL),(17,'1995-10-05','Femenino','Me gustaría mejor el perfil de prueba 9',NULL,NULL,'active','2025-11-10 12:04:58','2025-11-10 13:57:19',NULL);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychologist`
--

DROP TABLE IF EXISTS `psychologist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychologist` (
  `user_id` int NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `professional_description` text,
  `photo` varchar(255) DEFAULT NULL,
  `validated` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `license_number` (`license_number`),
  UNIQUE KEY `license_number_2` (`license_number`),
  UNIQUE KEY `license_number_3` (`license_number`),
  UNIQUE KEY `license_number_4` (`license_number`),
  UNIQUE KEY `license_number_5` (`license_number`),
  UNIQUE KEY `license_number_6` (`license_number`),
  UNIQUE KEY `license_number_7` (`license_number`),
  UNIQUE KEY `license_number_8` (`license_number`),
  UNIQUE KEY `license_number_9` (`license_number`),
  UNIQUE KEY `license_number_10` (`license_number`),
  UNIQUE KEY `license_number_11` (`license_number`),
  UNIQUE KEY `license_number_12` (`license_number`),
  UNIQUE KEY `license_number_13` (`license_number`),
  UNIQUE KEY `license_number_14` (`license_number`),
  UNIQUE KEY `license_number_15` (`license_number`),
  UNIQUE KEY `license_number_16` (`license_number`),
  UNIQUE KEY `license_number_17` (`license_number`),
  UNIQUE KEY `license_number_18` (`license_number`),
  UNIQUE KEY `license_number_19` (`license_number`),
  UNIQUE KEY `license_number_20` (`license_number`),
  UNIQUE KEY `license_number_21` (`license_number`),
  UNIQUE KEY `license_number_22` (`license_number`),
  UNIQUE KEY `license_number_23` (`license_number`),
  UNIQUE KEY `license_number_24` (`license_number`),
  UNIQUE KEY `license_number_25` (`license_number`),
  UNIQUE KEY `license_number_26` (`license_number`),
  UNIQUE KEY `license_number_27` (`license_number`),
  UNIQUE KEY `license_number_28` (`license_number`),
  UNIQUE KEY `license_number_29` (`license_number`),
  UNIQUE KEY `license_number_30` (`license_number`),
  UNIQUE KEY `license_number_31` (`license_number`),
  CONSTRAINT `psychologist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychologist`
--

LOCK TABLES `psychologist` WRITE;
/*!40000 ALTER TABLE `psychologist` DISABLE KEYS */;
INSERT INTO `psychologist` VALUES (10,'COP 123','Este es un enfoque terapeútico de prueba','https://res.cloudinary.com/dkm0ahny1/image/upload/v1762087452/psychologists/kblip99kgy94igzjzplw.png',1,'active','2025-11-02 12:44:13','2025-11-02 12:45:56',NULL),(11,'COP 1234','Este es otro perfil de prueba','https://res.cloudinary.com/dkm0ahny1/image/upload/v1762102635/psychologists/q6zccur84cj3aamlcqez.png',1,'active','2025-11-02 16:57:15','2025-11-10 14:17:44',NULL);
/*!40000 ALTER TABLE `psychologist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychologist_language`
--

DROP TABLE IF EXISTS `psychologist_language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychologist_language` (
  `psychologist_id` int NOT NULL,
  `language_id` int NOT NULL,
  KEY `psychologist_id` (`psychologist_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `psychologist_language_ibfk_1` FOREIGN KEY (`psychologist_id`) REFERENCES `psychologist` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `psychologist_language_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychologist_language`
--

LOCK TABLES `psychologist_language` WRITE;
/*!40000 ALTER TABLE `psychologist_language` DISABLE KEYS */;
/*!40000 ALTER TABLE `psychologist_language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychologist_languages`
--

DROP TABLE IF EXISTS `psychologist_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychologist_languages` (
  `psychologist_id` int NOT NULL,
  `language_id` int NOT NULL,
  PRIMARY KEY (`psychologist_id`,`language_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `psychologist_languages_ibfk_1` FOREIGN KEY (`psychologist_id`) REFERENCES `psychologist` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `psychologist_languages_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychologist_languages`
--

LOCK TABLES `psychologist_languages` WRITE;
/*!40000 ALTER TABLE `psychologist_languages` DISABLE KEYS */;
/*!40000 ALTER TABLE `psychologist_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychologist_specialities`
--

DROP TABLE IF EXISTS `psychologist_specialities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychologist_specialities` (
  `psychologist_id` int NOT NULL,
  `speciality_id` int NOT NULL,
  PRIMARY KEY (`psychologist_id`,`speciality_id`),
  KEY `speciality_id` (`speciality_id`),
  CONSTRAINT `psychologist_specialities_ibfk_1` FOREIGN KEY (`psychologist_id`) REFERENCES `psychologist` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `psychologist_specialities_ibfk_2` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychologist_specialities`
--

LOCK TABLES `psychologist_specialities` WRITE;
/*!40000 ALTER TABLE `psychologist_specialities` DISABLE KEYS */;
INSERT INTO `psychologist_specialities` VALUES (10,1),(11,1),(11,2),(10,3),(11,7);
/*!40000 ALTER TABLE `psychologist_specialities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychologist_speciality`
--

DROP TABLE IF EXISTS `psychologist_speciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychologist_speciality` (
  `psychologist_id` int NOT NULL,
  `speciality_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`psychologist_id`,`speciality_id`),
  KEY `speciality_id` (`speciality_id`),
  CONSTRAINT `psychologist_speciality_ibfk_1` FOREIGN KEY (`psychologist_id`) REFERENCES `psychologist` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `psychologist_speciality_ibfk_2` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychologist_speciality`
--

LOCK TABLES `psychologist_speciality` WRITE;
/*!40000 ALTER TABLE `psychologist_speciality` DISABLE KEYS */;
/*!40000 ALTER TABLE `psychologist_speciality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `name_31` (`name`),
  UNIQUE KEY `name_32` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(3,'patient'),(4,'pending'),(2,'psychologist');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelize_meta`
--

DROP TABLE IF EXISTS `sequelize_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelize_meta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelize_meta`
--

LOCK TABLES `sequelize_meta` WRITE;
/*!40000 ALTER TABLE `sequelize_meta` DISABLE KEYS */;
INSERT INTO `sequelize_meta` VALUES ('001-create-role.js'),('002-create-user.js'),('003-create-patient.js'),('004-create-speciality.js'),('005-create-psychologist.js'),('006-create-psychologist-speciality.js'),('007-create-availability.js'),('008-create-appointment.js'),('009-create-session.js'),('010-create-category.js'),('011-create-article.js'),('012-create-psychologist-lenguage.js'),('015-update-availability-table.js'),('016-add-availability-to-appointment.js');
/*!40000 ALTER TABLE `sequelize_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int NOT NULL,
  `summary` text,
  `recommendations` text,
  `materials_sent` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_appointment_id` (`appointment_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speciality`
--

DROP TABLE IF EXISTS `speciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speciality` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `name_31` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speciality`
--

LOCK TABLES `speciality` WRITE;
/*!40000 ALTER TABLE `speciality` DISABLE KEYS */;
INSERT INTO `speciality` VALUES (2,'Ansiedad y Estrés'),(3,'Depresión'),(6,'Duelo'),(5,'Mindfulness'),(1,'Terapia Cognitivo - Conductual'),(4,'Terapia de Pareja'),(7,'Trastornos del Sueño');
/*!40000 ALTER TABLE `speciality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `province` varchar(50) NOT NULL,
  `full_address` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `dni_nie_cif` varchar(50) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `registration_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_password_token` varchar(255) DEFAULT NULL,
  `user_password_token_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `google_id_2` (`google_id`),
  UNIQUE KEY `google_id_3` (`google_id`),
  UNIQUE KEY `google_id_4` (`google_id`),
  UNIQUE KEY `google_id_5` (`google_id`),
  UNIQUE KEY `google_id_6` (`google_id`),
  UNIQUE KEY `google_id_7` (`google_id`),
  UNIQUE KEY `google_id_8` (`google_id`),
  UNIQUE KEY `google_id_9` (`google_id`),
  UNIQUE KEY `google_id_10` (`google_id`),
  UNIQUE KEY `google_id_11` (`google_id`),
  UNIQUE KEY `google_id_12` (`google_id`),
  UNIQUE KEY `google_id_13` (`google_id`),
  UNIQUE KEY `google_id_14` (`google_id`),
  UNIQUE KEY `google_id_15` (`google_id`),
  UNIQUE KEY `google_id_16` (`google_id`),
  UNIQUE KEY `google_id_17` (`google_id`),
  UNIQUE KEY `google_id_18` (`google_id`),
  UNIQUE KEY `google_id_19` (`google_id`),
  UNIQUE KEY `google_id_20` (`google_id`),
  UNIQUE KEY `google_id_21` (`google_id`),
  UNIQUE KEY `google_id_22` (`google_id`),
  UNIQUE KEY `google_id_23` (`google_id`),
  UNIQUE KEY `google_id_24` (`google_id`),
  UNIQUE KEY `google_id_25` (`google_id`),
  UNIQUE KEY `google_id_26` (`google_id`),
  UNIQUE KEY `google_id_27` (`google_id`),
  UNIQUE KEY `google_id_28` (`google_id`),
  UNIQUE KEY `google_id_29` (`google_id`),
  UNIQUE KEY `google_id_30` (`google_id`),
  UNIQUE KEY `google_id_31` (`google_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'coramind.newvalue@gmail.com','$2b$10$/WouMQy9NhPknkNius.xM.eRozAdrOUv6meZr87CeFmB5HONKdajC','Admin','Cora Mind','+34 600000000','28001','Madrid','Sin dirección aún','Madrid','España','X0000000X',NULL,1,'active','2025-11-02 12:31:59','2025-11-02 12:31:59','2025-11-02 12:31:59',NULL,NULL,NULL),(2,'paciente1@coramind.com','$2b$10$FggkrXSre6mPvmGGbKQLrON7oyAzDM7N/ztPUlAEjj9FfpROFOx5O','Dr. Admin','Nuñez Iglesias','688999000','41004','Sevilla','Calle Sierpes 50','Sevilla','España','PS-333335',NULL,1,'active','2025-11-02 12:32:58','2025-11-02 12:32:58','2025-11-02 12:32:58',NULL,NULL,NULL),(3,'paciente2@coramind.com','$2b$10$qHVmkxBLZSTLELB3ayIL6ewbwX4kzJhX2ziZSZuDBPAyDmPUwxlsW','Luis','Martínez Ruiz','622333444','08001','Barcelona','Avenida Siempre Viva 45','Barcelona','España','22222222B',NULL,3,'active','2025-11-02 12:34:49','2025-11-02 12:34:49','2025-11-02 12:34:49',NULL,NULL,NULL),(4,'psico1.pendiente@coramind.com','$2b$10$9qOLKPMNuhFlADFBBhyeoOwWyUocrG2ywSmZgL.nOMGoVV4KF0iZ6','Dr. Carlos','Méndez Soler','666777888','28004','Madrid','Calle del Pez 10','Madrid','España','PS-111111',NULL,2,'active','2025-11-02 12:35:01','2025-11-02 12:35:01','2025-11-02 12:35:01',NULL,NULL,NULL),(5,'psico2.pendiente@coramind.com','$2b$10$lLdRZZXtHUChtzbIEnWEKOEN3su5tzotNiHgvRYKGa3075Eb0GMxu','Dra. Elena','Vidal Costa','677888999','08002','Barcelona','Rambla de Cataluña 30','Barcelona','España','PS-222222',NULL,2,'active','2025-11-02 12:35:11','2025-11-02 12:35:11','2025-11-02 12:35:11',NULL,NULL,NULL),(6,'paciente3@coramind.com','$2b$10$VU277jKXELw/CWf.niq58uHkfqjQ6w0HyLOE5jtP6I14ZIwzeFcOO','Carla','Sánchez Fernández','633444555','41001','Sevilla','Plaza Mayor 1','Sevilla','España','33333333C',NULL,3,'active','2025-11-02 12:35:32','2025-11-02 12:35:32','2025-11-02 12:35:32',NULL,NULL,NULL),(7,'paciente4@coramind.com','$2b$10$tVvyFxJ0adpclH73MCwCeOcELkMNUJNS8YOmC3qvTUZI248G17wZ6','David','Gómez Pérez','644555666','46002','Valencia','Calle de la Luna 8','Valencia','España','44444444D',NULL,3,'active','2025-11-02 12:35:41','2025-11-02 12:35:41','2025-11-02 12:35:41',NULL,NULL,NULL),(8,'paciente5@coramind.com','$2b$10$gYsK40A7QuEICpiaU4BfweEFX7N0EbPuaxDEUipP8B0Ou834LLzEC','Sofía','Díaz Romero','655666777','48005','Bilbao','Gran Vía 22','Bilbao','España','55555555E',NULL,3,'active','2025-11-02 12:35:49','2025-11-02 12:35:49','2025-11-02 12:35:49',NULL,NULL,NULL),(9,'psico3.pendiente@coramind.com','$2b$10$DvGMepp0Z2TTMQ7TrQ7JpuRAxDkym40bDLcRr9l02HyHeC.b5nBV6','Dr. Javier','Nuñez Iglesias','688999000','41004','Sevilla','Calle Sierpes 50','Sevilla','España','PS-333333',NULL,2,'active','2025-11-02 12:36:23','2025-11-02 12:36:23','2025-11-12 09:49:34',NULL,NULL,NULL),(10,'psicologo1@gmail.com','$2b$10$lxDHULYDUlmWEtehGUvoEO0Gu5qge3eP4jydWD5XRwV/dv6GAXpd2','Camila','Arenas','+34654130653','28044','MADRID','Calle 2','MADRID','Colombia','Z1234567',NULL,2,'active','2025-11-02 12:43:33','2025-11-02 12:43:33','2025-11-02 12:43:33',NULL,NULL,NULL),(11,'psicologo1@coramind.com','$2b$10$OjdRwmSdzZqeG5.q0o2L9.OGWcD0CD8U8p7BaaIrZTTomqZIqeIcW','Pepito','Perez','543224422','28001','Madrid','Calle 123','Madrid','España','Z123456',NULL,2,'active','2025-11-02 16:56:29','2025-11-02 16:56:29','2025-11-02 16:56:29',NULL,NULL,NULL),(12,'psicologo3@coramind.com','$2b$10$dVooAj0BP95AQgJt325W.uB10nN1OZelCP54f.Ui9JDPSmbIeqc.O','Pepita','Suárez','+65765345','28044','MADRID','Calle 123','MADRID','Colombia','Z1234567',NULL,2,'active','2025-11-02 17:10:00','2025-11-02 17:10:00','2025-11-02 17:10:00',NULL,NULL,NULL),(13,'paciente6@coramind.com','$2b$10$KduPe2/poa6VykW6XnIC/eIoELxgVeXOUZfNmdBqfAhdMsOR5Kp0u','Maria','Arenas','6541345553','28044','MADRID','Calle 123','MADRID','Colombia','12345',NULL,3,'active','2025-11-10 10:10:16','2025-11-10 10:10:16','2025-11-10 10:10:16',NULL,NULL,NULL),(14,'paciente7@coramind.com','$2b$10$O/rFlpB3Xr9mkgBLpFURnelPxDzq0hekaoqaj7IW6.W4kJnpeTxuW','Maria ','Arenas','876478388','28044','MADRID','Calle 123','MADRID','Colombia','1234567',NULL,3,'active','2025-11-10 10:11:14','2025-11-10 10:11:14','2025-11-10 10:11:14',NULL,NULL,NULL),(15,'paciente712@coramind.com','$2b$10$Bh.Ha.0ypTmTFW7QCfpVWujzD0D8lAQMd.LCU0hneD63Du.ZwC46e','Maria ','Arenas','876478388','28044','MADRID','Calle 123','MADRID','Colombia','1234567',NULL,3,'active','2025-11-10 10:13:44','2025-11-10 10:13:44','2025-11-12 09:19:26',NULL,NULL,NULL),(16,'paciente11@coramind.com','$2b$10$My0VP8nPdZ3WfYGJDqtBruSb/n2MrmVhgYF2v7MCFlnRiZ3TyM2aO','Camila','Arenas','+34654130333','28044','MADRID','Calle 123','MADRID','Colombia','Z123456',NULL,3,'active','2025-11-10 12:00:06','2025-11-10 12:00:06','2025-11-10 12:00:06',NULL,NULL,NULL),(17,'paciente12@coramind.com','$2b$10$G0T8l/Sq0jXIlV7yVHsQ9ehASUL.QQbbVOUVypE5PZNI1/1H1kknO','Camila','Arenas','+34654130333','28044','MADRID','Calle 123','MADRID','Colombia','Z123456',NULL,3,'active','2025-11-10 12:04:15','2025-11-10 12:04:15','2025-11-10 12:04:15',NULL,NULL,NULL),(19,'mariacamilaarenasd@gmail.com',NULL,'Maria','Arenas','65413044','28044','MADRID','Calle del Tulipero 6','MADRID','Colombia','12345',NULL,2,'active','2025-11-11 08:07:13','2025-11-11 08:07:13','2025-11-11 08:07:13',NULL,'dce8d85b298ecd66dbef4cb33df5cad510c09eaceb2ae521d487d392826e8a8d','2025-11-12 08:07:13');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-12 11:27:05
