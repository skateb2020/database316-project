import requests
import psycopg2
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("DUKE_API_KEY")
BASE_URL = "https://streamer.oit.duke.edu/curriculum"
STRM = "1950"

conn = psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")
cur = conn.cursor()

def get_subjects():
    r = requests.get(f"{BASE_URL}/list_of_values/fieldname/subject", headers={"x-api-key": API_KEY})
    values = r.json()["scc_lov_resp"]["lovs"]["lov"]["values"]["value"]
    return [s["code"] for s in values]

def get_courses(subject):
    r = requests.get(f"{BASE_URL}/courses/subject/{subject}?access_token={API_KEY}")
    data = r.json()
    try:
        result = data["ssr_get_courses_resp"]["course_search_result"]["subjects"]["subject"]
        courses = result.get("course_summaries", {}).get("course_summary", [])
        if not isinstance(courses, list):
            courses = [courses]
        return courses
    except:
        return []
    print(f"  Course {crse_id}: {cname}")

def get_sections(crse_id):
    try:
        r = requests.get(f"{BASE_URL}/classes/strm/{STRM}/crse_id/{crse_id}?access_token={API_KEY}", timeout=5)
        data = r.json()
        try:
            offerings = data["ssr_get_classes_resp"]["course_offering_result"]["course_offerings"]["course_offering"]
            if not isinstance(offerings, list):
                offerings = [offerings]
            return offerings
        except:
            return []
    except:
        return []

def parse_time(ts):
    if not ts:
        return None
    try:
        return datetime.fromisoformat(ts).strftime("%H:%M:%S")
    except:
        return None

offering_id_counter = 1
course_ids_inserted = set()

subjects = get_subjects()
print(f"Found {len(subjects)} subjects, processing first 20...")

subjects = get_subjects()
print(f"Found {len(subjects)} subjects, processing all...")

for subject in subjects:
    print(f"Processing {subject}...")
    courses = get_courses(subject)
    for course in courses:
        crse_id = int(course.get("crse_id", 0))
        if not crse_id:
            continue
        cname = (course.get("course_title_long") or "")[:100]
        numbering_raw = course.get("catalog_nbr", "").strip()
        try:
            numbering = int(''.join(filter(str.isdigit, numbering_raw)))
        except:
            numbering = None
        cur.execute("""
            INSERT INTO Course(course_id, cname, numbering, subject, is_graded, is_lecture, is_discussion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (crse_id, cname, numbering, subject, True, True, False))

conn.commit()
cur.close()
conn.close()
print("Done!")