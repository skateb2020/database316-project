from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(dbname="duke_courses", user="postgres", host="localhost", password="hWznS2an%")

@app.route("/api/courses", methods=["GET"])
def filter_courses():
    subject = request.args.get("subject")
    level = request.args.get("level")
    search = request.args.get("search")
    aok = request.args.get("aok")
    moi = request.args.getlist("moi")

    query = "SELECT DISTINCT c.course_id, c.cname, c.numbering, c.cdescription FROM Course c WHERE 1=1"
    sql_params = []

    if subject:
        query += " AND c.cdescription = %s"
        sql_params.append(subject)
    if level:
        level = int(level)
        query += " AND c.numbering >= %s AND c.numbering < %s"
        sql_params.append(level)
        sql_params.append(level + 100)
    if search:
        query += " AND LOWER(c.cname) LIKE %s"
        sql_params.append(f"%{search.lower()}%")
    if aok:
        query += " AND c.course_id IN (SELECT course_id FROM Areas_Of_Knowledge WHERE area = %s)"
        sql_params.append(aok)
    if moi:
        for m in moi:
            query += " AND c.course_id IN (SELECT course_id FROM Modes_Of_Inquiry WHERE mode = %s)"
            sql_params.append(m)

    query += " ORDER BY c.cdescription, c.numbering LIMIT 50"

    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, sql_params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    courses = [{"course_id": r[0], "name": r[1], "number": r[2], "subject": r[3]} for r in rows]
    return jsonify(courses)

@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT cdescription FROM Course ORDER BY cdescription")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([r[0] for r in rows])

@app.route("/api/aok", methods=["GET"])
def get_aok():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT area FROM Areas_Of_Knowledge ORDER BY area")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([r[0] for r in rows])

@app.route("/api/moi", methods=["GET"])
def get_moi():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT mode FROM Modes_Of_Inquiry ORDER BY mode")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([r[0] for r in rows])

if __name__ == "__main__":
    app.run(debug=True, port=5001)