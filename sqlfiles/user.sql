SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE User(
    user_name character PRIMARY KEY,
    full_name character varying(100)
    grad_year integer,
    intended_major character varying(100),
    declared BOOLEAN
)

CREATE TABLE classesTaken(
    course_id integer NOT NULL PRIMARY KEY REFERENCES Offering(course_id),
    cname character varying(100) REFERENCES Courses(cname)
    semester character varying(100) REFERENCES Offering(semester),
    mode REFERENCES Modes_Of_Inquiry(mode),
    area REFERNCES Areas_Of_Knowledge(area)
)

CREATE TABLE classesSeeking(
    course_id integer NOT NULL PRIMARY KEY REFERENCES Offering(course_id),
    cname character varying(100) REFERENCES Courses(cname),
    cdescription NVARCHAR(MAX) REFERENCES Courses(cdescription),
)