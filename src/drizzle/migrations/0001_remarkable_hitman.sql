ALTER TABLE `account` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `account_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `provider_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `scope` varchar(255);--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `password` varchar(255);--> statement-breakpoint
ALTER TABLE `subscription` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` MODIFY COLUMN `status` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` MODIFY COLUMN `cancel_at_period_end` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `organization_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `role` varchar(255);--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `status` varchar(255) NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `invitation` MODIFY COLUMN `inviter_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `organization_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `role` varchar(255) NOT NULL DEFAULT 'member';--> statement-breakpoint
ALTER TABLE `organization` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `organization` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `organization` MODIFY COLUMN `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `organization` MODIFY COLUMN `logo` varchar(255);--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `name` varchar(255);--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `credential_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `device_type` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `transports` varchar(255);--> statement-breakpoint
ALTER TABLE `passkey` MODIFY COLUMN `aaguid` varchar(255);--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `token` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `ip_address` varchar(255);--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `user_agent` varchar(255);--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `impersonated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `active_organization_id` varchar(255);--> statement-breakpoint
ALTER TABLE `two_factor` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `two_factor` MODIFY COLUMN `secret` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `two_factor` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `image` varchar(255);--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `role` varchar(255);--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `ban_reason` varchar(255);--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `stripe_customer_id` varchar(255);--> statement-breakpoint
ALTER TABLE `verification` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` MODIFY COLUMN `identifier` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` MODIFY COLUMN `value` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `amount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `currency` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `recurring_interval` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `current_period_start` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `current_period_end` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `canceled_at` timestamp;--> statement-breakpoint
ALTER TABLE `subscription` ADD `started_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `ends_at` timestamp;--> statement-breakpoint
ALTER TABLE `subscription` ADD `ended_at` timestamp;--> statement-breakpoint
ALTER TABLE `subscription` ADD `customer_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `product_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `discount_id` varchar(255);--> statement-breakpoint
ALTER TABLE `subscription` ADD `checkout_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `customer_cancellation_reason` text;--> statement-breakpoint
ALTER TABLE `subscription` ADD `customer_cancellation_comment` text;--> statement-breakpoint
ALTER TABLE `subscription` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `subscription` ADD `custom_field_data` text;--> statement-breakpoint
ALTER TABLE `subscription` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `modified_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `plan`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `reference_id`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `stripe_customer_id`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `stripe_subscription_id`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `period_start`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `period_end`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `trial_start`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `trial_end`;--> statement-breakpoint
ALTER TABLE `subscription` DROP COLUMN `seats`;