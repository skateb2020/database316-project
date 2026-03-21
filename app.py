from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")

@app.route("/api/courses", methods=["GET"])
def filter_courses():
    subject = request.args.get("subject")
    level = request.args.get("level")
    search = request.args.get("search")

    query = "SELECT course_id, cname, numbering, subject FROM Course WHERE 1=1"
    params = []

    if subject:
        query += " AND subject = %s"
        params.append(subject)

    if level:
        level = int(level)
        query += " AND numbering >= %s AND numbering < %s"
        params.append(level)
        params.append(level + 100)

    if search:
        query += " AND LOWER(cname) LIKE %s"
        params.append(f"%{search.lower()}%")

    query += " ORDER BY subject, numbering LIMIT 50"

    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    courses = [{"course_id": r[0], "name": r[1], "number": r[2], "subject": r[3]} for r in rows]
    return jsonify(courses)

@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT subject FROM Course ORDER BY subject")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([r[0] for r in rows])

if __name__ == "__main__":
    app.run(debug=True, port=5001)