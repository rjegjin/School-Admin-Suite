# 과학과 시수 배정 시스템 (Science Hours Allocation System)

2026학년도 과학과 교사들의 수업 시수(과학, 주제선택, 창체 등)를 효율적으로 배정하고 시각화하기 위한 웹 기반 도구입니다.

## 주요 기능
- **스캔본 뷰 (Preview Mode)**: 공문 제출용 양식에 맞춘 시각적 레이아웃 제공. 클릭하여 직접 배정 시수를 수정하거나 빈 공간을 클릭해 추가할 수 있습니다.
- **상세 데이터 뷰 (Data Mode)**: 교사별 상세 배정 현황, 목표 주당 시수 대비 배정 시수 실시간 검증 및 통계 확인.
- **데이터 저장/불러오기**: 브라우저 로컬 스토리지 자동 저장 및 JSON 파일 형식의 내보내기/가져오기 지원.

## 기술 스택
- React (Tailwind CSS, Lucide-React)

## 실행 방법
1. 프로젝트 루트 또는 이 폴더에서 웹 서버 실행:
   ```bash
   python -m http.server 8000
   ```
2. 브라우저 접속: `http://localhost:8000/web_tools/science_hours_system/index.html`
