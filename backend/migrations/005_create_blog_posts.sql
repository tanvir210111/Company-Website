-- Migration 005: Create blog_posts table
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(180) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(100) DEFAULT 'Media Scope IT Editorial',
  `category` VARCHAR(100) DEFAULT 'Career Guidance',
  `tags` VARCHAR(255) DEFAULT NULL,
  `featured_image` VARCHAR(255) DEFAULT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `views_count` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_category` (`category`),
  INDEX `idx_blog_active` (`is_active`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
