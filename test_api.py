import requests

API_KEY = "e0f9566ddf3eef5ecdb5c3d5828380eb"
# BASE_URL = "https://streamer.oit.duke.edu/curriculum"

# headers = {"x-api-key": API_KEY}

# # r = requests.get(f"{BASE_URL}/list_of_values/fieldname/subject", headers=headers)
# # print(r.status_code)
# # print(r.json())


# r = requests.get(f"{BASE_URL}/classes/strm/1950/crse_id/002804", headers=headers)
# print(r.status_code)
# print(r.text[:500])

r = requests.get("https://streamer.oit.duke.edu/curriculum/classes/strm/1950/crse_id/002651?access_token={API_KEY}", timeout=5)
print(r.status_code)
print(r.text[:300])