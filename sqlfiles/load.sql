
--Example format for the data with this load.sql:
--Down Under Pub,802 W. Main Street
--The Edge,108 Morris Street
--James Joyce Pub,912 W. Main Street
--Satisfaction,905 W. Main Street
--Talk of the Town,108 E. Main Street


\COPY Course(
    course_id,
    cname,
    numbering,
    cdescription,
    is_graded,
    is_discussion,
    is_lecture) 
FROM 'data/Course.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Offering(
    offering_id,
    course_id,
    semester,
    phys_location)
FROM 'data/Offering.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Program (
    program_id,
    pname,
    ptype,
    degree_type,
    school,
    valid_from_yr,
    valid_to_yr) 
FROM 'data/Program.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Program_Reqs(
    program_id,
    course_id,) 
FROM 'data/Program_Reqs.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Program_Course_Subs(
    program_id,
    requirement_course_id,
    substitute_course_id) 
FROM 'data/Program_Course_Subs.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Modes_Of_Inquiry(
    course_id,
    mode)
FROM 'data/Modes_Of_Inquiry.dat' WITH DELIMITER ',' NULL '' CSV

\COPY Areas_Of_Knowledge(
    course_id,
    area)
FROM 'data/Areas_Of_Knowledge.dat' WITH DELIMITER ',' NULL '' CSV
