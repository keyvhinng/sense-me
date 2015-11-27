CREATE DATABASE visum
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE DATABASE visum
  DEFAULT CHARACTER SET UTF8mb4
  DEFAULT COLLATE utf8mb4_bin;

CREATE TABLE training_tweets(
id_str varchar(20),
text varchar(255),
created_at TIMESTAMP,
polarity int
);

CREATE TABLE tweets(
id_str varchar(20),
text varchar(255),
created_at TIMESTAMP,
polarity int
);