ALTER TABLE `chronostamp_events` ADD `locationLatitude` real;--> statement-breakpoint
ALTER TABLE `chronostamp_events` ADD `locationLongitude` real;--> statement-breakpoint
ALTER TABLE `chronostamp_events` ADD `locationRadius` integer DEFAULT 4000;--> statement-breakpoint
ALTER TABLE `chronostamp_events` ADD `locationName` text;