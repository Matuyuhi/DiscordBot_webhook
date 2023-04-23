

-- user作成
CREATE USER 'master'@'%' IDENTIFIED WITH mysql_native_password BY 'master';

create database bot01;

use bot01;

CREATE TABLE `linkList` (
  `name` varchar(255) DEFAULT NULL,
  `discription` varchar(255) DEFAULT NULL,
  `id` varchar(255) DEFAULT NULL,
  `gitname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `serverList` (
  `name` varchar(255) DEFAULT NULL,
  `guildId` varchar(255) DEFAULT NULL,
  `channelId` varchar(255) DEFAULT NULL,
  `html_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- 付与
grant all on bot01.* to `master`@`%`;

-- ログの有効化
set global general_log_file = "/var/log/mysql/general.log";
set global general_log = on;

set global wait_timeout=10;
