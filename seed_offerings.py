import psycopg2
import subprocess
import json
import os
import time
from dotenv import load_dotenv
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv("/Users/uzair_chaudhry/cs316-project/.env")
API_KEY = os.getenv("DUKE_API_KEY")
print(f"Using API key: {API_KEY[:8]}...", flush=True)

BASE = "https://streamer.oit.duke.edu/curriculum"
STRM = "1980"

conn = psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")
cur = conn.cursor()

cur.execute("SELECT course_id FROM Course")
course_ids = [row[0] for row in cur.fetchall()]

success = 0
empty = 0
errors = 0

def fetch_classes(crse_id, api_key):
    url = f"{BASE}/classes/strm/{STRM}/crse_id/{crse_id}?access_token={api_key}"
    result = subprocess.run(["curl", "-s", url], capture_output=True, text=True, timeout=15)
    try:
        return json.loads(result.stdout)
    except:
        return {}

for cid in course_ids:
    padded = str(cid).zfill(6)
    print(f"Trying {padded}...", flush=True)
    try:
        data = fetch_classes(padded, API_KEY)

        result = data.get("ssr_get_classes_resp", {}).get("search_result", {})
        subjects = result.get("subjects")
        if not subjects:
            empty += 1
            continue

        subject = subjects.get("subject", {})
        classes = subject.get("classes_summary", {}).get("class_summary", [])
        if isinstance(classes, dict):
            classes = [classes]

        for cls in classes:
            instructor_list = cls.get("instructors", {})
            instructor = "TBA"
            if instructor_list:
                instr = instructor_list.get("instructor", {})
                if isinstance(instr, list):
                    instructor = instr[0].get("name", "TBA")
                elif isinstance(instr, dict):
                    instructor = instr.get("name", "TBA")

            seats = cls.get("enrollment_cap", 0) or 0

            cur.execute("""
                INSERT INTO Offering (course_id, semester, phys_location, instructor, seats_available)
                VALUES (%s, %s, %s, %s, %s) RETURNING offering_id
            """, (cid, "Fall 2026", "", instructor, seats))
            offering_id = cur.fetchone()[0]

            patterns = cls.get("classes_meeting_patterns", {}).get("class_meeting_pattern", [])
            if isinstance(patterns, dict):
                patterns = [patterns]

            for pat in patterns:
                start = pat.get("meeting_time_start", "")[:19]
                end = pat.get("meeting_time_end", "")[:19]
                location = pat.get("facility_id_lov_descr", "") or ""

                cur.execute("UPDATE Offering SET phys_location = %s WHERE offering_id = %s", (location, offering_id))

                day_map = {
                    "mon": "Monday", "tues": "Tuesday", "wed": "Wednesday",
                    "thurs": "Thursday", "fri": "Friday", "sat": "Saturday", "sun": "Sunday"
                }
                for key, day_name in day_map.items():
                    if pat.get(key) == "Y":
                        cur.execute("""
                            INSERT INTO Meeting (offering_id, day_of_week, start_time, end_time)
                            VALUES (%s, %s, %s, %s)
                        """, (offering_id, day_name, start[11:16] if start else None, end[11:16] if end else None))

        conn.commit()
        success += 1
        if success % 50 == 0:
            print(f"Progress: {success} seeded, {empty} empty, {errors} errors", flush=True)

    except Exception as e:
        print(f"Error on {padded}: {e}", flush=True)
        errors += 1
        conn.rollback()
        continue

    time.sleep(0.1)

print(f"Done: {success} seeded, {empty} empty, {errors} errors")
cur.close()
conn.close()