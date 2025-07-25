CREATE TABLE `chronostamp_claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userAddress` text(42) NOT NULL,
	`eventId` text NOT NULL,
	`tokenId` text,
	`transactionHash` text(66),
	`claimedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_address_idx` ON `chronostamp_claims` (`userAddress`);--> statement-breakpoint
CREATE INDEX `event_id_idx` ON `chronostamp_claims` (`eventId`);--> statement-breakpoint
CREATE INDEX `claimed_at_idx` ON `chronostamp_claims` (`claimedAt`);--> statement-breakpoint
CREATE TABLE `chronostamp_events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text NOT NULL,
	`contractAddress` text(42),
	`eventCode` text(50) NOT NULL,
	`organizer` text(42) NOT NULL,
	`eventDate` integer NOT NULL,
	`totalClaimed` integer DEFAULT 0 NOT NULL,
	`maxSupply` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chronostamp_events_eventCode_unique` ON `chronostamp_events` (`eventCode`);--> statement-breakpoint
CREATE INDEX `event_code_idx` ON `chronostamp_events` (`eventCode`);--> statement-breakpoint
CREATE INDEX `organizer_idx` ON `chronostamp_events` (`organizer`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `chronostamp_events` (`createdAt`);--> statement-breakpoint
CREATE TABLE `chronostamp_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `chronostamp_post` (`name`);