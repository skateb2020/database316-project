import psycopg2
import subprocess
import json
import os
import time
from dotenv import load_dotenv

load_dotenv("/Users/uzair_chaudhry/cs316-project/.env")
API_KEY = os.getenv("DUKE_API_KEY")
print(f"Using API key: {API_KEY[:8]}...", flush=True)

conn = psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")
cur = conn.cursor()

cur.execute("SELECT course_id FROM Course")
course_ids = [row[0] for row in cur.fetchall()]

# Skip already seeded
cur.execute("SELECT DISTINCT course_id FROM Areas_Of_Knowledge_New")
already = set(row[0] for row in cur.fetchall())
course_ids = [c for c in course_ids if c not in already]
print(f"{len(course_ids)} courses to seed", flush=True)

success = 0
empty = 0
errors = 0

def fetch_course(crse_id, api_key):
    url = f"https://streamer.oit.duke.edu/curriculum/courses/crse_id/{crse_id}/crse_offer_nbr/1?access_token={api_key}"
    print(f"  Fetching {crse_id}...", flush=True)
    result = subprocess.run(["curl", "-s", "--max-time", "10", url], capture_output=True, text=True, timeout=12)
    try:
        return json.loads(result.stdout)
    except:
        return {}

for cid in course_ids:
    padded = str(cid).zfill(6)
    try:
        data = fetch_course(padded, API_KEY)
        
        course_resp = data.get("ssr_get_course_offering_resp", {})
        course_result = course_resp.get("course_offering_result", {})
        course_offering = course_result.get("course_offering", {})
        attributes = course_offering.get("course_attributes", {})
        
        if not attributes:
            empty += 1
            continue
            
        attr_list = attributes.get("course_attribute", [])
        if isinstance(attr_list, dict):
            attr_list = [attr_list]
        
        found = False
        for attr in attr_list:
            if attr.get("crse_attr") == "TRIN":
                area_code = attr.get("crse_attr_value")
                if area_code:
                    cur.execute("""
                        INSERT INTO Areas_Of_Knowledge_New (course_id, area)
                        VALUES (%s, %s) ON CONFLICT DO NOTHING
                    """, (cid, area_code))
                    found = True
        
        if not found:
            empty += 1
        
        conn.commit()
        success += 1
        if success % 100 == 0:
            print(f"Progress: {success} done, {empty} empty, {errors} errors", flush=True)

    except Exception as e:
        errors += 1
        conn.rollback()
        continue
    
    time.sleep(0.05)

print(f"Done: {success} done, {empty} empty, {errors} errors")
cur.close()
conn.close()