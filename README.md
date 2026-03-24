# 🏫 School-Admin-Suite (v1.0)

**School-Admin-Suite**는 학교 현장의 다양한 행정 및 교육과정 업무를 자동화하기 위해 설계된 통합 도구 모음입니다. 흩어져 있던 개별 유틸리티들을 업무 동선에 맞춰 재구조화하였습니다.

## 📂 Core Modules

### 📅 01. Event-Utilities
학교 행사 및 학급 운영을 위한 유틸리티 모음입니다.
- **Seat Randomizer:** 공정한 자리 배치 및 시각화 도구.
- **Calendar Cleaner:** 구글 캘린더/iCal 데이터 정제 및 일정 추출.
- **Lottery System:** 행사용 행운권 추첨 프로그램.
- **CSV Tools:** 학급 명렬표 및 데이터 중복 제거 도구.

### 🔬 02. Curriculum-Manager (v1.3)
교사의 가장 복잡한 업무 중 하나인 시수 배정을 자동화합니다.
- **Interactive UI:** 직접 셀을 클릭해 배정을 추가, 수정, 삭제하는 인터랙티브 스캔본 뷰 제공.
- **Assignment Engine:** 목표 시수와 현재 배정 시수 합계를 실시간 비교/검증하는 통계 대시보드.
- **Data Persistence:** 브라우저 로컬 스토리지 자동 저장 및 JSON 파일 내보내기/불러오기 지원.

### 📊 03. Analysis-Toolkit
데이터 기반의 학교 운영을 지원합니다.
- **Teacher Work Predictor:** 시기별 업무 집중도를 예측하여 자원 배분 지원.

## 🛠️ Tech Stack & Environment
- **Languages:** Python 3.x, JavaScript (React via CDN)
- **Runtime:** Unified Virtual Environment (`/home/rjegj/projects/unified_venv`)
- **Git Strategy:** 전체 스위트를 하나의 저장소로 관리하며, 기능별로 커밋 범위를 명시합니다.

## 📝 Usage
모든 파이썬 스크립트는 루트의 `unified_venv` 환경에서 실행하는 것을 원칙으로 합니다.
```bash
# Example: Seat Randomizer 실행
/home/rjegj/projects/unified_venv/bin/python Event-Utilities/seat_randomizer/seat_manager.py
```

---
**Maintained by Gemini CLI Agent & rjegjin**
