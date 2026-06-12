CREATE DATABASE IF NOT EXISTS ficky_busuk_db;
USE ficky_busuk_db;

-- 1. Users table (Admin)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  schedule VARCHAR(150) NOT NULL,
  image_url TEXT,
  status ENUM('available','unavailable') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(100) NOT NULL,
  pet_name VARCHAR(100) NOT NULL,
  pet_type VARCHAR(100) NOT NULL,
  pet_age VARCHAR(50) NOT NULL,
  service_id INT DEFAULT NULL,
  doctor_id INT DEFAULT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  complaint TEXT NOT NULL,
  notes TEXT,
  status ENUM('pending','approved','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- 5. Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
  paid_at DATETIME NULL,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- 6. Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  pet_name VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread','read') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
