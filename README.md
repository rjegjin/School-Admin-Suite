# 🏫 School-Admin-Suite (v1.0)

**School-Admin-Suite**는 학교 현장의 다양한 행정 및 교육과정 업무를 자동화하기 위해 설계된 통합 도구 모음입니다. 흩어져 있던 개별 유틸리티들을 업무 동선에 맞춰 재구조화하였습니다.

## 📂 Core Modules

### 📅 01. Event-Utilities
학교 행사 및 학급 운영을 위한 유틸리티 모음입니다.
- **Seat Randomizer:** 공정한 자리 배치 및 시각화 도구.
- **Calendar Cleaner:** 구글 캘린더/iCal 데이터 정제 및 일정 추출.
- **Lottery System:** 행사용 행운권 추첨 프로그램.
- **CSV Tools:** 학급 명렬표 및 데이터 중복 제거 도구.

### 🔬 02. Curriculum-Manager (v1.2)
교사의 가장 복잡한 업무 중 하나인 시수 배정을 자동화합니다.
- **Digital Scan View:** 실제 결재 문서와 동일한 격자 및 레이아웃 출력.
- **Assignment Engine:** 학년별, 과목별 시수 합계 실시간 검증 및 통계.
- **Data Persistence:** 배정 현황을 JSON 데이터로 관리 및 백업.

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
