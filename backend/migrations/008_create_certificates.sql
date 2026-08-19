-- ============================================================================
-- Migration: 008_create_certificates.sql
-- Description: Create certificates table for student course completion verification
-- ============================================================================

CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `certificate_number` VARCHAR(100) NOT NULL UNIQUE,
  `enrollment_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `issue_date` DATE NOT NULL,
  `status` ENUM('active', 'revoked') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cert_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_cert_number` (`certificate_number`),
  INDEX `idx_cert_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
