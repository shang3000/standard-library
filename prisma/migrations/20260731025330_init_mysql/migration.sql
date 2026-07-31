-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(32) NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `format` VARCHAR(10) NOT NULL,
    `pages` INTEGER NOT NULL DEFAULT 0,
    `file_size` VARCHAR(50) NULL,
    `price_stars` INTEGER NOT NULL DEFAULT 0,
    `download_count` INTEGER NOT NULL DEFAULT 0,
    `upload_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cover_image` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `is_vip` BOOLEAN NOT NULL DEFAULT false,

    INDEX `documents_category_id_idx`(`category_id`),
    INDEX `documents_format_idx`(`format`),
    INDEX `documents_upload_time_idx`(`upload_time`),
    INDEX `documents_download_count_idx`(`download_count`),
    INDEX `documents_price_stars_idx`(`price_stars`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `is_vip` BOOLEAN NOT NULL DEFAULT false,
    `stars_balance` INTEGER NOT NULL DEFAULT 50,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `downloads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doc_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `stars_paid` INTEGER NOT NULL DEFAULT 0,
    `downloaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `downloads_user_id_idx`(`user_id`),
    INDEX `downloads_doc_id_idx`(`doc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downloads` ADD CONSTRAINT `downloads_doc_id_fkey` FOREIGN KEY (`doc_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downloads` ADD CONSTRAINT `downloads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
