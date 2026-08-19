-- Migration 004: Extend testimonials table with company and is_active columns
SET @dbname = DATABASE();

-- Add company column if not exists
SET @preparedStatement1 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'company') > 0,
  "SELECT 1",
  "ALTER TABLE testimonials ADD COLUMN company VARCHAR(150) DEFAULT NULL AFTER author_title"
));
PREPARE alter1 FROM @preparedStatement1;
EXECUTE alter1;
DEALLOCATE PREPARE alter1;

-- Add is_active column if not exists
SET @preparedStatement2 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'is_active') > 0,
  "SELECT 1",
  "ALTER TABLE testimonials ADD COLUMN is_active TINYINT(1) DEFAULT 1 AFTER sort_order"
));
PREPARE alter2 FROM @preparedStatement2;
EXECUTE alter2;
DEALLOCATE PREPARE alter2;
