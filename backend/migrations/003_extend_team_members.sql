-- Migration 003: Extend team_members table with email, phone, github_url
SET @dbname = DATABASE();

-- Add email column if not exists
SET @preparedStatement1 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'team_members' AND COLUMN_NAME = 'email') > 0,
  "SELECT 1",
  "ALTER TABLE team_members ADD COLUMN email VARCHAR(150) DEFAULT NULL"
));
PREPARE alter1 FROM @preparedStatement1;
EXECUTE alter1;
DEALLOCATE PREPARE alter1;

-- Add phone column if not exists
SET @preparedStatement2 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'team_members' AND COLUMN_NAME = 'phone') > 0,
  "SELECT 1",
  "ALTER TABLE team_members ADD COLUMN phone VARCHAR(50) DEFAULT NULL"
));
PREPARE alter2 FROM @preparedStatement2;
EXECUTE alter2;
DEALLOCATE PREPARE alter2;

-- Add github_url column if not exists
SET @preparedStatement3 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'team_members' AND COLUMN_NAME = 'github_url') > 0,
  "SELECT 1",
  "ALTER TABLE team_members ADD COLUMN github_url VARCHAR(255) DEFAULT NULL"
));
PREPARE alter3 FROM @preparedStatement3;
EXECUTE alter3;
DEALLOCATE PREPARE alter3;
