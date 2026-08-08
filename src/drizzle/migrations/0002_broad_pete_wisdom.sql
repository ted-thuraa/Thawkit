CREATE TABLE `campaign` (
	`id` varchar(191) NOT NULL,
	`ref` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`organization_id` varchar(255) NOT NULL,
	`settings` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expire_date` datetime,
	CONSTRAINT `campaign_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaign_ref_unique` UNIQUE(`ref`)
);
--> statement-breakpoint
CREATE TABLE `funnel` (
	`id` varchar(191) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`campaign_id` varchar(191) NOT NULL,
	`title` varchar(255),
	`description` varchar(255),
	`domain` varchar(191),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`sub_domain_name` varchar(191) NOT NULL,
	`favicon` text,
	CONSTRAINT `funnel_id` PRIMARY KEY(`id`),
	CONSTRAINT `funnel_campaign_id_unique` UNIQUE(`campaign_id`),
	CONSTRAINT `funnel_domain_unique` UNIQUE(`domain`),
	CONSTRAINT `funnel_sub_domain_name_unique` UNIQUE(`sub_domain_name`)
);
--> statement-breakpoint
ALTER TABLE `campaign` ADD CONSTRAINT `campaign_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnel` ADD CONSTRAINT `funnel_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnel` ADD CONSTRAINT `funnel_campaign_id_campaign_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `campaign_org_idx` ON `campaign` (`organization_id`);--> statement-breakpoint
CREATE INDEX `funnel_org_idx` ON `funnel` (`organization_id`);--> statement-breakpoint
CREATE INDEX `funnel_campaign_idx` ON `funnel` (`campaign_id`);