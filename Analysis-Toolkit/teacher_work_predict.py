import random
import pandas as pd
import numpy as np

class Teacher:
    def __init__(self, name, subject, tenure_years, role_2025, grade_history):
        self.name = name
        self.subject = subject
        self.tenure_years = tenure_years  # 본교 근무 년수
        self.role_2025 = role_2025        # 2025년 담당 업무
        self.grade_history = grade_history # 최근 담임 학년 이력 [2025, 2024, 2023]
        self.points = 0                   # 인사 자문위 산정 점수

    def __repr__(self):
        return f"{self.name}({self.subject})"

def initialize_mock_data():
    """
    제공된 PDF(OCR) 데이터를 바탕으로 가상의 2025년 교사 명단을 생성합니다.
    데이터가 없는 교사는 난수를 통해 생성하여 전체 T/O를 맞춥니다.
    """
    teachers = []
    
    # 1. 사용자 (주인공) - 확정 데이터
    user = Teacher("정명현", "과학", 1, "3학년담임+진학2", [3])
    teachers.append(user)

    # 2. 주요 경쟁자 및 고정 인물 (PDF 기반 재구성)
    # 가정: 일부 교사는 전출 가능성이 있음 (tenure_years 5년차 설정)
    roster_data = [
        ("이지나", "사회", 3, "3학년부장", [3, 3]), # 3학년 고인물 가능성
        ("권미영", "음악", 4, "1학년부장", [1, 1]),
        ("정희선", "국어", 2, "2학년부장", [2]),
        ("박주현", "과학", 5, "교무부장", [0]),      # 5년차 만기 예상자
        ("하용석", "체육", 2, "생활부장", [0]),
        ("이진규", "기술", 3, "교무기획", [0]),
        ("박성환", "체육", 2, "생활기획", [0]),
        ("김광수", "체육", 4, "생활부원", [0]),
        ("윤영현", "영어", 3, "나이스", [0]),
    ]

    for name, sub, ten, role, hist in roster_data:
        teachers.append(Teacher(name, sub, ten, role, hist))

    # 3. 기타 교사 (Dummy Data) - 전체 교원 수 약 45명으로 가정 채우기
    # 과목별, 경력별 랜덤 생성
    subjects = ["국어", "영어", "수학", "사회", "과학", "체육", "미술"]
    for i in range(35):
        tenure = random.randint(1, 5)
        # 3학년 담임 경쟁자 생성 (약 10% 확률로 3학년 담임 경력 부여)
        hist = [3] if random.random() < 0.1 else [random.choice([0, 1, 2])]
        teachers.append(Teacher(f"교사_{i}", random.choice(subjects), tenure, "일반교사", hist))
        
    return teachers

def calculate_priority_score(teacher, target_role="3학년담임"):
    """
    인사 규정에 따른 우선순위 점수 계산 알고리즘
    """
    score = 0
    
    # [규정 5-3-1] 업무 연속성 (가장 강력한 가중치)
    # 사용자의 경우: 작년 진학2(전기고) -> 올해 진학1(전기고) 희망 시
    if teacher.name == "정명현" and target_role == "3학년담임":
        # 작년 업무와 올해 희망 업무의 연관성 체크
        if "진학" in teacher.role_2025: 
            score += 50  # 매우 높은 가중치 부여

    # [규정 5-1] 학년 순환 (3년 이상 동일 학년 금지/감점)
    if target_role == "3학년담임":
        consecutive_years = teacher.grade_history.count(3)
        if consecutive_years >= 3:
            score -= 100 # 배정 불가 수준의 감점
        elif consecutive_years == 2:
            score -= 20  # 순환 근무 권장으로 인한 감점

    # [규정 5-3-2] 행정 업무 2년 이상 수행자 -> 담임 우선
    if target_role == "담임" and teacher.grade_history == [0, 0]: # 2년 연속 비담임
        score += 30
        
    # [규정 5-3-3] 학교 근무 년수 (Seniority)
    score += teacher.tenure_years * 2
    
    return score

def run_simulation(n_trials=10000):
    """
    몬테카를로 시뮬레이션 실행
    """
    success_count_1st_choice = 0 # 1지망(3학년+진학1) 배정 횟수
    success_count_2nd_choice = 0 # 2지망(2학년 담임) 배정 횟수
    
    print(f"🔄 시뮬레이션 시작 (총 {n_trials}회 반복)...")
    
    for _ in range(n_trials):
        # 1. 초기화 및 전출자 처리 (Leavers)
        current_teachers = initialize_mock_data()
        leavers = [t for t in current_teachers if t.tenure_years >= 5]
        # 5년차 미만이어도 랜덤하게 10% 전출 가정
        leavers += [t for t in current_teachers if t.tenure_years < 5 and random.random() < 0.1]
        
        staying_teachers = [t for t in current_teachers if t not in leavers]
        
        # 주인공(정명현)은 전출가지 않음 (가정)
        user = next((t for t in staying_teachers if t.name == "정명현"), None)
        if not user: continue # 오류 방지
        
        # 2. 3학년 담임 T/O 산정 (총 7~8학급 가정)
        total_3rd_grade_spots = 7
        
        # 3. 경쟁자들의 희망 추론 (Stochastic Preferences)
        applicants = []
        for t in staying_teachers:
            # 기본적으로 점수 계산
            t.points = calculate_priority_score(t, "3학년담임")
            
            # 희망 여부 결정 (확률적)
            # 고경력자일수록 3학년 담임 기피 경향 반영
            wants_3rd = False
            if t.name == "정명현":
                wants_3rd = True
            elif t.grade_history[0] == 3 and t.points > -50: # 기존 3학년 담임 중 순환 걸리지 않은 사람
                wants_3rd = True if random.random() < 0.6 else False # 잔류 희망 60%
            elif "진학" in t.role_2025: # 진학 업무 관련자
                wants_3rd = True
            else:
                # 일반 교사의 3학년 지원율 (낮음)
                wants_3rd = True if random.random() < 0.2 else False
                
            if wants_3rd:
                applicants.append(t)
        
        # 4. 점수 기반 정렬 및 배정 (Sorting & Assignment)
        # 점수가 높은 순서대로 T/O 내에 들면 배정 성공
        applicants.sort(key=lambda x: x.points, reverse=True)
        
        assigned_3rd = applicants[:total_3rd_grade_spots]
        
        # 5. 결과 판정
        if user in assigned_3rd:
            success_count_1st_choice += 1
        else:
            # 1지망 탈락 시 2지망(2학년 담임) 체크
            # 2학년은 T/O가 넉넉하고 기피가 덜하므로 점수가 0 이상이면 거의 배정된다고 가정
            user_2nd_score = calculate_priority_score(user, "담임") # 일반 담임 점수
            if user_2nd_score > 0:
                success_count_2nd_choice += 1

    # 결과 통계
    prob_1st = (success_count_1st_choice / n_trials) * 100
    prob_2nd = (success_count_2nd_choice / n_trials) * 100
    
    return prob_1st, prob_2nd

# 시뮬레이션 실행 및 결과 출력
prob_1st, prob_2nd = run_simulation()

print("-" * 50)
print(f"📊 [목일중 2026 업무 배정 예측 결과]")
print(f"   - 대상자: 정명현 (2025 임용, 과학교과)")
print(f"   - 1지망 (3학년 담임 + 진학지도1): {prob_1st:.2f}%")
print(f"   - 2지망 (2학년 담임 + 출결): {prob_2nd:.2f}%")
print("-" * 50)
print("💡 해석:")
if prob_1st > 80:
    print("   1지망 배정이 거의 확실시됩니다. '업무 연속성' 점수가 경쟁자들을 압도합니다.")
elif prob_1st > 50:
    print("   가능성이 높으나, 3학년 잔류 희망 고경력자가 변수입니다.")
else:
    print("   순환 근무 원칙에 의해 2학년으로 밀릴 가능성이 큽니다.")