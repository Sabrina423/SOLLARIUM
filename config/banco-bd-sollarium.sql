-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bidvquas07dy64qsdag8
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bidvquas07dy64qsdag8
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bidvquas07dy64qsdag8` DEFAULT CHARACTER SET utf8 ;
USE `bidvquas07dy64qsdag8` ;

-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`ADM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`ADM` (
  `ID_ADM` INT(11) NOT NULL,
  `CPF_ADM` CHAR(15) NOT NULL,
  `CEP_ADM` CHAR(8) NOT NULL,
  `NOME_ADM` VARCHAR(45) NOT NULL,
  `CONTATO_ADM` VARCHAR(45) NOT NULL,
  `EMAIL_ADM` VARCHAR(60) NOT NULL,
  `SENHA_CLIENTE` CHAR(60) NOT NULL,
  `IMAGEM_ADM` BLOB NOT NULL,
  PRIMARY KEY (`ID_ADM`),
  UNIQUE INDEX `ID_ADM_UNIQUE` (`ID_ADM` ASC) VISIBLE,
  UNIQUE INDEX `CPF_ADM_UNIQUE` (`CPF_ADM` ASC) VISIBLE,
  UNIQUE INDEX `CONTATO_ADM_UNIQUE` (`CONTATO_ADM` ASC) VISIBLE,
  UNIQUE INDEX `EMAIL_ADM_UNIQUE` (`EMAIL_ADM` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`CLIENTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`CLIENTE` (
  `ID_CLIENTE` INT(11) NOT NULL AUTO_INCREMENT,
  `CPF_CLIENTE` CHAR(15) NOT NULL,
  `CEP_CLIENTE` CHAR(9) NOT NULL,
  `NOME_CLIENTE` VARCHAR(45) NOT NULL,
  `CONTATO_CLIENTE` VARCHAR(45) NOT NULL,
  `EMAIL_CLIENTE` VARCHAR(60) NOT NULL,
  `SENHA_CLIENTE` CHAR(60) NOT NULL,
  `IMAGEM_PERFIL_CLIENTE` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`ID_CLIENTE`),
  UNIQUE INDEX `CPF_CLIENTE_UNIQUE` (`CPF_CLIENTE` ASC) VISIBLE,
  UNIQUE INDEX `CONTATO_CLIENTE_UNIQUE` (`CONTATO_CLIENTE` ASC) VISIBLE,
  UNIQUE INDEX `EMAIL_CLIENTE_UNIQUE` (`EMAIL_CLIENTE` ASC) VISIBLE,
  UNIQUE INDEX `SENHA_CLIENTE_UNIQUE` (`SENHA_CLIENTE` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`PROFISSIONAIS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`PROFISSIONAIS` (
  `ID_PROF` INT(11) NOT NULL AUTO_INCREMENT,
  `NOME_PROF` VARCHAR(45) NOT NULL,
  `CONTATO_PROF` CHAR(15) NOT NULL,
  `EMAIL_PROF` VARCHAR(45) NOT NULL,
  `CEP_PROF` CHAR(8) NOT NULL,
  `CPF_PROF` CHAR(15) NOT NULL,
  `DATA_NASC` DATE NOT NULL,
  `LINK_PROF` VARCHAR(45) NOT NULL,
  `SENHA_PROF` CHAR(60) NOT NULL,
  `AREA_PROF` VARCHAR(45) NOT NULL,
  `EXPERIENCIA_PROF` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID_PROF`),
  UNIQUE INDEX `LINK_PROF_UNIQUE` (`LINK_PROF` ASC) VISIBLE,
  UNIQUE INDEX `CONTATO_PROF_UNIQUE` (`CONTATO_PROF` ASC) VISIBLE,
  UNIQUE INDEX `EMAIL_PROF_UNIQUE` (`EMAIL_PROF` ASC) VISIBLE,
  UNIQUE INDEX `CPF_PROF_UNIQUE` (`CPF_PROF` ASC) VISIBLE,
  UNIQUE INDEX `SENHA_PROF_UNIQUE` (`SENHA_PROF` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`PEDIDOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`PEDIDOS` (
  `ID_PEDIDOS` INT(11) NOT NULL AUTO_INCREMENT,
  `CLIENTE_ID_CLIENTE` INT(11) NOT NULL,
  `ID_AGENDA` DATETIME NOT NULL,
  `DATA_PEDIDO` DATETIME NULL DEFAULT NULL,
  `VALOR_TOTAL_PEDIDO` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_PEDIDOS`),
  UNIQUE INDEX `ID_PEDIDOS_UNIQUE` (`ID_PEDIDOS` ASC) VISIBLE,
  UNIQUE INDEX `ID_AGENDA_UNIQUE` (`ID_AGENDA` ASC) VISIBLE,
  UNIQUE INDEX `CLIENTE_ID_CLIENTE_UNIQUE` (`CLIENTE_ID_CLIENTE` ASC) VISIBLE,
  UNIQUE INDEX `DATA_PEDIDO_UNIQUE` (`DATA_PEDIDO` ASC) VISIBLE,
  UNIQUE INDEX `VALOR_TOTAL_PEDIDO_UNIQUE` (`VALOR_TOTAL_PEDIDO` ASC) VISIBLE,
  INDEX `fk_PEDIDOS_CLIENTE1_idx` (`CLIENTE_ID_CLIENTE` ASC) VISIBLE,
  CONSTRAINT `fk_PEDIDOS_CLIENTE1`
    FOREIGN KEY (`CLIENTE_ID_CLIENTE`)
    REFERENCES `bidvquas07dy64qsdag8`.`CLIENTE` (`ID_CLIENTE`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`SERVICOS_PROF`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`SERVICOS_PROF` (
  `ID_SERVICO` INT(11) NOT NULL AUTO_INCREMENT,
  `VALOR_SERVICO` DECIMAL(10,0) NOT NULL,
  `TITULO_SERVICO` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID_SERVICO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`ITEM_PEDIDO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`ITEM_PEDIDO` (
  `PEDIDOS_ID_PEDIDOS` INT(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` INT(11) NOT NULL,
  `PROFISSIONAIS_ID_PROF` INT(11) NOT NULL,
  `ID_ITEM_PEDIDO` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID_ITEM_PEDIDO`),
  INDEX `fk_PEDIDOS_has_SERVICOS_PROF_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO` ASC) VISIBLE,
  INDEX `fk_PEDIDOS_has_SERVICOS_PROF_PEDIDOS1_idx` (`PEDIDOS_ID_PEDIDOS` ASC) VISIBLE,
  INDEX `fk_ITEM_PEDIDO_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF` ASC) VISIBLE,
  CONSTRAINT `fk_ITEM_PEDIDO_PROFISSIONAIS1`
    FOREIGN KEY (`PROFISSIONAIS_ID_PROF`)
    REFERENCES `bidvquas07dy64qsdag8`.`PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_PEDIDOS_has_SERVICOS_PROF_PEDIDOS1`
    FOREIGN KEY (`PEDIDOS_ID_PEDIDOS`)
    REFERENCES `bidvquas07dy64qsdag8`.`PEDIDOS` (`ID_PEDIDOS`),
  CONSTRAINT `fk_PEDIDOS_has_SERVICOS_PROF_SERVICOS_PROF1`
    FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`)
    REFERENCES `bidvquas07dy64qsdag8`.`SERVICOS_PROF` (`ID_SERVICO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`FEEDBACK`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`FEEDBACK` (
  `ID_FEEDBACK` INT(11) NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` INT(11) NOT NULL,
  `ID_PROF` INT(11) NOT NULL,
  `CLASSIF_FEEDBACK` INT(11) NOT NULL,
  `COMENTARIO_FEEDBACK` VARCHAR(45) NOT NULL,
  `DATA_FEEDBACK` DATE NOT NULL,
  `ITEM_PEDIDO_PEDIDOS_ID_CLIENTE` INT(11) NOT NULL,
  `ITEM_PEDIDO_SERVICOS_PROF_ID_PROF` INT(11) NOT NULL,
  `ITEM_PEDIDO_ID_ITEM_PEDIDO` INT(11) NOT NULL,
  PRIMARY KEY (`ID_FEEDBACK`),
  INDEX `fk_FEEDBACK_ITEM_PEDIDO1_idx` (`ITEM_PEDIDO_PEDIDOS_ID_CLIENTE` ASC, `ITEM_PEDIDO_SERVICOS_PROF_ID_PROF` ASC) INVISIBLE,
  INDEX `fk_FEEDBACK_ITEM_PEDIDO1_idx1` (`ITEM_PEDIDO_ID_ITEM_PEDIDO` ASC) VISIBLE,
  CONSTRAINT `fk_FEEDBACK_ITEM_PEDIDO1`
    FOREIGN KEY (`ITEM_PEDIDO_ID_ITEM_PEDIDO`)
    REFERENCES `bidvquas07dy64qsdag8`.`ITEM_PEDIDO` (`ID_ITEM_PEDIDO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`ORCAMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`ORCAMENTO` (
  `ID_ORCAMENTO` INT(11) NOT NULL AUTO_INCREMENT,
  `VALOR_ORCAMENTO` DECIMAL(10,0) NOT NULL,
  `DESCRICAO_ORCAMENTO` VARCHAR(45) NOT NULL,
  `DATA_ORCAMENTO` DATETIME NOT NULL,
  `CLIENTE_ID_CLIENTE` INT(11) NOT NULL,
  `STATUS_ORCAMENTO` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_ORCAMENTO`),
  INDEX `fk_ORCAMENTO_CLIENTE1_idx` (`CLIENTE_ID_CLIENTE` ASC) VISIBLE,
  CONSTRAINT `fk_ORCAMENTO_CLIENTE1`
    FOREIGN KEY (`CLIENTE_ID_CLIENTE`)
    REFERENCES `bidvquas07dy64qsdag8`.`CLIENTE` (`ID_CLIENTE`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`PAGAMENTOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`PAGAMENTOS` (
  `ID_PAGAMENTO` INT(11) NOT NULL AUTO_INCREMENT,
  `ID_PROF` INT(11) NOT NULL,
  `ID_CLIENTE` INT(11) NOT NULL,
  `VALOR_PAGAMENTO` DECIMAL(10,0) NOT NULL,
  `DATA_PAGAMENTO` DATE NOT NULL,
  `DESCRICAO_PAGAMENTO` VARCHAR(45) NOT NULL,
  `COMISSAO_PAGAMENTO` DECIMAL(10,0) NOT NULL,
  `PEDIDOS_ID_PEDIDOS` INT(11) NOT NULL,
  PRIMARY KEY (`ID_PAGAMENTO`),
  INDEX `fk_PAGAMENTOS_PEDIDOS1_idx` (`PEDIDOS_ID_PEDIDOS` ASC) VISIBLE,
  CONSTRAINT `fk_PAGAMENTOS_PEDIDOS1`
    FOREIGN KEY (`PEDIDOS_ID_PEDIDOS`)
    REFERENCES `bidvquas07dy64qsdag8`.`PEDIDOS` (`ID_PEDIDOS`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`PROF_HAS_SERVICOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`PROF_HAS_SERVICOS` (
  `PROFISSIONAIS_ID_PROF` INT(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` INT(11) NOT NULL,
  `SERVICOS_PROF_ID_PROF` INT(11) NOT NULL,
  PRIMARY KEY (`SERVICOS_PROF_ID_PROF`),
  INDEX `fk_PROFISSIONAIS_has_SERVICOS_PROF_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO` ASC, `SERVICOS_PROF_ID_PROF` ASC) VISIBLE,
  INDEX `fk_PROFISSIONAIS_has_SERVICOS_PROF_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF` ASC) VISIBLE,
  CONSTRAINT `fk_PROFISSIONAIS_has_SERVICOS_PROF_PROFISSIONAIS1`
    FOREIGN KEY (`PROFISSIONAIS_ID_PROF`)
    REFERENCES `bidvquas07dy64qsdag8`.`PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_PROFISSIONAIS_has_SERVICOS_PROF_SERVICOS_PROF1`
    FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`)
    REFERENCES `bidvquas07dy64qsdag8`.`SERVICOS_PROF` (`ID_SERVICO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bidvquas07dy64qsdag8`.`item_orcamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidvquas07dy64qsdag8`.`item_orcamento` (
  `ORCAMENTO_ID_ORCAMENTO` INT(11) NOT NULL,
  `SERVICOS_PROF_ID_SERVICO` INT(11) NOT NULL,
  `PROFISSIONAIS_ID_PROF` INT(11) NOT NULL,
  `QTDE_ORCAMENTO` VARCHAR(45) NOT NULL,
  `SUBTOTAL_ORCAMENTO` DECIMAL(10,0) NOT NULL,
  INDEX `fk_item_orcamento_ORCAMENTO1_idx` (`ORCAMENTO_ID_ORCAMENTO` ASC) VISIBLE,
  INDEX `fk_item_orcamento_SERVICOS_PROF1_idx` (`SERVICOS_PROF_ID_SERVICO` ASC) VISIBLE,
  INDEX `fk_item_orcamento_PROFISSIONAIS1_idx` (`PROFISSIONAIS_ID_PROF` ASC) VISIBLE,
  CONSTRAINT `fk_item_orcamento_ORCAMENTO1`
    FOREIGN KEY (`ORCAMENTO_ID_ORCAMENTO`)
    REFERENCES `bidvquas07dy64qsdag8`.`ORCAMENTO` (`ID_ORCAMENTO`),
  CONSTRAINT `fk_item_orcamento_PROFISSIONAIS1`
    FOREIGN KEY (`PROFISSIONAIS_ID_PROF`)
    REFERENCES `bidvquas07dy64qsdag8`.`PROFISSIONAIS` (`ID_PROF`),
  CONSTRAINT `fk_item_orcamento_SERVICOS_PROF1`
    FOREIGN KEY (`SERVICOS_PROF_ID_SERVICO`)
    REFERENCES `bidvquas07dy64qsdag8`.`SERVICOS_PROF` (`ID_SERVICO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
