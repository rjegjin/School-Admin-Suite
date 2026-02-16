# 과학과 시수 배정 시스템 (Science Hours Allocation System)

2026학년도 과학과 교사들의 수업 시수(과학, 주제선택, 창체 등)를 효율적으로 배정하고 시각화하기 위한 웹 기반 도구입니다.

## 주요 기능
- **스캔본 뷰 (Preview Mode)**: 공문 제출용 양식에 맞춘 시각적 레이아웃 제공.
- **상세 데이터 뷰 (Data Mode)**: 교사별 상세 배정 현황 및 실시간 통계 검증.
- **JSON 내보내기**: 배정된 데이터를 다른 시스템에서 활용할 수 있도록 JSON 형식으로 저장.

## 기술 스택
- React (Tailwind CSS, Lucide-React)

## 실행 방법
1. 프로젝트 루트 또는 이 폴더에서 웹 서버 실행:
   ```bash
   python -m http.server 8000
   ```
2. 브라우저 접속: `http://localhost:8000/web_tools/science_hours_system/index.html`
