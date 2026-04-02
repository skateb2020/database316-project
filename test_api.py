import requests, json

API_KEY = "e0f9566ddf3eef5ecdb5c3d5828380eb"
BASE_URL = "https://streamer.oit.duke.edu/curriculum"

# Get course offering details for a COMPSCI course (028500 = Principles of CS)
r = requests.get(f"{BASE_URL}/courses/crse_id/000081/crse_offer_nbr/1?access_token={API_KEY}")
data = r.json()

course = data["ssr_get_course_offering_resp"]["course_offering_result"]["course_offering"]

print(f"Course: {course['course_title_long']}")
print(f"Subject: {course['subject']} {course['catalog_nbr'].strip()}")
print(f"Grading: {course['grading_basis_lov_descr']}")
print()

attributes = course.get("course_attributes", {}).get("course_attribute", [])
if not isinstance(attributes, list):
    attributes = [attributes]

modes_of_inquiry = []
areas_of_knowledge = []
trinity_reqs = []

for attr in attributes:
    if attr["crse_attr"] == "CURR":
        modes_of_inquiry.append(attr["crse_attr_value_lov_descr"])
    elif attr["crse_attr"] == "USE":
        areas_of_knowledge.append(attr["crse_attr_value_lov_descr"])
    elif attr["crse_attr"] == "TRIN":
        trinity_reqs.append(attr["crse_attr_value_lov_descr"])

print(f"Modes of Inquiry: {modes_of_inquiry}")
print(f"Areas of Knowledge: {areas_of_knowledge}")
print(f"A&S Curriculum Reqs: {trinity_reqs}")