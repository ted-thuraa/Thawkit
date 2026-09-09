CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` varchar(255),
	`password` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` varchar(255),
	`status` varchar(255) NOT NULL DEFAULT 'pending',
	`expires_at` timestamp NOT NULL,
	`inviter_id` varchar(255) NOT NULL,
	CONSTRAINT `invitation_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_org_email_unique_idx` UNIQUE(`organization_id`,`email`)
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL DEFAULT 'member',
	`display_name` varchar(255),
	`created_at` timestamp NOT NULL,
	CONSTRAINT `member_id` PRIMARY KEY(`id`),
	CONSTRAINT `member_org_user_unique_idx` UNIQUE(`organization_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255),
	`logo` varchar(255),
	`created_at` timestamp NOT NULL,
	`metadata` text,
	`status` enum('active','suspended','trial_expired') NOT NULL DEFAULT 'active',
	CONSTRAINT `organization_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `passkey` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`public_key` text NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`credential_id` varchar(255) NOT NULL,
	`counter` int NOT NULL,
	`device_type` varchar(255) NOT NULL,
	`backed_up` boolean NOT NULL,
	`transports` varchar(255),
	`created_at` timestamp,
	`aaguid` varchar(255),
	CONSTRAINT `passkey_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL,
	`ip_address` varchar(255),
	`user_agent` varchar(255),
	`user_id` varchar(255) NOT NULL,
	`impersonated_by` varchar(255),
	`active_organization_id` varchar(255),
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(255) NOT NULL,
	`recurring_interval` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`current_period_start` timestamp NOT NULL,
	`current_period_end` timestamp NOT NULL,
	`cancel_at_period_end` boolean NOT NULL DEFAULT false,
	`canceled_at` timestamp,
	`started_at` timestamp NOT NULL,
	`ends_at` timestamp,
	`ended_at` timestamp,
	`customer_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`discount_id` varchar(255),
	`checkout_id` varchar(255) NOT NULL,
	`customer_cancellation_reason` text,
	`customer_cancellation_comment` text,
	`metadata` text,
	`custom_field_data` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`modified_at` timestamp NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `two_factor` (
	`id` varchar(255) NOT NULL,
	`secret` varchar(255) NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `two_factor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`two_factor_enabled` boolean DEFAULT false,
	`role` varchar(255),
	`banned` boolean DEFAULT false,
	`ban_reason` varchar(255),
	`ban_expires` timestamp,
	`stripe_customer_id` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('draft','live','archived') NOT NULL DEFAULT 'draft',
	`created_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funnels` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`campaign_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `funnels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audience` (
	`id` varchar(191) NOT NULL,
	`funnel_id` varchar(191) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`predicate` json NOT NULL,
	`retroactive` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `audience_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funnel_version` (
	`id` varchar(191) NOT NULL,
	`funnel_id` varchar(191) NOT NULL,
	`version_number` int NOT NULL,
	`compiled_schema` json NOT NULL,
	`is_current` boolean NOT NULL DEFAULT false,
	`published_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `funnel_version_id` PRIMARY KEY(`id`),
	CONSTRAINT `version_funnel_number_idx` UNIQUE(`funnel_id`,`version_number`)
);
--> statement-breakpoint
CREATE TABLE `page` (
	`id` varchar(191) NOT NULL,
	`funnel_id` varchar(191) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`order` int NOT NULL,
	`page_type` enum('landing_page','normal_page','result_page') NOT NULL,
	`is_linear_default` boolean NOT NULL DEFAULT true,
	`seo` json,
	`config` json,
	`sections` json NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`published_at` datetime,
	CONSTRAINT `page_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_funnel_slug_idx` UNIQUE(`funnel_id`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `question_category` (
	`id` varchar(191) NOT NULL,
	`funnel_id` varchar(191) NOT NULL,
	`order` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(32),
	CONSTRAINT `question_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `answer_selection` (
	`id` varchar(191) NOT NULL,
	`submission_id` varchar(191) NOT NULL,
	`organization_id` varchar(191) NOT NULL,
	`section_id` varchar(191) NOT NULL,
	`option_id` varchar(191) NOT NULL,
	CONSTRAINT `answer_selection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `answer` (
	`id` varchar(191) NOT NULL,
	`submission_id` varchar(191) NOT NULL,
	`section_id` varchar(191) NOT NULL,
	`question_type` enum('short_text','long_text','number','scale') NOT NULL,
	`text_value` text,
	`number_value` decimal(15,4),
	CONSTRAINT `answer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audience_membership` (
	`id` varchar(191) NOT NULL,
	`audience_id` varchar(191) NOT NULL,
	`submission_id` varchar(191) NOT NULL,
	`contact_id` varchar(191),
	`joined_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `audience_membership_id` PRIMARY KEY(`id`),
	CONSTRAINT `membership_audience_submission_idx` UNIQUE(`audience_id`,`submission_id`)
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` varchar(191) NOT NULL,
	`organization_id` varchar(191) NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(191),
	`last_name` varchar(191),
	`phone` varchar(64),
	`lead_data` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contact_id` PRIMARY KEY(`id`),
	CONSTRAINT `contact_org_email_idx` UNIQUE(`organization_id`,`email`)
);
--> statement-breakpoint
CREATE TABLE `submission` (
	`id` varchar(191) NOT NULL,
	`organization_id` varchar(191) NOT NULL,
	`funnel_id` varchar(191) NOT NULL,
	`funnel_version_id` varchar(191) NOT NULL,
	`contact_id` varchar(191),
	`is_completed` boolean NOT NULL DEFAULT false,
	`overall_score` int,
	`category_scores` json,
	`calc_results` json,
	`meta` json,
	`started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`completed_at` datetime,
	CONSTRAINT `submission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviter_id_user_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passkey` ADD CONSTRAINT `passkey_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `two_factor` ADD CONSTRAINT `two_factor_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnels` ADD CONSTRAINT `funnels_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnels` ADD CONSTRAINT `funnels_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audience` ADD CONSTRAINT `audience_funnel_id_funnels_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnel_version` ADD CONSTRAINT `funnel_version_funnel_id_funnels_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page` ADD CONSTRAINT `page_funnel_id_funnels_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_category` ADD CONSTRAINT `question_category_funnel_id_funnels_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `answer_selection` ADD CONSTRAINT `answer_selection_submission_id_submission_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submission`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `answer_selection` ADD CONSTRAINT `answer_selection_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `answer` ADD CONSTRAINT `answer_submission_id_submission_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submission`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audience_membership` ADD CONSTRAINT `audience_membership_audience_id_audience_id_fk` FOREIGN KEY (`audience_id`) REFERENCES `audience`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audience_membership` ADD CONSTRAINT `audience_membership_submission_id_submission_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submission`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audience_membership` ADD CONSTRAINT `audience_membership_contact_id_contact_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contact` ADD CONSTRAINT `contact_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submission` ADD CONSTRAINT `submission_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submission` ADD CONSTRAINT `submission_funnel_id_funnels_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submission` ADD CONSTRAINT `submission_funnel_version_id_funnel_version_id_fk` FOREIGN KEY (`funnel_version_id`) REFERENCES `funnel_version`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submission` ADD CONSTRAINT `submission_contact_id_contact_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `invitation_org_status_idx` ON `invitation` (`organization_id`,`status`);--> statement-breakpoint
CREATE INDEX `campaigns_org_status_created_idx` ON `campaigns` (`organization_id`,`status`,`created_at`,`id`);--> statement-breakpoint
CREATE INDEX `funnels_organization_id_idx` ON `funnels` (`organization_id`);--> statement-breakpoint
CREATE INDEX `funnels_campaign_id_idx` ON `funnels` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `audience_funnel_idx` ON `audience` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `version_funnel_idx` ON `funnel_version` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `version_current_idx` ON `funnel_version` (`funnel_id`,`is_current`);--> statement-breakpoint
CREATE INDEX `page_funnel_idx` ON `page` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `page_funnel_order_idx` ON `page` (`funnel_id`,`order`);--> statement-breakpoint
CREATE INDEX `category_funnel_idx` ON `question_category` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `category_funnel_order_idx` ON `question_category` (`funnel_id`,`order`);--> statement-breakpoint
CREATE INDEX `selection_submission_idx` ON `answer_selection` (`submission_id`);--> statement-breakpoint
CREATE INDEX `selection_org_section_option_idx` ON `answer_selection` (`organization_id`,`section_id`,`option_id`);--> statement-breakpoint
CREATE INDEX `answer_submission_idx` ON `answer` (`submission_id`);--> statement-breakpoint
CREATE INDEX `membership_audience_idx` ON `audience_membership` (`audience_id`);--> statement-breakpoint
CREATE INDEX `membership_submission_idx` ON `audience_membership` (`submission_id`);--> statement-breakpoint
CREATE INDEX `membership_contact_idx` ON `audience_membership` (`contact_id`);--> statement-breakpoint
CREATE INDEX `contact_org_idx` ON `contact` (`organization_id`);--> statement-breakpoint
CREATE INDEX `submission_org_idx` ON `submission` (`organization_id`);--> statement-breakpoint
CREATE INDEX `submission_funnel_idx` ON `submission` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `submission_version_idx` ON `submission` (`funnel_version_id`);--> statement-breakpoint
CREATE INDEX `submission_contact_idx` ON `submission` (`contact_id`);