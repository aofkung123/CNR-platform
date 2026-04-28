-- CNR Platform — MariaDB Init Script
-- This runs once when the db container is first created.

CREATE DATABASE IF NOT EXISTS `cnr_platform`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `cnr_platform`;
