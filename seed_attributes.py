import requests
import psycopg2
import time
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("DUKE_API_KEY")
BASE_URL = "https://streamer.oit.duke.edu/curriculum"

conn = psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")
cur = conn.cursor()

# Get all courses from DB
cur.execute("SELECT course_id FROM Course")
course_ids = [row[0] for row in cur.fetchall()]
print(f"Found {len(course_ids)} courses to process...")

processed = 0
errors = 0

for crse_id in course_ids:
    try:
        crse_id_padded = str(crse_id).zfill(6)
        r = requests.get(
            f"{BASE_URL}/courses/crse_id/{crse_id_padded}/crse_offer_nbr/1?access_token={API_KEY}",
            timeout=5
        )
        if r.status_code != 200:
            errors += 1
            continue

        data = r.json()
        course = data["ssr_get_course_offering_resp"]["course_offering_result"]["course_offering"]
        attributes = course.get("course_attributes", {})
        if not attributes:
            continue

        attrs = attributes.get("course_attribute", [])
        if not isinstance(attrs, list):
            attrs = [attrs]

        for attr in attrs:
            if attr["crse_attr"] == "CURR":  # Mode of Inquiry
                cur.execute("""
                    INSERT INTO Modes_Of_Inquiry(course_id, mode)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                """, (crse_id, attr["crse_attr_value"]))
            elif attr["crse_attr"] == "USE":  # Area of Knowledge
                cur.execute("""
                    INSERT INTO Areas_Of_Knowledge(course_id, area)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                """, (crse_id, attr["crse_attr_value"]))

        processed += 1
        if processed % 50 == 0:
            conn.commit()
            print(f"Processed {processed}/{len(course_ids)} courses...")

        time.sleep(0.1)  # rate limit

    except Exception as e:
        errors += 1
        continue

conn.commit()
cur.close()
conn.close()
print(f"Done! Processed {processed} courses, {errors} errors.")