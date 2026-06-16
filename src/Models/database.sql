CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50),
  `mobile` VARCHAR(50),
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'provider', 'secretary') NOT NULL DEFAULT 'provider',
  `api_token` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT
);

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT,
  `name` VARCHAR(100) NOT NULL,
  `duration` INT NOT NULL DEFAULT 30,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `description` TEXT,
  `requires_payment` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `provider_services` (
  `provider_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`provider_id`, `service_id`),
  FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50),
  `address` TEXT,
  `city` VARCHAR(100),
  `zip_code` VARCHAR(20),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `working_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `provider_id` INT NOT NULL,
  `monday` TEXT,
  `tuesday` TEXT,
  `wednesday` TEXT,
  `thursday` TEXT,
  `friday` TEXT,
  `saturday` TEXT,
  `sunday` TEXT,
  FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hash` VARCHAR(100) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `provider_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `start_datetime` DATETIME NOT NULL,
  `end_datetime` DATETIME NOT NULL,
  `notes` TEXT,
  `location` VARCHAR(255),
  `is_unavailable` TINYINT(1) DEFAULT 0,
  `status` ENUM('confirmed', 'canceled', 'completed', 'pending') DEFAULT 'confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key_name` VARCHAR(100) NOT NULL UNIQUE,
  `key_value` TEXT
);

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `appointment_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `gateway` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `webhooks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `secret` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` ENUM('percent', 'fixed') NOT NULL,
  `discount_amount` DECIMAL(10,2) NOT NULL,
  `max_uses` INT DEFAULT 0,
  `used_count` INT DEFAULT 0,
  `valid_until` DATETIME
);
