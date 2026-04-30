from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(dbname="duke_courses", user="skateb2020", password="WhitevilleDurham", host="localhost")

@app.route("/api/courses", methods=["GET"])
def filter_courses():
    subject = request.args.get("subject")
    level = request.args.get("level")
    search = request.args.get("search")
    aok = request.args.get("aok")
    moi = request.args.getlist("moi")

    query = "SELECT DISTINCT ON (c.subject, c.numbering) c.course_id, c.cname, c.numbering, c.subject FROM Course c WHERE 1=1"
    sql_params = []

    if subject:
        query += " AND c.subject = %s"
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

    query += " ORDER BY c.subject, c.numbering LIMIT 50"

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
    cur.execute("SELECT DISTINCT subject FROM Course ORDER BY subject")
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

@app.route('/api/courses/<int:course_id>')
def get_course(course_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT c.course_id, c.cname, c.numbering, c.subject,
               array_agg(DISTINCT a.area) as aok,
               array_agg(DISTINCT m.mode) as moi
        FROM Course c
        LEFT JOIN Areas_Of_Knowledge a ON c.course_id = a.course_id
        LEFT JOIN Modes_Of_Inquiry m ON c.course_id = m.course_id
        WHERE c.course_id = %s
        GROUP BY c.course_id, c.cname, c.numbering, c.subject
    """, (course_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify({
        "course_id": row[0],
        "name": row[1],
        "number": row[2],
        "subject": row[3],
        "aok": row[4],
        "moi": row[5]
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)