-- Add metadata for locally stored source files. Existing catalog records remain valid without an attached file.
ALTER TABLE `documents`
  ADD COLUMN `storage_key` VARCHAR(255) NULL,
  ADD COLUMN `original_name` VARCHAR(255) NULL,
  ADD COLUMN `mime_type` VARCHAR(100) NULL;

CREATE UNIQUE INDEX `documents_storage_key_key` ON `documents`(`storage_key`);
