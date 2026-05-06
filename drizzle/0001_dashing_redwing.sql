CREATE TABLE `analysisResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`userId` int NOT NULL,
	`verdict` varchar(10) NOT NULL,
	`confidence` int NOT NULL,
	`explanation` text,
	`sentimentScore` int,
	`keywords` text,
	`processingSteps` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analysisResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`source` varchar(255),
	`fileType` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsArticles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalAnalyses` int NOT NULL DEFAULT 0,
	`fakeCount` int NOT NULL DEFAULT 0,
	`realCount` int NOT NULL DEFAULT 0,
	`averageConfidence` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userAnalytics_id` PRIMARY KEY(`id`),
	CONSTRAINT `userAnalytics_userId_unique` UNIQUE(`userId`)
);
