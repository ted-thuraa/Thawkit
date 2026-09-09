CREATE TABLE `component` (
	`id` varchar(191) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`layers` json NOT NULL,
	`variants` json,
	`variables` json,
	`thumbnail_url` varchar(2048),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `component_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `layer_style` (
	`id` varchar(191) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`style_group` varchar(64),
	`kind` enum('base','combo','global'),
	`classes` text NOT NULL DEFAULT (''),
	`design` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `layer_style_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `page` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `page` MODIFY COLUMN `funnel_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `page` ADD `layers` json NOT NULL;--> statement-breakpoint
ALTER TABLE `component` ADD CONSTRAINT `component_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `layer_style` ADD CONSTRAINT `layer_style_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `component_org_idx` ON `component` (`organization_id`);--> statement-breakpoint
CREATE INDEX `layer_style_org_idx` ON `layer_style` (`organization_id`);--> statement-breakpoint
ALTER TABLE `page` DROP COLUMN `sections`;