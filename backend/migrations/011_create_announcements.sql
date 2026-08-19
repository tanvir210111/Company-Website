-- ============================================================================
-- Migration: 011_create_announcements.sql
-- Description: Create announcements table for broad platform notices
-- ============================================================================

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT NOT NULL,
  `target_audience` ENUM('all', 'students', 'clients') NOT NULL DEFAULT 'all',
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ann_audience` (`target_audience`),
  INDEX `idx_ann_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
