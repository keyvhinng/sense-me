INSERT INTO training_tweets (id,status,created_at) VALUES (623382373753864193,'Horroroso Zoológico de Lima sacrificó animales para alimentar a otros', '2015-07-21 06:41:54');
INSERT INTO training_tweets (id,status,created_at) VALUES (523382373753864193,'Humala no ha demostrado ser un buen presidente', '2015-08-21 06:41:54');
INSERT INTO training_tweets (id,status,created_at,polarity) VALUES (423382373753864193,'La moradita de inca kola es insipida', '2015-08-21 06:41:54',1);
INSERT INTO training_tweets (id,status,created_at,polarity) VALUES (223382973953964193,'La moradita de inca kola es insipida', '2015-08-21 06:41:54',1);

UPDATE training_tweets SET polarity=1 WHERE id = 523382373753864193;



INSERT INTO training_tweets (id,status,created_at) VALUES (10,'test10', 0);
DELETE FROM training_tweets WHERE id = 10;
