--
-- PostgreSQL database dump
--
-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


--------------------------------DATABASE TABLES-------------------------------------

CREATE TABLE Course(
    course_id integer NOT NULL PRIMARY KEY,
    cname character varying(100),
    numbering integer,
    cdescription TEXT,
    is_graded BOOLEAN,
    is_discussion BOOLEAN,
    is_lecture BOOLEAN

);

--if the course is not graded (is_graded = false) then it is pass fail
--if the course is not a lecture (is_lecture = false) then it is a seminar

CREATE TABLE Offering(
    offering_id integer NOT NULL PRIMARY KEY,
    course_id integer NOT NULL REFERENCES Course(course_id),
    semester character varying(100),
    phys_location TEXT

);

--Semester types: FALL, SPRING, SUMMER1, SUMMER2

CREATE TABLE Meeting(
    meeting_id integer NOT NULL PRIMARY KEY,
    offering_id integer NOT NULL REFERENCES Offering(offering_id),
    day_of_week character varying(20),
    start_time TIME(0),
    end_time TIME(0)
);

CREATE TABLE Program (
    program_id integer NOT NULL PRIMARY KEY,
    pname character varying(100),
    ptype character varying(100),
    degree_type character varying(100),
    school character varying(100),
    valid_from_yr integer,
    valid_to_yr integer
);

CREATE TABLE Program_Reqs(
    program_id integer NOT NULL REFERENCES Program(program_id),
    course_id integer NOT NULL REFERENCES Course(course_id),
    PRIMARY KEY(program_id, course_id)
);

CREATE TABLE Program_Course_Subs(
    program_id integer NOT NULL,
    requirement_course_id integer NOT NULL,
    substitute_course_id integer NOT NULL,
    PRIMARY KEY(program_id, requirement_course_id, substitute_course_id)

);

CREATE TABLE Modes_Of_Inquiry(
    course_id integer NOT NULL REFERENCES Course(course_id),
    mode character varying(3),
    PRIMARY KEY(course_id, mode)
);

CREATE TABLE Areas_Of_Knowledge(
    course_id integer NOT NULL REFERENCES Course(course_id),
    area character varying(3),
    PRIMARY KEY(course_id, area)
);

--------------------------------ALTER TABLE/CREATE SEQUENCE INFO-------------------------------------

ALTER TABLE Program OWNER TO postgres;

--
-- Name: program_program_id_seq; Type: SEQUENCE; Schema: public; Owner: abbyr
--

CREATE SEQUENCE Program_program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE Program_program_id_seq OWNER TO postgres;

--
-- Name: program_program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abbyr
--

ALTER SEQUENCE Program_program_id_seq OWNED BY Program.program_id;


--
-- Name: program_requirements; Type: TABLE; Schema: public; Owner: abbyr
--

CREATE TABLE Program_requirements (
    program_id integer NOT NULL,
    course_id integer NOT NULL,
    requirement_type character varying(100)
);


ALTER TABLE Program_requirements OWNER TO postgres;

--
-- Name: program program_id; Type: DEFAULT; Schema: public; Owner: abbyr
--

ALTER TABLE ONLY Program ALTER COLUMN program_id SET DEFAULT nextval('Program_program_id_seq'::regclass);



--------------------------------PUTTING INFO INTO THE TABLES-------------------------------------

--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: abbyr
--

COPY Program (program_id, pname, ptype, degree_type, school, valid_from_yr, valid_to_yr) FROM stdin;
1	Ancient Religion & Society: Interdepartmental Major in Classical Studies and Religious Studies	major	B.A.	Trinity	\N	\N
2	African & African American Studies	major	B.A.	Trinity	\N	\N
3	Art History	major	B.A.	Trinity	\N	\N
4	Art History: Architecture	major	B.A.	Trinity	\N	\N
5	Art History: Museum Theory & Practice	major	B.A.	Trinity	\N	\N
6	Art History & Visual Arts	major	B.A.	Trinity	\N	\N
7	Asian and Middle Eastern Studies	major	B.A.	Trinity	\N	\N
8	Biology	major	B.A.	Trinity	\N	\N
9	Biology	major	B.S.	Trinity	\N	\N
10	Biomedical Engineering	major	B.S.E.	Pratt	\N	\N
11	Biophysics	major	B.S.	Trinity	\N	\N
12	Brazilian and Global Portuguese Studies	major	B.A.	Trinity	\N	\N
13	Chemistry	major	B.A.	Trinity	\N	\N
14	Chemistry	major	B.S.	Trinity	\N	\N
15	Civil Engineering	major	B.S.E.	Pratt	\N	\N
16	Classical Civilization	major	B.A.	Trinity	\N	\N
17	Classical Languages	major	B.A.	Trinity	\N	\N
18	Computational Media: Interdepartmental Major in Computer Science and Visual and Media Studies	major	B.A.	Trinity	\N	\N
19	Computer Science	major	B.A.	Trinity	\N	\N
20	Computer Science	major	B.S.	Trinity	\N	\N
21	Cultural Anthropology	major	B.A.	Trinity	\N	\N
22	Dance	major	B.A.	Trinity	\N	\N
23	Earth and Climate Sciences	major	B.S.	Trinity	\N	\N
24	Economics	major	B.S.	Trinity	\N	\N
25	Economics	major	B.A.	Trinity	\N	\N
26	Electrical and Computer Engineering	major	B.S.E.	Pratt	\N	\N
27	English	major	B.A.	Trinity	\N	\N
28	Environmental Engineering	major	B.S.E.	Pratt	\N	\N
29	Environmental Sciences	major	B.S.	Trinity	\N	\N
30	Environmental Sciences and Policy	major	B.A.	Trinity	\N	\N
31	Evolutionary Anthropology	major	B.A.	Trinity	\N	\N
32	French & Francophone Studies	major	B.A.	Trinity	\N	\N
33	Gender, Sexuality, and Feminist Studies	major	B.A.	Trinity	\N	\N
34	German	major	B.A.	Trinity	\N	\N
35	Global Cultural Studies	major	B.A.	Trinity	\N	\N
36	Global Health	major	B.A.	Trinity	\N	\N
37	History	major	B.A.	Trinity	\N	\N
38	Interdepartmental Major in Linguistics and Computer Science	major	B.A.	Trinity	\N	\N
39	Interdepartmental Major in Math and Computer Science on Data Science	major	B.S.	Trinity	\N	\N
40	Interdepartmental Major in Statistics and Computer Science on Data Science	major	B.S.	Trinity	\N	\N
41	Interdisciplinary Engineering & Applied Science (IDEAS)	major	B.S.E.	Pratt	\N	\N
42	International Comparative Studies	major	B.A.	Trinity	\N	\N
43	Italian Studies	major	B.A.	Trinity	\N	\N
44	Linguistics	major	B.A.	Trinity	\N	\N
45	Marine Science & Conservation	major	B.S.	Trinity	\N	\N
46	Mathematics	major	B.S.	Trinity	\N	\N
47	Mathematics	major	B.A.	Trinity	\N	\N
48	Mechanical Engineering	major	B.S.E.	Pratt	\N	\N
49	Medieval and Renaissance Studies	major	B.A.	Trinity	\N	\N
50	Music	major	B.A.	Trinity	\N	\N
51	Neuroscience	major	B.A.	Trinity	\N	\N
52	Neuroscience	major	B.S.	Trinity	\N	\N
53	Philosophy	major	B.A.	Trinity	\N	\N
54	Physics	major	B.A.	Trinity	\N	\N
55	Physics	major	B.S.	Trinity	\N	\N
56	Political Science	major	B.A.	Trinity	\N	\N
57	Program 2	major	B.A.	Trinity	\N	\N
58	Program 2	major	B.S.	Trinity	\N	\N
59	Psychology	major	B.A.	Trinity	\N	\N
60	Public Policy Studies	major	B.A.	Trinity	\N	\N
61	Religious Studies	major	B.A.	Trinity	\N	\N
62	Romance Studies	major	B.A.	Trinity	\N	\N
63	Russian	major	B.A.	Trinity	\N	\N
64	Slavic and Eurasian Studies	major	B.A.	Trinity	\N	\N
65	Sociology	major	B.A.	Trinity	\N	\N
66	Spanish, Latin American, and Latino/a Studies	major	B.A.	Trinity	\N	\N
67	Statistical Science	major	B.A.	Trinity	\N	\N
68	Statistical Science	major	B.S.	Trinity	\N	\N
69	Theater Studies	major	B.A.	Trinity	\N	\N
70	Visual Arts	major	B.A.	Trinity	\N	\N
71	Visual and Media Studies	major	B.A.	Trinity	\N	\N
72	Visual and Media Studies: Cinematic Arts	major	B.A.	Trinity	\N	\N
73	African & African American Studies	minor	\N	Trinity	\N	\N
74	Art History	minor	\N	Trinity	\N	\N
75	Asian American & Diaspora Studies	minor	\N	Trinity	\N	\N
76	Asian and Middle Eastern Studies	minor	\N	Trinity	\N	\N
77	Biology	minor	\N	Trinity	\N	\N
78	Brazilian and Global Portuguese Studies	minor	\N	Trinity	\N	\N
79	Chemistry	minor	\N	Trinity	\N	\N
80	Cinematic Arts	minor	\N	Trinity	\N	\N
81	Classical Archaeology	minor	\N	Trinity	\N	\N
82	Classical Civilization	minor	\N	Trinity	\N	\N
83	Computational Biology and Bioinformatics	minor	\N	Trinity	\N	\N
84	Computational Media	minor	\N	Trinity	\N	\N
85	Computer Science	minor	\N	Trinity	\N	\N
86	Creative Writing	minor	\N	Trinity	\N	\N
87	Cultural Anthropology	minor	\N	Trinity	\N	\N
88	Dance	minor	\N	Trinity	\N	\N
89	Earth and Climate Sciences	minor	\N	Trinity	\N	\N
90	Economics	minor	\N	Trinity	\N	\N
91	Education	minor	\N	Trinity	\N	\N
92	Electrical and Computer Engineering	minor	\N	Pratt	\N	\N
93	Energy Engineering	minor	\N	Pratt	\N	\N
94	English	minor	\N	Trinity	\N	\N
95	Environmental Sciences and Policy	minor	\N	Trinity	\N	\N
96	Evolutionary Anthropology	minor	\N	Trinity	\N	\N
97	Finance	minor	\N	Trinity	\N	\N
98	French & Francophone Studies	minor	\N	Trinity	\N	\N
99	Gender, Sexuality, and Feminist Studies	minor	\N	Trinity	\N	\N
100	German	minor	\N	Trinity	\N	\N
101	Global Cultural Studies	minor	\N	Trinity	\N	\N
102	Global Health	minor	\N	Trinity	\N	\N
103	Greek	minor	\N	Trinity	\N	\N
104	History	minor	\N	Trinity	\N	\N
105	Inequality Studies	minor	\N	Trinity	\N	\N
106	Italian Studies	minor	\N	Trinity	\N	\N
107	Journalism & Media	minor	\N	Trinity	\N	\N
108	Latin	minor	\N	Trinity	\N	\N
109	Linguistics	minor	\N	Trinity	\N	\N
110	Machine Learning & Artificial Intelligence	minor	\N	Trinity	\N	\N
111	Marine Science & Conservation	minor	\N	Trinity	\N	\N
112	Mathematics	minor	\N	Trinity	\N	\N
113	Medical Sociology	minor	\N	Trinity	\N	\N
114	Medieval and Renaissance Studies	minor	\N	Trinity	\N	\N
115	Music	minor	\N	Trinity	\N	\N
116	Musical Theater	minor	\N	Trinity	\N	\N
117	Neuroscience	minor	\N	Trinity	\N	\N
118	Philosophy	minor	\N	Trinity	\N	\N
119	Photography	minor	\N	Trinity	\N	\N
120	Physics	minor	\N	Trinity	\N	\N
121	Polish Culture and Language	minor	\N	Trinity	\N	\N
122	Political Science	minor	\N	Trinity	\N	\N
123	Psychology	minor	\N	Trinity	\N	\N
124	Religious Studies	minor	\N	Trinity	\N	\N
125	Russian and East European Literatures in Translation	minor	\N	Trinity	\N	\N
126	Russian Culture and Language	minor	\N	Trinity	\N	\N
127	Sociology	minor	\N	Trinity	\N	\N
128	Software Engineering	minor	\N	Trinity	\N	\N
129	Spanish Studies	minor	\N	Trinity	\N	\N
130	Statistical Science	minor	\N	Trinity	\N	\N
131	Theater Studies	minor	\N	Trinity	\N	\N
132	Visual Arts	minor	\N	Trinity	\N	\N
133	Visual and Media Studies	minor	\N	Trinity	\N	\N
134	Writing and Rhetoric	minor	\N	Trinity	\N	\N
135	Aerospace Engineering	certificate	\N	Pratt	\N	\N
136	Architectural Engineering	certificate	\N	Pratt	\N	\N
137	Child Policy Research	certificate	\N	Sanford	\N	\N
138	Decision Sciences	certificate	\N	Trinity	\N	\N
139	Digital Intelligence	certificate	\N	Trinity	\N	\N
140	Documentary Studies	certificate	\N	Trinity	\N	\N
141	Energy and the Environment	certificate	\N	Nicholas	\N	\N
142	Ethics & Society	certificate	\N	Trinity	\N	\N
143	Global Development Engineering	certificate	\N	Pratt	\N	\N
144	Health Policy	certificate	\N	Sanford	\N	\N
145	Human Rights	certificate	\N	Sanford	\N	\N
146	Information Science + Studies	certificate	\N	Trinity	\N	\N
147	Innovation & Entrepreneurship	certificate	\N	Fuqua	\N	\N
148	Islamic Studies	certificate	\N	Trinity	\N	\N
149	Jewish Studies	certificate	\N	Trinity	\N	\N
150	Latin American Studies	certificate	\N	Trinity	\N	\N
151	Latino / Latina Studies in the Global South	certificate	\N	Trinity	\N	\N
152	Markets & Management	certificate	\N	Trinity	\N	\N
153	Materials Science & Engineering	certificate	\N	Pratt	\N	\N
154	Philosophy, Politics and Economics	certificate	\N	Trinity	\N	\N
155	Robotics & Automation	certificate	\N	Pratt	\N	\N
156	Science & the Public	certificate	\N	Trinity	\N	\N
\.


--
-- Data for Name: program_requirements; Type: TABLE DATA; Schema: public; Owner: abbyr
--

COPY Program_requirements (program_id, course_id, requirement_type) FROM stdin;
\.


--
-- Name: program_program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abbyr
--

SELECT pg_catalog.setval('Program_program_id_seq', 156, true);


--
-- Name: program program_pkey; Type: CONSTRAINT; Schema: public; Owner: abbyr
--

--ALTER TABLE ONLY Program
    --ADD CONSTRAINT program_pkey PRIMARY KEY (program_id);


--
-- Name: program_requirements program_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: abbyr
--

ALTER TABLE ONLY Program_requirements
    ADD CONSTRAINT program_requirements_pkey PRIMARY KEY (program_id, course_id);


--
-- Name: program_requirements program_requirements_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abbyr
--

ALTER TABLE ONLY Program_requirements
    ADD CONSTRAINT program_requirements_program_id_fkey FOREIGN KEY (program_id) REFERENCES Program(program_id);


--
-- PostgreSQL database dump complete
--
