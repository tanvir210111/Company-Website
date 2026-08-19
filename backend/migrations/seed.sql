-- ============================================================================
-- MEDIA SCOPE IT LTD — INITIAL SEED DATA
-- Mapped directly from verified frontend project data (courses, services, site info)
-- ============================================================================

-- 1. Initial Secure Admin User (Role: admin)
INSERT INTO `users` (`full_name`, `email`, `phone`, `password_hash`, `role`, `is_active`)
VALUES (
  'System Administrator',
  'info@mediascopeit.com',
  '01325165451',
  '$2b$10$HV9wkUlYnnqZhfSnRviEv.GtoFvDtYKi04ONko/iIFh5z9.2himPi',
  'admin',
  1
) ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 2. Seed Official Courses (Mapped from src/data/coursesData.js)
INSERT INTO `courses` (`slug`, `title`, `category`, `hours`, `duration`, `regular_fee`, `discount_fee`, `short_desc`, `is_popular`, `is_active`)
VALUES
('graphics-design', 'Professional Graphics Design', 'Graphics & Design', '64 Hours', '3 Months', 22000.00, 15000.00, 'Master Adobe Photoshop, Illustrator, InDesign, UI/UX basics and build a winning design portfolio for international freelancing.', 1, 1),
('web-development', 'Full Stack Web Development', 'Web & Software', '64 Hours', '4 Months', 25000.00, 18000.00, 'Complete web development bootcamp covering HTML5, CSS3, Tailwind, JavaScript ES6+, React.js, Node.js, and MySQL/MongoDB.', 1, 1),
('c-programming', 'C & C++ Programming', 'Programming', '32 Hours', '2 Months', 12500.00, 8500.00, 'Build rock-solid fundamentals in computer science, data structures, algorithm design, and memory management using C/C++.', 0, 1),
('digital-marketing', 'Professional Digital Marketing & SEO', 'Digital Marketing', '64 Hours', '3 Months', 22000.00, 14000.00, 'Comprehensive digital marketing training: Facebook Ads Manager, Meta Pixel, Google Ads PPC, Technical SEO, and Content Strategy.', 1, 1),
('python-programming', 'Python Programming & Django', 'Programming', '64 Hours', '3.5 Months', 24000.00, 16500.00, 'Master Python programming from scratch to full-stack web applications with Django and REST APIs.', 0, 1),
('wordpress-dev', 'WordPress Custom Theme & E-Commerce', 'Web & Software', '48 Hours', '2.5 Months', 18000.00, 12000.00, 'Learn custom WordPress theme development, PHP, Elementor Pro customization, WooCommerce store building, and speed optimization.', 1, 1),
('autocad-3dmax', 'AutoCAD 2D/3D & 3ds Max Interior Design', 'Graphics & Design', '60 Hours', '3 Months', 20000.00, 15000.00, 'Professional training in architectural drafting, structural floor plans, 3D modeling, and V-Ray photorealistic rendering.', 0, 1),
('laravel-dev', 'Laravel PHP Enterprise Software Development', 'Web & Software', '64 Hours', '3.5 Months', 22000.00, 16000.00, 'Build enterprise ERP, POS, and custom management software using PHP 8, Laravel Framework, MySQL, and Vue.js/Livewire.', 0, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `discount_fee` = VALUES(`discount_fee`);

-- 3. Seed Global Site Settings (WordPress-like dynamic CMS options)
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `group_name`)
VALUES
('site_name', 'Media Scope IT Ltd', 'general'),
('site_tagline', 'IT & Software Institute Bangladesh', 'general'),
('contact_email', 'info@mediascopeit.com', 'contact'),
('contact_phone', '+88 01325-165451', 'contact'),
('office_address', 'House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh', 'contact'),
('rjsc_reg_no', 'C-166968/2020', 'legal'),
('trade_license_no', 'TRAD/DSCC/048330/2020', 'legal'),
('tin_no', '125190932932', 'legal'),
('dbid_no', '[DBID NUMBER]', 'legal')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);
