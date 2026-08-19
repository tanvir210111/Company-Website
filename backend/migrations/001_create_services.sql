-- Migration 001: Create services table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Software Products',
  `tagline` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'Code',
  `image_url` VARCHAR(255) DEFAULT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` LONGTEXT DEFAULT NULL,
  `features_json` JSON DEFAULT NULL,
  `cta_text` VARCHAR(100) DEFAULT 'Request Quote',
  `cta_link` VARCHAR(255) DEFAULT '#contact',
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_slug` (`slug`),
  INDEX `idx_services_active` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
