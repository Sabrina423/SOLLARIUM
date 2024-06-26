-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: bidvquas07dy64qsdag8-mysql.services.clever-cloud.com    Database: bidvquas07dy64qsdag8
-- ------------------------------------------------------
-- Server version	8.0.15-5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'f41d366d-91e5-11e9-8525-cecd028ee826:1-139443038';

--
-- Table structure for table `CLIENTE`
--

DROP TABLE IF EXISTS `CLIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENTE` (
  `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `CPF_CLIENTE` char(11) NOT NULL,
  `ENDERECO_CLIENTE` varchar(45) DEFAULT NULL,
  `NOME_CLIENTE` varchar(45) NOT NULL,
  `CONTATO_CLIENTE` char(14) NOT NULL,
  `EMAIL_CLIENTE` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_CLIENTE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENTE`
--

LOCK TABLES `CLIENTE` WRITE;
/*!40000 ALTER TABLE `CLIENTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FEEDBACK`
--

DROP TABLE IF EXISTS `FEEDBACK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FEEDBACK` (
  `ID_FEEDBACK` int(11) NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int(11) NOT NULL,
  `ID_PROF` int(11) NOT NULL,
  `CLASSIF_FEEDBACK` int(11) NOT NULL,
  `COMENTARIO_FEEDBACK` varchar(45) NOT NULL,
  `DATA_FEEDBACK` date NOT NULL,
  `ITEM_PEDIDO_PEDIDOS_ID_PEDIDOS` int(11) NOT NULL,
  `ITEM_PEDIDO_PEDIDOS_ID_CLIENTE` int(11) NOT NULL,
  `ITEM_PEDIDO_SERVICOS_PROF_ID_SERVICO` int(11) NOT NULL,
  `ITEM_PEDIDO_SERVICOS_PROF_ID_PROF` int(11) NOT NULL,
  PRIMARY KEY (`ID_FEEDBACK`),
  KEY `fk_FEEDBACK_ITEM_PEDIDO1_idx` (`ITEM_PEDIDO_PEDIDOS_ID_PEDIDOS`,`ITEM_PEDIDO_PEDIDOS_ID_CLIENTE`,`ITEM_PEDIDO_SERVICOS_PROF_ID_SERVICO`,`ITEM_PEDIDO_SERVICOS_PROF_ID_PROF`) /*!80000 INVISIBLE */,
  KEY `fk_FEEDBACK_ITEM_PEDIDO1` (`ITEM_PEDIDO_PEDIDOS_ID_PEDIDOS`,`ITEM_PEDIDO_SERVICOS_PROF_ID_SERVICO`),
  CONSTRAINT `fk_FEEDBACK_ITEM_PEDIDO1` FOREIGN KEY (`ITEM_PEDIDO_PEDIDOS_ID_PEDIDOS`, `ITEM_PEDIDO_SERVICOS_PROF_ID_SERVICO`) REFERENCES `ITEM_PEDIDO` (`PEDIDOS_ID_PEDIDOS`, `SERVICOS_PROF_ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FEEDBACK`
--

LOCK TABLES `FEEDBACK` WRITE;
/*!40000 ALTER TABLE `FEEDBACK` DISABLE KEYS */;
/*!40000 ALTER TABLE `FEEDBACK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ITEM_PEDIDO`
--

DROP TABLE IF EXISTS `ITEM_PEDIDO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ITEM_PEDIDO` (
  `PEDIDOS_ID_PEDIDOS` int(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` int(11) NOT NULL,
  `PROFISSIONAIS_ID_PROF` int(11) NOT NULL,
  PRIMARY KEY (`PEDIDOS_ID_PEDIDOS`,`SERVICOS_PROF_ID_SERVICO`),
  KEY `fk_PEDIDOS_has_SERVICOS_PROF_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO`),
  KEY `fk_PEDIDOS_has_SERVICOS_PROF_PEDIDOS1_idx` (`PEDIDOS_ID_PEDIDOS`),
  KEY `fk_ITEM_PEDIDO_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF`),
  CONSTRAINT `fk_ITEM_PEDIDO_PROFISSIONAIS1` FOREIGN KEY (`PROFISSIONAIS_ID_PROF`) REFERENCES `PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_PEDIDOS_has_SERVICOS_PROF_PEDIDOS1` FOREIGN KEY (`PEDIDOS_ID_PEDIDOS`) REFERENCES `PEDIDOS` (`ID_PEDIDOS`),
  CONSTRAINT `fk_PEDIDOS_has_SERVICOS_PROF_SERVICOS_PROF1` FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`) REFERENCES `SERVICOS_PROF` (`ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ITEM_PEDIDO`
--

LOCK TABLES `ITEM_PEDIDO` WRITE;
/*!40000 ALTER TABLE `ITEM_PEDIDO` DISABLE KEYS */;
/*!40000 ALTER TABLE `ITEM_PEDIDO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ORCAMENTO`
--

DROP TABLE IF EXISTS `ORCAMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ORCAMENTO` (
  `ID_ORCAMENTO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int(11) NOT NULL,
  `ID_PROF` varchar(45) NOT NULL,
  `VALOR_ORCAMENTO` decimal(10,0) NOT NULL,
  `DESCRICAO_ORCAMENTO` varchar(45) NOT NULL,
  `CLIENTE_ID_CLIENTE` int(11) NOT NULL,
  PRIMARY KEY (`ID_ORCAMENTO`),
  KEY `fk_ORCAMENTO_CLIENTE2_idx` (`CLIENTE_ID_CLIENTE`),
  CONSTRAINT `fk_ORCAMENTO_CLIENTE2` FOREIGN KEY (`CLIENTE_ID_CLIENTE`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ORCAMENTO`
--

LOCK TABLES `ORCAMENTO` WRITE;
/*!40000 ALTER TABLE `ORCAMENTO` DISABLE KEYS */;
/*!40000 ALTER TABLE `ORCAMENTO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PAGAMENTOS`
--

DROP TABLE IF EXISTS `PAGAMENTOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PAGAMENTOS` (
  `ID_PAGAMENTO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_PROF` int(11) NOT NULL,
  `ID_CLIENTE` int(11) NOT NULL,
  `VALOR_PAGAMENTO` decimal(10,0) NOT NULL,
  `DATA_PAGAMENTO` date NOT NULL,
  `DESCRICAO_PAGAMENTO` varchar(45) NOT NULL,
  `COMISSAO_PAGAMENTO` decimal(10,0) NOT NULL,
  `PEDIDOS_ID_PEDIDOS` int(11) NOT NULL,
  PRIMARY KEY (`ID_PAGAMENTO`),
  KEY `fk_PAGAMENTOS_PEDIDOS1_idx` (`PEDIDOS_ID_PEDIDOS`),
  CONSTRAINT `fk_PAGAMENTOS_PEDIDOS1` FOREIGN KEY (`PEDIDOS_ID_PEDIDOS`) REFERENCES `PEDIDOS` (`ID_PEDIDOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PAGAMENTOS`
--

LOCK TABLES `PAGAMENTOS` WRITE;
/*!40000 ALTER TABLE `PAGAMENTOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PAGAMENTOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PEDIDOS`
--

DROP TABLE IF EXISTS `PEDIDOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PEDIDOS` (
  `ID_PEDIDOS` int(11) NOT NULL AUTO_INCREMENT,
  `CLIENTE_ID_CLIENTE` int(11) NOT NULL,
  `ID_AGENDA` datetime NOT NULL,
  `DATA_PEDIDO` datetime DEFAULT NULL,
  `VALOR_TOTAL_PEDIDO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_PEDIDOS`),
  UNIQUE KEY `ID_PEDIDOS_UNIQUE` (`ID_PEDIDOS`),
  UNIQUE KEY `ID_AGENDA_UNIQUE` (`ID_AGENDA`),
  UNIQUE KEY `CLIENTE_ID_CLIENTE_UNIQUE` (`CLIENTE_ID_CLIENTE`),
  UNIQUE KEY `DATA_PEDIDO_UNIQUE` (`DATA_PEDIDO`),
  UNIQUE KEY `VALOR_TOTAL_PEDIDO_UNIQUE` (`VALOR_TOTAL_PEDIDO`),
  KEY `fk_PEDIDOS_CLIENTE1_idx` (`CLIENTE_ID_CLIENTE`),
  CONSTRAINT `fk_PEDIDOS_CLIENTE1` FOREIGN KEY (`CLIENTE_ID_CLIENTE`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PEDIDOS`
--

LOCK TABLES `PEDIDOS` WRITE;
/*!40000 ALTER TABLE `PEDIDOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PEDIDOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROFISSIONAIS`
--

DROP TABLE IF EXISTS `PROFISSIONAIS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROFISSIONAIS` (
  `ID_PROF` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_PROF` varchar(25) NOT NULL,
  `CONTATO_PROF` char(15) NOT NULL,
  `EMAIL_PROF` varchar(45) NOT NULL,
  `ENDERECO_PROF` varchar(45) NOT NULL,
  `CPF_PROF` varchar(11) NOT NULL,
  `DATA_NASC` date NOT NULL,
  `DOCUMENTO_PROF` text NOT NULL,
  PRIMARY KEY (`ID_PROF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROFISSIONAIS`
--

LOCK TABLES `PROFISSIONAIS` WRITE;
/*!40000 ALTER TABLE `PROFISSIONAIS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PROFISSIONAIS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROF_HAS_SERVICOS`
--

DROP TABLE IF EXISTS `PROF_HAS_SERVICOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROF_HAS_SERVICOS` (
  `PROFISSIONAIS_ID_PROF` int(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` int(11) NOT NULL,
  `SERVICOS_PROF_ID_PROF` int(11) NOT NULL,
  PRIMARY KEY (`PROFISSIONAIS_ID_PROF`,`SERVICOS_PROF_ID_SERVICO`,`SERVICOS_PROF_ID_PROF`),
  KEY `fk_PROFISSIONAIS_has_SERVICOS_PROF_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO`,`SERVICOS_PROF_ID_PROF`),
  KEY `fk_PROFISSIONAIS_has_SERVICOS_PROF_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF`),
  CONSTRAINT `fk_PROFISSIONAIS_has_SERVICOS_PROF_PROFISSIONAIS1` FOREIGN KEY (`PROFISSIONAIS_ID_PROF`) REFERENCES `PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_PROFISSIONAIS_has_SERVICOS_PROF_SERVICOS_PROF1` FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`) REFERENCES `SERVICOS_PROF` (`ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROF_HAS_SERVICOS`
--

LOCK TABLES `PROF_HAS_SERVICOS` WRITE;
/*!40000 ALTER TABLE `PROF_HAS_SERVICOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PROF_HAS_SERVICOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SERVICOS_PROF`
--

DROP TABLE IF EXISTS `SERVICOS_PROF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SERVICOS_PROF` (
  `ID_SERVICO` int(11) NOT NULL AUTO_INCREMENT,
  `VALOR_SERVICO` decimal(10,0) NOT NULL,
  `TITULO_SERVICO` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SERVICOS_PROF`
--

LOCK TABLES `SERVICOS_PROF` WRITE;
/*!40000 ALTER TABLE `SERVICOS_PROF` DISABLE KEYS */;
/*!40000 ALTER TABLE `SERVICOS_PROF` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_orcamento`
--

DROP TABLE IF EXISTS `item_orcamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_orcamento` (
  `ORCAMENTO_ID_ORCAMENTO` int(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` int(11) NOT NULL,
  `PROFISSIONAIS_ID_PROF` int(11) NOT NULL,
  KEY `fk_item_orcamento_ORCAMENTO1_idx` (`ORCAMENTO_ID_ORCAMENTO`),
  KEY `fk_item_orcamento_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO`),
  KEY `fk_item_orcamento_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF`),
  CONSTRAINT `fk_item_orcamento_ORCAMENTO1` FOREIGN KEY (`ORCAMENTO_ID_ORCAMENTO`) REFERENCES `ORCAMENTO` (`ID_ORCAMENTO`),
  CONSTRAINT `fk_item_orcamento_PROFISSIONAIS1` FOREIGN KEY (`PROFISSIONAIS_ID_PROF`) REFERENCES `PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_item_orcamento_SERVICOS_PROF1` FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`) REFERENCES `SERVICOS_PROF` (`ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_orcamento`
--

LOCK TABLES `item_orcamento` WRITE;
/*!40000 ALTER TABLE `item_orcamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_orcamento` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-26 10:54:10
