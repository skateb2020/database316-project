import requests
import psycopg2

# -----------------------------
# DATABASE CONNECTION
# -----------------------------
conn = psycopg2.connect(
    dbname="duke_courses",
    user="skateb2020",
    password="WhitevilleDurham",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# -----------------------------
# API CALL
# -----------------------------
url = "https://streamer.oit.duke.edu/curriculum/courses"

response = requests.get(url)
data = response.json()

# -----------------------------
# HELPERS
# -----------------------------
course_id_counter = 1
offering_id_counter = 1
meeting_id_counter = 1

course_map = {}  # maps course code → course_id

def parse_components(components):
    is_lecture = "LEC" in components if components else False
    is_discussion = "DIS" in components if components else False
    is_graded = True  # assume true unless specified otherwise
    return is_lecture, is_discussion, is_graded

# -----------------------------
# MAIN LOOP
# -----------------------------
for item in data:
    # ---- COURSE ----
    course_code = item.get("course_id")

    if course_code not in course_map:
        cname = item.get("title")
        cdescription = item.get("description")

        components = item.get("course_components", [])
        is_lecture, is_discussion, is_graded = parse_components(components)

        cursor.execute("""
            INSERT INTO Course (course_id, cname, cdescription, is_graded, is_discussion, is_lecture)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            course_id_counter,
            cname,
            cdescription,
            is_graded,
            is_discussion,
            is_lecture
        ))

        course_map[course_code] = course_id_counter
        course_id_counter += 1

    course_id = course_map[course_code]

    # ---- OFFERING ----
    semester = item.get("term")
    location = item.get("location")

    cursor.execute("""
        INSERT INTO Offering (offering_id, course_id, semester, phys_location)
        VALUES (%s, %s, %s, %s)
    """, (
        offering_id_counter,
        course_id,
        semester,
        location
    ))

    current_offering_id = offering_id_counter
    offering_id_counter += 1

    # ---- MEETINGS ----
    meetings = item.get("meetings", [])

    for m in meetings:
        day = m.get("day")
        start = m.get("start_time")
        end = m.get("end_time")

        cursor.execute("""
            INSERT INTO Meeting (meeting_id, offering_id, day_of_week, start_time, end_time)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            meeting_id_counter,
            current_offering_id,
            day,
            start,
            end
        ))

        meeting_id_counter += 1

# -----------------------------
# FINALIZE
# -----------------------------
conn.commit()
cursor.close()
conn.close()

print("Data successfully loaded!")