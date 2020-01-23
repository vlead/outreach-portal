CREATE TABLE institute_analytics ( id INT PRIMARY KEY AUTO_INCREMENT, 
    institute_name VARCHAR(128) NOT NULL,
    user_id INT,
    total_workshops INT  NOT NULL,
    total_usage INT  NOT NULL,
    total_participants_attended INT  NOT NULL);

INSERT INTO institute_analytics SELECT 1, "Amrita University", 353,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where user_id=353 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=353));

INSERT INTO institute_analytics SELECT 2, "COEP", 33,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=33 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=33));

INSERT INTO institute_analytics SELECT 3, "DEI Dayalbagh", 20, 
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=20 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=20));

INSERT INTO institute_analytics SELECT 4, "IIIT Hyderabad", 5,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=5 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=5));

INSERT INTO institute_analytics SELECT 5, "IIT Bombay", 12,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=12 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=12));

INSERT INTO institute_analytics SELECT 6, "IIT Delhi", 70,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=70 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=70));

INSERT INTO institute_analytics SELECT 7, "IIT Guwahati", 34,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=34 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=34));

INSERT INTO institute_analytics SELECT 8, "IIT Kanpur", 11,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=11 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=11));

INSERT INTO institute_analytics SELECT 9, "IIT Kharagpur", 285,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=285 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=285));

INSERT INTO institute_analytics SELECT 10, "IIT Roorkee", 21,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=21 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=21));

INSERT INTO institute_analytics SELECT 11, "NITK Surathkal", 334,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=334 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=334));

INSERT INTO institute_analytics SELECT 12, "VLEAD", 546,
COUNT(*), SUM(experiments_conducted),
SUM(participants_attended) from approved_workshops where
user_id=546 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=546));

DROP PROCEDURE refresh_institute_analytics_now;

DELIMITER $$

CREATE PROCEDURE refresh_institute_analytics_now (
    OUT rc INT
)
BEGIN

  TRUNCATE TABLE institute_analytics;

  INSERT INTO institute_analytics SELECT 1, "Amrita University", 353,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=353 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=353 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=353));

  INSERT INTO institute_analytics SELECT 2, "COEP", 33,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=33 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=33 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=33));

  INSERT INTO institute_analytics SELECT 3, "DEI Dayalbagh", 20,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=20 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=20 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=20));

  INSERT INTO institute_analytics SELECT 4, "IIIT Hyderabad", 5,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=5 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=5 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=5));

  INSERT INTO institute_analytics SELECT 5, "IIT Bombay", 12,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=12 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=12 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=12));
 
  INSERT INTO institute_analytics SELECT 6, "IIT Delhi", 70,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=70 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=70 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=70));

  INSERT INTO institute_analytics SELECT 7, "IIT Guwahati", 34,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=34 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=34 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=34));

  INSERT INTO institute_analytics SELECT 8, "IIT Kanpur", 11,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=11 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=11 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=11));

  INSERT INTO institute_analytics SELECT 9, "IIT Kharagpur", 285,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=285 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=285 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=285));

  INSERT INTO institute_analytics SELECT 10, "IIT Roorkee", 21,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=21 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=21 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=21));
  
  INSERT INTO institute_analytics SELECT 11, "NITK Surathkal", 334,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=334 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=334 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=334));

  INSERT INTO institute_analytics SELECT 12, "VLEAD", 546,
  COUNT(*), SUM(experiments_conducted),
  COUNT(*) from nodal_centres where created_by_id=546 and centre_status='Active',
  SUM(participants_attended) from approved_workshops where
  user_id=546 or (user_id in (select user_id from nodal_coordinator_details where created_by_id=546));

  SET rc = 0;
END;
$$

DELIMITER ;

CALL refresh_institute_analytics_now(@rc);

drop table analytics;

CREATE TABLE analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    total_value INT  NOT NULL
);

INSERT INTO analytics SELECT 1, "WORKSHOPS RUN", SUM(total_workshops) FROM institute_analytics where ;
INSERT INTO analytics SELECT 2, "UPCOMING WORKSHOPS", COUNT(*) FROM workshops where status_id=1;
INSERT INTO analytics SELECT 3, "NODAL CENTRES", COUNT(*) FROM nodal_centres where centre_status="Active";
INSERT INTO analytics SELECT 4, "PARTICIPANTS ATTENDED", SUM(total_participants_attended) FROM institute_analytics;
INSERT INTO analytics SELECT 5, "USAGE", SUM(total_usage) FROM institute_analytics;
INSERT INTO analytics SELECT 6, "OC", COUNT(*) FROM users where role_id=2 and user_status='Active';
INSERT INTO analytics SELECT 7, "NC", COUNT(*) FROM users where role_id=3 and user_status='Active';

DROP PROCEDURE refresh_analytics_now;

DELIMITER $$

CREATE PROCEDURE refresh_analytics_now (
    OUT rc INT
)
BEGIN

  TRUNCATE TABLE analytics;

  INSERT INTO analytics SELECT 1, "WORKSHOPS RUN", SUM(total_workshops) FROM institute_analytics;
  INSERT INTO analytics SELECT 2, "UPCOMING WORKSHOPS", COUNT(*) FROM workshops where status_id=1;
  INSERT INTO analytics SELECT 3, "NODAL CENTRES", COUNT(*) FROM nodal_centres where centre_status="Active";
  INSERT INTO analytics SELECT 4, "PARTICIPANTS ATTENDED", SUM(total_participants_attended) FROM institute_analytics;
  INSERT INTO analytics SELECT 5, "USAGE", SUM(total_usage) FROM institute_analytics;
  INSERT INTO analytics SELECT 6, "OC", COUNT(*) FROM users where role_id=2 and user_status='Active';
  INSERT INTO analytics SELECT 7, "NC", COUNT(*) FROM users where role_id=3 and user_status='Active';


  SET rc = 0;
END;
$$

DELIMITER ;

CALL refresh_analytics_now(@rc);

CREATE TABLE nc_analytics ( id INT PRIMARY KEY AUTO_INCREMENT, 
    institute_name VARCHAR(128) NOT NULL,
    user_id INT,
    total_nodal_centres INT  NOT NULL);

INSERT INTO nc_analytics SELECT 1, "Amrita University", 353,
COUNT(*) from nodal_centres where created_by_id=353 and centre_status='Active';

INSERT INTO nc_analytics SELECT 2, "COEP", 33,
COUNT(*) from nodal_centres where created_by_id=33 and centre_status='Active';

INSERT INTO nc_analytics SELECT 3, "DEI Dayalbagh", 20, 
COUNT(*) from nodal_centres where created_by_id=20 and centre_status='Active';

INSERT INTO nc_analytics SELECT 4, "IIIT Hyderabad", 5,
COUNT(*) from nodal_centres where created_by_id=5 and centre_status='Active';

INSERT INTO nc_analytics SELECT 5, "IIT Bombay", 12,
COUNT(*) from nodal_centres where created_by_id=12 and centre_status='Active';

INSERT INTO nc_analytics SELECT 6, "IIT Delhi", 70,
COUNT(*) from nodal_centres where created_by_id=70 and centre_status='Active';

INSERT INTO nc_analytics SELECT 7, "IIT Guwahati", 34,
COUNT(*) from nodal_centres where created_by_id=34 and centre_status='Active';

INSERT INTO nc_analytics SELECT 8, "IIT Kanpur", 11,
COUNT(*) from nodal_centres where created_by_id=11 and centre_status='Active';

INSERT INTO nc_analytics SELECT 9, "IIT Kharagpur", 285,
COUNT(*) from nodal_centres where created_by_id=285 and centre_status='Active';

INSERT INTO nc_analytics SELECT 10, "IIT Roorkee", 21,
COUNT(*) from nodal_centres where created_by_id=21 and centre_status='Active';

INSERT INTO nc_analytics SELECT 11, "NITK Surathkal", 334,
COUNT(*) from nodal_centres where created_by_id=334 and centre_status='Active';

INSERT INTO nc_analytics SELECT 12, "VLEAD", 546,
COUNT(*) from nodal_centres where created_by_id=546 and centre_status='Active';

DROP PROCEDURE refresh_nc_analytics_now;

DELIMITER $$

CREATE PROCEDURE refresh_nc_analytics_now (
    OUT rc INT
)
BEGIN

  TRUNCATE TABLE nc_analytics;

  INSERT INTO nc_analytics SELECT 1, "Amrita University", 353, COUNT(*) from nodal_centres where created_by_id=353 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 2, "COEP", 33, COUNT(*) from nodal_centres where created_by_id=33 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 3, "DEI Dayalbagh", 20, COUNT(*) from nodal_centres where created_by_id=20 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 4, "IIIT Hyderabad", 5, COUNT(*) from nodal_centres where created_by_id=5 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 5, "IIT Bombay", 12, COUNT(*) from nodal_centres where created_by_id=12 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 6, "IIT Delhi", 70, COUNT(*) from nodal_centres where created_by_id=70 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 7, "IIT Guwahati", 34, COUNT(*) from nodal_centres where created_by_id=34 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 8, "IIT Kanpur", 11, COUNT(*) from nodal_centres where created_by_id=11 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 9, "IIT Kharagpur", 285, COUNT(*) from nodal_centres where created_by_id=285 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 10, "IIT Roorkee", 21, COUNT(*) from nodal_centres where created_by_id=21 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 11, "NITK Surathkal", 334, COUNT(*) from nodal_centres where created_by_id=334 and centre_status='Active';
  INSERT INTO nc_analytics SELECT 12, "VLEAD", 546, COUNT(*) from nodal_centres where created_by_id=546 and centre_status='Active';

  SET rc = 0;

END;
$$

DELIMITER ;

CALL refresh_nc_analytics_now(@rc);

drop view approved_workshops;
CREATE VIEW approved_workshops AS SELECT * from workshops where status_id=3 and workshop_status="Active";
