SET time_zone = "+00:00";
CREATE TABLE `guestbook` (
	`name` text NOT NULL,
	`attendance` text NOT NULL,
	`text` text NOT NULL,
	`date` date DEFAULT utc_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;