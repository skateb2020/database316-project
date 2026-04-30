from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import bcrypt

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(dbname="duke_courses", user="uzair_chaudhry", host="localhost")

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

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    net_id = data.get('net_id')
    password = data.get('password')
    name = data.get('name')
    year = data.get('year')
    major = data.get('major')
    minor = data.get('minor')

    if not net_id or not password:
        return jsonify({'error': 'net_id and password required'}), 400

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO Student (net_id, name, year, major, minor, password_hash)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING student_id
        """, (net_id, name, year, major, minor, password_hash))
        student_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'student_id': student_id, 'net_id': net_id, 'name': name})
    except Exception as e:
        return jsonify({'error': 'net_id already exists'}), 409

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    net_id = data.get('net_id')
    password = data.get('password')

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT student_id, name, year, major, minor, password_hash FROM Student WHERE net_id = %s", (net_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not bcrypt.checkpw(password.encode(), row[5].encode()):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({
        'student_id': row[0],
        'net_id': net_id,
        'name': row[1],
        'year': row[2],
        'major': row[3],
        'minor': row[4]
    })

@app.route('/api/student/<int:student_id>', methods=['GET', 'PUT'])
def student_profile(student_id):
    conn = get_db()
    cur = conn.cursor()

    if request.method == 'GET':
        cur.execute("SELECT student_id, net_id, name, year, major, minor FROM Student WHERE student_id = %s", (student_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'student_id': row[0], 'net_id': row[1], 'name': row[2], 'year': row[3], 'major': row[4], 'minor': row[5]})

    elif request.method == 'PUT':
        data = request.json
        cur.execute("""
            UPDATE Student SET name=%s, year=%s, major=%s, minor=%s
            WHERE student_id=%s
        """, (data.get('name'), data.get('year'), data.get('major'), data.get('minor'), student_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True})

@app.route('/api/student/<int:student_id>/completed', methods=['GET', 'POST', 'DELETE'])
def completed_courses(student_id):
    conn = get_db()
    cur = conn.cursor()

    if request.method == 'GET':
        cur.execute("""
            SELECT c.course_id, c.cname, c.numbering, c.subject
            FROM Course c
            JOIN Completed_Course cc ON c.course_id = cc.course_id
            WHERE cc.student_id = %s
        """, (student_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([{'course_id': r[0], 'name': r[1], 'number': r[2], 'subject': r[3]} for r in rows])

    elif request.method == 'POST':
        course_id = request.json.get('course_id')
        cur.execute("INSERT INTO Completed_Course VALUES (%s, %s) ON CONFLICT DO NOTHING", (student_id, course_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True})

    elif request.method == 'DELETE':
        course_id = request.json.get('course_id')
        cur.execute("DELETE FROM Completed_Course WHERE student_id=%s AND course_id=%s", (student_id, course_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True})

@app.route('/api/student/<int:student_id>/planned-offerings', methods=['GET', 'POST', 'DELETE'])
def planned_offerings(student_id):
    conn = get_db()
    cur = conn.cursor()

    if request.method == 'GET':
        cur.execute("""
            SELECT o.offering_id, c.course_id, c.cname, c.numbering, c.subject,
                   o.instructor, o.phys_location, o.seats_available,
                   array_agg(m.day_of_week) as days,
                   min(m.start_time) as start_time,
                   max(m.end_time) as end_time
            FROM Planned_Course pc
            JOIN Offering o ON pc.course_id = o.course_id
            JOIN Course c ON o.course_id = c.course_id
            LEFT JOIN Meeting m ON o.offering_id = m.offering_id
            WHERE pc.student_id = %s AND o.semester = 'Spring 2026'
            GROUP BY o.offering_id, c.course_id, c.cname, c.numbering, c.subject,
                     o.instructor, o.phys_location, o.seats_available
        """, (student_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([{
            'offering_id': r[0], 'course_id': r[1], 'name': r[2],
            'number': r[3], 'subject': r[4], 'instructor': r[5],
            'location': r[6], 'seats': r[7], 'days': r[8] or [],
            'start_time': r[9], 'end_time': r[10]
        } for r in rows])

    elif request.method == 'POST':
        course_id = request.json.get('course_id')
        cur.execute("""
            INSERT INTO Planned_Course (student_id, course_id)
            VALUES (%s, %s) ON CONFLICT DO NOTHING
        """, (student_id, course_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True})

    elif request.method == 'DELETE':
        course_id = request.json.get('course_id')
        cur.execute("DELETE FROM Planned_Course WHERE student_id=%s AND course_id=%s",
                    (student_id, course_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True})


@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    student_id = request.args.get('student_id', type=int)
    earliest_time = request.args.get('earliest_time', '00:00')  # e.g. "11:30"
    avoid_days = request.args.getlist('avoid_days')             # e.g. ["Friday"]
    aok = request.args.get('aok', '')
    moi = request.args.get('moi', '')
    subject = request.args.get('subject', '')

    conn = get_db()
    cur = conn.cursor()

    # Get student's already planned meeting times for conflict detection
    cur.execute("""
        SELECT m.day_of_week, m.start_time, m.end_time
        FROM Planned_Course pc
        JOIN Offering o ON pc.course_id = o.course_id
        JOIN Meeting m ON o.offering_id = m.offering_id
        WHERE pc.student_id = %s AND o.semester = 'Spring 2026'
    """, (student_id,))
    planned_meetings = cur.fetchall()

    # Get completed course IDs to exclude
    cur.execute("SELECT course_id FROM Completed_Course WHERE student_id = %s", (student_id,))
    completed_ids = [r[0] for r in cur.fetchall()]

    # Get planned course IDs to exclude
    cur.execute("SELECT course_id FROM Planned_Course WHERE student_id = %s", (student_id,))
    planned_ids = [r[0] for r in cur.fetchall()]

    exclude_ids = completed_ids + planned_ids

    query = """
        SELECT DISTINCT c.course_id, c.cname, c.numbering, c.subject,
               o.offering_id, o.instructor, o.phys_location,
               array_agg(DISTINCT m.day_of_week) as days,
               min(m.start_time) as start_time,
               max(m.end_time) as end_time
        FROM Course c
        JOIN Offering o ON c.course_id = o.course_id
        JOIN Meeting m ON o.offering_id = m.offering_id
        LEFT JOIN Areas_Of_Knowledge ak ON c.course_id = ak.course_id
        LEFT JOIN Modes_Of_Inquiry mi ON c.course_id = mi.course_id
        WHERE o.semester = 'Spring 2026'
        AND m.start_time >= %s
    """
    params = [earliest_time]

    if exclude_ids:
        query += " AND c.course_id != ALL(%s)"
        params.append(exclude_ids)

    if avoid_days:
        query += " AND m.day_of_week != ALL(%s)"
        params.append(avoid_days)

    if aok:
        query += " AND ak.area = %s"
        params.append(aok)

    if moi:
        query += " AND mi.mode = %s"
        params.append(moi)

    if subject:
        query += " AND c.subject = %s"
        params.append(subject)

    query += """
        GROUP BY c.course_id, c.cname, c.numbering, c.subject,
                 o.offering_id, o.instructor, o.phys_location
        ORDER BY min(m.start_time)
        LIMIT 20
    """

    cur.execute(query, params)
    rows = cur.fetchall()

    # Filter out time conflicts with planned courses
    def conflicts(new_days, new_start, new_end, planned):
        for p_day, p_start, p_end in planned:
            if p_day in (new_days or []):
                if new_start and new_end and p_start and p_end:
                    if new_start < p_end and new_end > p_start:
                        return True
        return False

    results = []
    for r in rows:
        days = [d for d in (r[7] or []) if d]
        start = r[8]
        end = r[9]
        if not conflicts(days, start, end, planned_meetings):
            results.append({
                'course_id': r[0], 'name': r[1], 'number': r[2],
                'subject': r[3], 'offering_id': r[4], 'instructor': r[5],
                'location': r[6], 'days': days,
                'start_time': start, 'end_time': end
            })

    cur.close()
    conn.close()
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5001)