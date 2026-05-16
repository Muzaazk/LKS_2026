-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 10 Apr 2026 pada 07.24
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_company`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `society_id` bigint(20) UNSIGNED DEFAULT NULL,
  `car_id` bigint(20) UNSIGNED DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `nominal` decimal(10,0) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `apply_status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `applications`
--

INSERT INTO `applications` (`id`, `society_id`, `car_id`, `month`, `nominal`, `notes`, `apply_status`, `created_at`) VALUES
(2, 10, 1, 12, 900000000, 'this car is interested', 'pending', '2026-04-04 11:54:12'),
(4, 10, 2, 12, 9000000000, 'this car is interested', 'pending', '2026-04-07 03:33:43'),
(5, 11, 2, 12, 9000000000, 'this car is interested', 'pending', '2026-04-10 05:13:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `available_months`
--

CREATE TABLE `available_months` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `car_id` bigint(20) UNSIGNED DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `available_months`
--

INSERT INTO `available_months` (`id`, `car_id`, `month`, `description`) VALUES
(1, 1, 12, '12 month'),
(2, 1, 6, '6 month'),
(4, 2, 12, '12 month'),
(5, 2, 12, '12 month');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cars`
--

CREATE TABLE `cars` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `car_name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `cars`
--

INSERT INTO `cars` (`id`, `car_name`, `brand`, `price`, `description`) VALUES
(1, 'Toyota FT 86', 'Toyota', 900000000.00, 'Toyota FT 86 car is the best'),
(2, 'Ferrari', 'ferrari', 9000000000.00, 'Ferrari is the best car'),
(3, 'Ferrari', 'ferrari', 9000000000.00, 'Ferrari is the best car');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_04_01_001854_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Society', 3, 'api-token', 'b9bbece907dc197f21ee72d54ee470fe114eeda4f23bb88bb5aa244522291b27', '[\"*\"]', NULL, NULL, '2026-04-02 06:10:23', '2026-04-02 06:10:23'),
(2, 'App\\Models\\Society', 3, 'auth_token', '89faab5727805d0ed332394628590670fc4900ad7d245b0c5ff78495e71be546', '[\"*\"]', NULL, NULL, '2026-04-02 06:12:10', '2026-04-02 06:12:10'),
(3, 'App\\Models\\Society', 4, 'api-token', 'f2e1d9b2997a295189532b7979fe2786034d2ae4b48f35e688c7ae3c68500e15', '[\"*\"]', NULL, NULL, '2026-04-02 06:13:51', '2026-04-02 06:13:51'),
(4, 'App\\Models\\Society', 5, 'api-token', '6503b269107cedf87e307922079706c981cc0ee7cecddf65f3d9d00f7948ffb2', '[\"*\"]', NULL, NULL, '2026-04-02 06:14:17', '2026-04-02 06:14:17'),
(5, 'App\\Models\\Society', 6, 'api-token', 'bd9ecbf622f73bd53554c722e902a4eaec09dc28c0714636f8887d97f6d2c075', '[\"*\"]', NULL, NULL, '2026-04-02 06:16:50', '2026-04-02 06:16:50'),
(7, 'App\\Models\\Society', 6, 'auth_token', 'b36ccd187c14a39558af1d43cd9b00d8b6749a7b85acb52e5d0c2f50eb69352f', '[\"*\"]', NULL, NULL, '2026-04-02 06:18:15', '2026-04-02 06:18:15'),
(8, 'App\\Models\\Society', 6, 'auth_token', 'c2544a90108b9cb58d8c40b62f766a0ef302655288573eafa81c9c1d71d56da9', '[\"*\"]', '2026-04-02 18:05:46', NULL, '2026-04-02 16:45:35', '2026-04-02 18:05:46'),
(9, 'App\\Models\\Society', 7, 'api-token', '661c4b9bb46c52c2277f011a9135713819e2de03550971d4942cc781c44cc3c5', '[\"*\"]', NULL, NULL, '2026-04-02 17:33:09', '2026-04-02 17:33:09'),
(10, 'App\\Models\\Society', 6, 'auth_token', '403960d31dc1d77f1206414e5b9190c04151d0d24166cf85ea2cb38a0d81e303', '[\"*\"]', NULL, NULL, '2026-04-02 22:27:09', '2026-04-02 22:27:09'),
(28, 'App\\Models\\Society', 11, 'api-token', '5cbeae5d322f78a96d630a5be841c1625e83cd88af358105cdf8c4b05fe3ed92', '[\"*\"]', '2026-04-09 21:38:43', NULL, '2026-04-09 18:45:47', '2026-04-09 21:38:43'),
(30, 'App\\Models\\Society', 10, 'api-token', 'a0f974997b0f408e071e8c63042e37acbd01e4202531b79bcd6bc9932d655c54', '[\"*\"]', '2026-04-09 23:11:27', NULL, '2026-04-09 22:19:58', '2026-04-09 23:11:27'),
(31, 'App\\Models\\Society', 10, 'api-token', 'ccdfffd5b619b8f5c4c9f2973391c46754edaa041f0320ebfb626453a14563a6', '[\"*\"]', '2026-04-09 23:21:47', NULL, '2026-04-09 23:21:44', '2026-04-09 23:21:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `regionals`
--

CREATE TABLE `regionals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `regionals`
--

INSERT INTO `regionals` (`id`, `province`, `district`) VALUES
(3, 'Jawa Tengah', 'Kebumen');

-- --------------------------------------------------------

--
-- Struktur dari tabel `societies`
--

CREATE TABLE `societies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_card_number` char(8) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `born_date` date DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `regional_id` bigint(20) UNSIGNED DEFAULT NULL,
  `login_tokens` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `societies`
--

INSERT INTO `societies` (`id`, `id_card_number`, `password`, `name`, `born_date`, `gender`, `address`, `regional_id`, `login_tokens`) VALUES
(10, '00000000', '$2y$12$CBCG726OGMtLf5svDOpaEOX12b1/39BWVgmMqmk5m2ObIaMOXwTSC', 'muzamil', '2000-01-01', 'male', 'kebumen', 3, NULL),
(11, '00000001', '$2y$12$R5FdXmlU83gmdrj0tM4rJ.VzF.kaa4pml7MCqn.f4GPl4jl4Ml/O.', 'raffa', '2000-01-01', 'male', 'kebumen', 3, '12|fdgxB29APvqtmvpU4KSqdJmCUXqvkKcxPeBVu8w7a7cdd215');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(6, 'ahmad', '$2y$12$uwawepVd1JjbeYU61eZEwOWRaWG28bm9spDu5E9dkx9MjKsLLKl0a'),
(7, 'naufal', '$2y$12$DUPowX1e5RwjCViOUmfz0u4yh2AxzC7WEgZh.JBp7sNJrrron0pD2');

-- --------------------------------------------------------

--
-- Struktur dari tabel `validations`
--

CREATE TABLE `validations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `society_id` bigint(20) UNSIGNED DEFAULT NULL,
  `validator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `job` varchar(255) DEFAULT NULL,
  `job_description` text DEFAULT NULL,
  `income` varchar(255) DEFAULT NULL,
  `reason_accepted` text DEFAULT NULL,
  `validator_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `validations`
--

INSERT INTO `validations` (`id`, `society_id`, `validator_id`, `status`, `job`, `job_description`, `income`, `reason_accepted`, `validator_notes`) VALUES
(8, 11, 5, 'accepted', 'programmer', NULL, '4000000', 'i want to buy car', NULL),
(11, 10, NULL, 'pending', 'awdaw', NULL, '22323', 'adawda', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `validators`
--

CREATE TABLE `validators` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role` enum('officer','validator') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `validators`
--

INSERT INTO `validators` (`id`, `user_id`, `role`, `name`) VALUES
(5, 6, 'officer', 'ahmad'),
(6, 7, 'validator', 'naufal');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `society_id` (`society_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indeks untuk tabel `available_months`
--
ALTER TABLE `available_months`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indeks untuk tabel `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `regionals`
--
ALTER TABLE `regionals`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `societies`
--
ALTER TABLE `societies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_card_number` (`id_card_number`),
  ADD KEY `regional_id` (`regional_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `validations`
--
ALTER TABLE `validations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `society_id` (`society_id`),
  ADD KEY `validator_id` (`validator_id`);

--
-- Indeks untuk tabel `validators`
--
ALTER TABLE `validators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `available_months`
--
ALTER TABLE `available_months`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `cars`
--
ALTER TABLE `cars`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT untuk tabel `regionals`
--
ALTER TABLE `regionals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `societies`
--
ALTER TABLE `societies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `validations`
--
ALTER TABLE `validations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `validators`
--
ALTER TABLE `validators`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`society_id`) REFERENCES `societies` (`id`),
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Ketidakleluasaan untuk tabel `available_months`
--
ALTER TABLE `available_months`
  ADD CONSTRAINT `available_months_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `societies`
--
ALTER TABLE `societies`
  ADD CONSTRAINT `societies_ibfk_1` FOREIGN KEY (`regional_id`) REFERENCES `regionals` (`id`);

--
-- Ketidakleluasaan untuk tabel `validations`
--
ALTER TABLE `validations`
  ADD CONSTRAINT `validations_ibfk_1` FOREIGN KEY (`society_id`) REFERENCES `societies` (`id`),
  ADD CONSTRAINT `validations_ibfk_2` FOREIGN KEY (`validator_id`) REFERENCES `validators` (`id`);

--
-- Ketidakleluasaan untuk tabel `validators`
--
ALTER TABLE `validators`
  ADD CONSTRAINT `validators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
