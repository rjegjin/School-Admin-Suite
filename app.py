import streamlit as st
import os
import subprocess

st.set_page_config(page_title="School Admin Suite", page_icon="🏫", layout="wide")

st.title("🏫 School Admin Suite 통합 대시보드")
st.markdown("교무/행정 업무를 자동화하는 개별 도구들을 통합 관리하는 포털입니다.")

# Constants
VENV_PYTHON = "/home/rjegj/projects/unified_venv/bin/python"
VENV_STREAMLIT = "/home/rjegj/projects/unified_venv/bin/streamlit"
BASE_DIR = "/home/rjegj/projects/School-Admin-Suite"

def run_background(cmd, desc):
    try:
        subprocess.Popen(cmd, shell=True, preexec_fn=os.setsid)
        st.toast(f"✅ {desc} 백그라운드 실행을 시작했습니다.", icon="🚀")
    except Exception as e:
        st.error(f"실행 중 오류 발생: {e}")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.subheader("📋 출결 및 보고")
    st.info("학생 출결 현황 기록 및 학부모 알림 발송")
    if st.button("Attendance Manager 열기", use_container_width=True):
        st.markdown("💡 *메인 런처(launcher.py)를 통해 개별 포트로 실행되어야 가장 안정적입니다. 백그라운드로 띄웁니다.*")
        run_background(f"{VENV_STREAMLIT} run {BASE_DIR}/Attendance-Manager/app.py --server.port 8502", "Attendance Manager")

with col2:
    st.subheader("🪑 자리 배치")
    st.info("조건 기반 지능형 자리 배치 (교실 테마 웹)")
    if st.button("Seat Randomizer 웹 실행", use_container_width=True):
        cmd = f"cd {BASE_DIR}/Event-Utilities/seat_randomizer_web && fuser -k 5173/tcp 2>/dev/null; (sleep 2 && xdg-open http://localhost:5173 &) && {VENV_PYTHON} -m http.server 5173 --directory dist"
        run_background(cmd, "자리 배치 웹")

with col3:
    st.subheader("⏰ 시수 배정")
    st.info("과학과 시수 배정 및 통계 시뮬레이터")
    if st.button("Curriculum Manager 웹 실행", use_container_width=True):
        cmd = f"cd {BASE_DIR}/Curriculum-Manager && fuser -k 8000/tcp 2>/dev/null; (sleep 2 && xdg-open http://localhost:8000 &) && {VENV_PYTHON} -m http.server 8000"
        run_background(cmd, "시수 배정 웹")

with col4:
    st.subheader("🔒 성적 조회")
    st.info("개별 성적 및 기록 보안 조회 시스템")
    if st.button("Score Checker 열기", use_container_width=True):
        st.markdown("💡 *개별 포트로 실행되어야 가장 안정적입니다.*")
        run_background(f"{VENV_STREAMLIT} run {BASE_DIR}/Score-Checker/app.py --server.port 8503", "Score Checker")

st.divider()

st.subheader("📊 데이터 구조화 현황")
st.markdown("""
모든 모듈은 이제 **`shared_data/`** 폴더를 중앙 데이터 저장소로 참조하도록 구조가 개편되고 있습니다.
- `shared_data/master_roster.csv` (준비 예정)
- `shared_data/school_calendar.json` (준비 예정)
""")
