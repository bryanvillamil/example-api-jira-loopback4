# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.18)
# Database: BD_JIRA
# Generation Time: 2019-12-11 20:15:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table issue
# ------------------------------------------------------------

DROP TABLE IF EXISTS `issue`;

CREATE TABLE `issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sumary` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `proyecto_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proyecto_id` (`proyecto_id`),
  CONSTRAINT `proyecto_id` FOREIGN KEY (`proyecto_id`) REFERENCES `proyecto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `issue` WRITE;
/*!40000 ALTER TABLE `issue` DISABLE KEYS */;

INSERT INTO `issue` (`id`, `sumary`, `descripcion`, `proyecto_id`)
VALUES
	(1,'sumary 1','descripcion 1',1),
	(2,'sumary 2','descripcion 2',1),
	(3,'sumary 3','descripcion 3',2),
	(4,'sumary 4','descripcion 4',2),
	(5,'sumary 5','descripcion 5',1),
	(6,'sumary 6','descripcion 6',3),
	(7,'sumary 7','descripcion 7',5),
	(8,'sumary 8','descripcion 8',4),
	(9,'sumary 9','descripcion 9',3),
	(10,'sumary 10 ','descripcion 10',5),
	(12,'sumary 11','descripcion 11',3),
	(13,'sumary 13','descripcion 13',3),
	(14,'sumary 14','descripcion 14',4),
	(15,'sumary 15','descripcion 15',3),
	(16,'sumary 16','descripcion 16',2),
	(17,'sumary 17','descripcion 17',5),
	(18,'sumary 18','descripcion 18',1),
	(19,'sumary 19','descripcion 19',3),
	(20,'sumary 20','descripcion 20',4),
	(21,'sumary 21','descripcion 21',5),
	(22,'sumary 22','descripcion 22',1),
	(23,'sumary 23','descripcion 23',3),
	(24,'sumary 24','descripcion 24',4),
	(26,'summary example','descripcion example',2);

/*!40000 ALTER TABLE `issue` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table proyecto
# ------------------------------------------------------------

DROP TABLE IF EXISTS `proyecto`;

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `key` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `proyecto` WRITE;
/*!40000 ALTER TABLE `proyecto` DISABLE KEYS */;

INSERT INTO `proyecto` (`id`, `nombre`, `key`)
VALUES
	(1,'Xennial','XW'),
	(2,'NBA','NBA'),
	(3,'UdeRosario','UDR'),
	(4,'La cochera','LCR'),
	(5,'Coop','CP');

/*!40000 ALTER TABLE `proyecto` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tiempo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tiempo`;

CREATE TABLE `tiempo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `issue_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `issue_id` (`issue_id`),
  CONSTRAINT `issue_id` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`),
  CONSTRAINT `usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `tiempo` WRITE;
/*!40000 ALTER TABLE `tiempo` DISABLE KEYS */;

INSERT INTO `tiempo` (`id`, `log`, `usuario_id`, `issue_id`, `fecha`, `hora_inicio`, `hora_fin`)
VALUES
	(1,'2:00',2,1,'2019-12-05','13:00:00','15:35:00'),
	(2,'4',1,2,'2019-12-05','10:00:00','10:21:00'),
	(3,'5',3,4,'2019-12-05','09:30:00','10:29:00'),
	(4,'3',2,2,'2019-12-05','10:40:00','11:00:00');

/*!40000 ALTER TABLE `tiempo` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table usuario
# ------------------------------------------------------------

DROP TABLE IF EXISTS `usuario`;

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `nombre` varchar(128) NOT NULL DEFAULT '',
  `apellido` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;

INSERT INTO `usuario` (`id`, `username`, `password`, `nombre`, `apellido`)
VALUES
	(1,'jhony.m','123','Jhony','Moncada'),
	(2,'bryan.v','234','Bryan','Villamil'),
	(3,'ruben.a','345','Ruben','Acosta'),
	(6,'test id 6','striasssng','aSS','string'),
	(7,'Test 2','Pass 2','Test 2 new','Test');

/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
