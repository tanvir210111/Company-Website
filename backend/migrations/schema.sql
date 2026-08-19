-- ============================================================================
-- MEDIA SCOPE IT LTD — COMPLETE DATABASE SCHEMA (21 TABLES)
-- Target DBMS: MySQL 8.0+ / MariaDB 10.5+
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. USERS (Authentication & Role Management)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'student', 'client') NOT NULL DEFAULT 'student',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. STUDENT_PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `father_name` VARCHAR(150) DEFAULT NULL,
  `mother_name` VARCHAR(150) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,
  `nid_or_birth_cert` VARCHAR(50) DEFAULT NULL,
  `emergency_phone` VARCHAR(30) DEFAULT NULL,
  `education_level` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. CLIENT_PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `client_profiles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `company_name` VARCHAR(200) NOT NULL,
  `designation` VARCHAR(100) DEFAULT NULL,
  `trade_license_no` VARCHAR(100) DEFAULT NULL,
  `tin_no` VARCHAR(100) DEFAULT NULL,
  `bin_no` VARCHAR(100) DEFAULT NULL,
  `office_address` TEXT DEFAULT NULL,
  `website_url` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_client_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. COURSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `hours` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `regular_fee` DECIMAL(10,2) NOT NULL,
  `discount_fee` DECIMAL(10,2) NOT NULL,
  `short_desc` TEXT NOT NULL,
  `full_description` LONGTEXT DEFAULT NULL,
  `curriculum_json` JSON DEFAULT NULL,
  `thumbnail_url` VARCHAR(255) DEFAULT NULL,
  `is_popular` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_course_slug` (`slug`),
  INDEX `idx_course_category` (`category`),
  INDEX `idx_course_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. COURSE_BATCHES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `course_batches` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT UNSIGNED NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `start_date` DATE DEFAULT NULL,
  `class_days` VARCHAR(100) DEFAULT NULL,
  `class_time` VARCHAR(100) DEFAULT NULL,
  `class_mode` ENUM('offline', 'online', 'hybrid') DEFAULT 'offline',
  `total_seats` INT DEFAULT 30,
  `enrolled_count` INT DEFAULT 0,
  `status` ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  CONSTRAINT `fk_batch_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_batch_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. ENROLLMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `enrollment_no` VARCHAR(50) NOT NULL UNIQUE,
  `student_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `batch_id` INT UNSIGNED DEFAULT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `total_fee` DECIMAL(10,2) NOT NULL,
  `paid_amount` DECIMAL(10,2) DEFAULT 0.00,
  `due_amount` DECIMAL(10,2) NOT NULL,
  `class_mode` VARCHAR(50) DEFAULT 'offline',
  `status` ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
  CONSTRAINT `fk_enr_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_enr_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_enr_batch` FOREIGN KEY (`batch_id`) REFERENCES `course_batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_enr_status` (`status`),
  INDEX `idx_enr_payment` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. CERTIFICATES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `certificate_no` VARCHAR(100) NOT NULL UNIQUE,
  `enrollment_id` INT UNSIGNED NOT NULL UNIQUE,
  `student_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `issue_date` DATE NOT NULL,
  `grade_or_score` VARCHAR(50) DEFAULT NULL,
  `verification_code` VARCHAR(100) NOT NULL UNIQUE,
  `pdf_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('valid', 'revoked') DEFAULT 'valid',
  CONSTRAINT `fk_cert_enr` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_cert_no` (`certificate_no`),
  INDEX `idx_cert_code` (`verification_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. SOFTWARE_PROJECTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `software_projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_code` VARCHAR(50) NOT NULL UNIQUE,
  `client_id` INT UNSIGNED NOT NULL,
  `project_title` VARCHAR(200) NOT NULL,
  `service_category` VARCHAR(100) NOT NULL,
  `contract_amount` DECIMAL(12,2) NOT NULL,
  `paid_amount` DECIMAL(12,2) DEFAULT 0.00,
  `due_amount` DECIMAL(12,2) NOT NULL,
  `start_date` DATE DEFAULT NULL,
  `estimated_delivery_date` DATE DEFAULT NULL,
  `status` ENUM('inquiry', 'srs_planning', 'in_development', 'testing', 'delivered', 'cancelled') DEFAULT 'srs_planning',
  CONSTRAINT `fk_prj_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_prj_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. PROJECT_REQUESTS (Website Commercial Software Quotes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT UNSIGNED DEFAULT NULL,
  `contact_name` VARCHAR(150) NOT NULL,
  `contact_email` VARCHAR(150) NOT NULL,
  `contact_phone` VARCHAR(30) NOT NULL,
  `company_name` VARCHAR(200) DEFAULT NULL,
  `service_title` VARCHAR(150) NOT NULL,
  `project_details` TEXT NOT NULL,
  `budget_range` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('new', 'contacted', 'quoted', 'converted', 'rejected') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_req_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_req_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. PROJECT_STATUS_HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_status_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `updated_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hist_project` FOREIGN KEY (`project_id`) REFERENCES `software_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hist_user` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. PAYMENTS (Must belong to EITHER an Enrollment OR a Software Project)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `enrollment_id` INT UNSIGNED DEFAULT NULL,
  `project_id` INT UNSIGNED DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'BDT',
  `payment_gateway` ENUM('sslcommerz', 'manual_bkash', 'manual_nagad', 'bank_transfer') NOT NULL DEFAULT 'sslcommerz',
  `status` ENUM('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pmt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pmt_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pmt_project` FOREIGN KEY (`project_id`) REFERENCES `software_projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  -- EXCLUSIVE RELATIONSHIP CONSTRAINT: Belongs to enrollment OR project, but never both simultaneously!
  CONSTRAINT `chk_pmt_exclusive_relation` CHECK (
    (`enrollment_id` IS NULL AND `project_id` IS NULL) OR
    (`enrollment_id` IS NOT NULL AND `project_id` IS NULL) OR
    (`enrollment_id` IS NULL AND `project_id` IS NOT NULL)
  ),
  INDEX `idx_pmt_order` (`order_id`),
  INDEX `idx_pmt_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. PAYMENT_TRANSACTIONS (SSLCommerz Callbacks & Validation Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `payment_id` INT UNSIGNED NOT NULL,
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `validation_id` VARCHAR(100) DEFAULT NULL,
  `bank_transaction_id` VARCHAR(100) DEFAULT NULL,
  `card_type` VARCHAR(100) DEFAULT NULL,
  `card_issuer` VARCHAR(100) DEFAULT NULL,
  `sslcommerz_status` VARCHAR(50) DEFAULT NULL,
  `raw_response_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_trx_pmt` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_trx_id` (`transaction_id`),
  INDEX `idx_trx_val` (`validation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. CONTACT_MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('system', 'enrollment', 'payment', 'project') DEFAULT 'system',
  `is_read` TINYINT(1) DEFAULT 0,
  `action_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_notif_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. SITE_SETTINGS (WordPress-like Global Dynamic Settings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` LONGTEXT DEFAULT NULL,
  `group_name` VARCHAR(50) DEFAULT 'general',
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 16. PAGES (WordPress-like Dynamic Page Engine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `content_html` LONGTEXT DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_page_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 17. BLOG_POSTS (News & Articles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(180) NOT NULL UNIQUE,
  `title` VARCHAR(250) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `author_id` INT UNSIGNED DEFAULT NULL,
  `thumbnail_url` VARCHAR(255) DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `views_count` INT DEFAULT 0,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_blog_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 18. TEAM_MEMBERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `facebook_url` VARCHAR(255) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  INDEX `idx_team_active` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 19. TESTIMONIALS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(150) NOT NULL,
  `author_title` VARCHAR(150) DEFAULT NULL,
  `rating` DECIMAL(2,1) DEFAULT 5.0,
  `review_text` TEXT NOT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  INDEX `idx_testi_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 20. FAQS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) DEFAULT 'general',
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  INDEX `idx_faq_cat` (`category`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 21. MEDIA (Uploaded Image & Asset Registry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT UNSIGNED NOT NULL,
  `uploaded_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_media_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_media_type` (`file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
