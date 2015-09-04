# ADD COLUMN
ALTER TABLE tweets ADD COLUMN latitude double precision;
ALTER TABLE tweets ADD COLUMN longitude double precision;
ALTER TABLE tweets ADD COLUMN created_at timestamp;

# INSERT VALUES
INSERT INTO tweets VALUES (623366553313124352,'some text', NULL,NULL,'Tue Jul 21 05:39:57 +0000 2015');

# CHANGE DATATYPE OF A COLUMN
ALTER TABLE tweets ALTER COLUMN id TYPE bigint;

# DELETE ROWS
DELETE FROM tweets;

# DROP COLUMN
ALTER TABLE tweets DROP COLUMN location;

# COPY DATA FROM FILE
COPY earthquake FROM '/Users/keyvhinng/final-year-project/earthquake.csv' DELIMITER ',' CSV;

#QUERY
  #ORBERY BY
  select * from links where submitter_id = 62443 order by submitted_time";
