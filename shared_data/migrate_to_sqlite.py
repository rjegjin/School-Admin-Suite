import sqlite3
import pandas as pd
from pathlib import Path

# 경로 설정
BASE_DIR = Path("/home/rjegj/projects")
ROSTER_CSV = BASE_DIR / "School-Admin-Suite/shared_data/master_roster.csv"
OBS_CSV = BASE_DIR / "세특/observation_logs.csv"
DB_PATH = BASE_DIR / "School-Admin-Suite/shared_data/school_master.db"


def init_db():
    """DB를 처음부터 재생성합니다. (기존 테이블 DROP 후 FK 포함 재생성)"""
    print(f"[*] Rebuilding School Master DB at: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()

    # 기존 테이블 삭제 (의존 순서: observations 먼저)
    cursor.execute("DROP TABLE IF EXISTS observations")
    cursor.execute("DROP TABLE IF EXISTS students")

    # 학생 테이블 (명렬표) — name에 UNIQUE 제약 추가
    cursor.execute("""
        CREATE TABLE students (
            student_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            contact TEXT
        )
    """)

    # 관찰 기록 테이블 — student_name이 students.name을 참조하는 FK
    cursor.execute("""
        CREATE TABLE observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            obs_date DATE NOT NULL,
            student_name TEXT NOT NULL,
            category_main TEXT,
            category_sub TEXT,
            fact TEXT NOT NULL,
            keyword TEXT,
            impact TEXT,
            teacher_memo TEXT,
            FOREIGN KEY (student_name) REFERENCES students(name)
                ON UPDATE CASCADE ON DELETE RESTRICT
        )
    """)

    # 인덱스
    cursor.execute("CREATE INDEX idx_obs_student ON observations(student_name)")
    cursor.execute("CREATE INDEX idx_obs_date ON observations(obs_date)")

    conn.commit()
    return conn


def import_roster(conn):
    """CSV 명렬표를 students 테이블에 임포트합니다."""
    print("[*] Importing Student Roster...")
    df = pd.read_csv(ROSTER_CSV, dtype=str)

    # 오염 행 필터링: id가 순수 숫자인 행만 (헤더 잔재 "학생이름" 제거)
    df = df[df['id'].str.isnumeric()]
    # 같은 id가 중복될 경우 마지막 행 유지 (3번: "학생이름" 먼저, 김대현 나중 → 김대현 유지)
    df['id'] = df['id'].astype(int)
    df = df.drop_duplicates(subset='id', keep='last')

    cursor = conn.cursor()
    count = 0
    for _, row in df.iterrows():
        cursor.execute(
            "INSERT INTO students (student_id, name, contact) VALUES (?, ?, ?)",
            (int(row['id']), row['name'].strip(), row['gender'].strip())
        )
        count += 1
    conn.commit()
    print(f"[+] Successfully imported {count} students.")
    return count


def import_observations(conn):
    """관찰 기록을 임포트합니다. FK 위반(미등록 학생) 건은 건너뛰고 보고합니다."""
    print("[*] Importing Observation Logs...")
    df = pd.read_csv(OBS_CSV)

    # 등록된 학생 이름 집합
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM students")
    registered = {row[0] for row in cursor.fetchall()}

    imported = 0
    orphans = []

    for _, row in df.iterrows():
        name = row['이름'].strip()
        if name not in registered:
            orphans.append({
                'date': row['날짜'],
                'name': name,
                'fact': row['구체적 행동(Fact)'][:40] + '...'
            })
            continue

        cursor.execute("""
            INSERT INTO observations
            (obs_date, student_name, category_main, category_sub, fact, keyword, impact, teacher_memo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row['날짜'], name, row['대분류(상황)'], row['소분류(활동)'],
            row['구체적 행동(Fact)'], row['핵심 키워드'], row['영향/반응'], row['교사 메모']
        ))
        imported += 1

    conn.commit()
    print(f"[+] Successfully imported {imported} observation records.")

    if orphans:
        print(f"[!] {len(orphans)} orphan record(s) REJECTED (student not in roster):")
        for o in orphans:
            print(f"    - {o['date']} | {o['name']} | {o['fact']}")

    return imported, orphans


def verify_integrity(conn):
    """FK 무결성 및 데이터 정합성을 검증합니다."""
    print("\n[*] Verifying Data Integrity...")
    cursor = conn.cursor()

    # FK 체크
    cursor.execute("PRAGMA foreign_key_check")
    violations = cursor.fetchall()
    if violations:
        print(f"[!] FK violations found: {violations}")
    else:
        print("[+] Foreign key integrity: OK")

    # 통계
    cursor.execute("SELECT COUNT(*) FROM students")
    n_students = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM observations")
    n_obs = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT student_name) FROM observations")
    n_obs_students = cursor.fetchone()[0]

    print(f"[+] Students: {n_students}")
    print(f"[+] Observations: {n_obs} (across {n_obs_students} students)")

    # "학생이름" 같은 오염 데이터 체크
    cursor.execute("SELECT student_id, name FROM students WHERE name LIKE '%학생%' OR name LIKE '%이름%'")
    dirty = cursor.fetchall()
    if dirty:
        print(f"[!] Suspicious student entries: {dirty}")
    else:
        print("[+] No suspicious entries detected.")


if __name__ == "__main__":
    conn = init_db()
    import_roster(conn)
    import_observations(conn)
    verify_integrity(conn)
    conn.close()
    print("\n[OK] Data Migration to SQLite Complete!")
