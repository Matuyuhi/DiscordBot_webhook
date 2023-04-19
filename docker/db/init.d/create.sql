

-- user作成
CREATE USER 'master'@'%' IDENTIFIED WITH mysql_native_password BY 'master';

create database bot01;
-- 付与
grant all on bot01.* to `master`@`%`;

-- ログの有効化
set global general_log_file = "/var/log/mysql/general.log";
set global general_log = on;

set global wait_timeout=10;
