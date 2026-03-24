# Project GEMINI Constitution: School-Admin-Suite

## 🎯 비전 (Vision)
교사의 행정 업무를 0으로 수렴시키는 자동화된 교무실
단순한 유틸리티 모음이 아닌, 학기 초 교무 업무(출결, 시수, 자리, 업무 예측)를 원스톱으로 처리하는 **통합 교무 플랫폼**으로 진화합니다.

## 📌 개요
이 프로젝트는 학교 내 다양한 행정 업무를 자동화하는 개별 도구들을 하나의 스위트로 통합 관리합니다.

## 🐍 파이썬 환경
- 반드시 루트의 `unified_venv`를 사용합니다.
- 새로운 라이브러리 설치 시 `pip_unification/combined_requirements.txt`에 기록합니다.

## 🐙 Git 규칙
- **저장소:** `School-Admin-Suite` 전체를 하나의 Git 저장소로 관리합니다.
- **커밋 메시지:** `feat(event): ...`, `fix(curri): ...` 와 같이 범위를 명시합니다.
- **자동 커밋:** 활성화됨.

## 🛡️ 보안
- 학생 개인정보가 포함된 CSV, Excel 파일은 절대 커밋하지 않으며 `.gitignore`로 철저히 관리합니다.

## 🚀 향후 계획 (Next Steps)
- [x] **[가장 쉬운 단계]** 개별 도구(Attendance, Curriculum, Event 등)들을 하나의 통합된 웹 대시보드로 연결하는 진입점(Landing Page) 구축
- [x] **[중간 단계]** 마스터 명렬표(Master Roster) 구조화 및 `shared_data/` 폴더 생성
- [x] **[중간 단계]** 자리 배치 시스템 지능화(몬테카를로 최적화) 및 GUI/CLI 데이터 동기화 완료
- [ ] **[어려운 단계]** Plickers 등 외부 데이터 추출 및 병합 로직 자동화 파이프라인 구축
- [ ] **[어려운 단계]** 장기적인 UI 프레임워크 통일 고민 (React vs Streamlit) 및 포팅
- [ ] 차년도 업무 배정 예측기 데이터셋 확충 및 시뮬레이션 정확도 개선

