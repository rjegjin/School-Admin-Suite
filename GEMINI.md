# Project GEMINI Constitution: School-Admin-Suite

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
