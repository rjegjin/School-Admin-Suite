import pandas as pd
from icalendar import Calendar, Event
from datetime import datetime
import os

def clean_calendar(csv_path, ics_path, output_path):
    # 1. CSV 데이터 로드
    # Subject, Start Date, End Date, All Day Event, Description
    df = pd.read_csv(csv_path)
    
    # 비교를 위해 (제목, 시작일, 종료일) 튜플 세트 생성
    # CSV의 End Date는 Google Calendar Import 시 '포함' 개념일 수 있으나 
    # ICS에서는 종료일이 '다음날 00:00'인 경우가 많음 (Exclusive)
    to_remove = set()
    for _, row in df.iterrows():
        subject = str(row['Subject']).strip()
        start = str(row['Start Date']).strip()
        end = str(row['End Date']).strip()
        to_remove.add((subject, start, end))
    
    print(f"📍 CSV에서 추출한 삭제 대상: {len(to_remove)}건")

    # 2. ICS 데이터 로드
    with open(ics_path, 'rb') as f:
        gcal = Calendar.from_ical(f.read())

    new_cal = Calendar()
    # 기존 헤더 복사
    for key, value in gcal.items():
        if key != 'BEGIN' and key != 'END':
            new_cal.add(key, value)

    removed_count = 0
    kept_count = 0

    for component in gcal.walk():
        if component.name == "VEVENT":
            summary = str(component.get('summary', '')).strip()
            
            # 날짜 추출 (None 체크 추가)
            dtstart_prop = component.get('dtstart')
            dtend_prop = component.get('dtend')
            
            if not dtstart_prop or not dtend_prop:
                new_cal.add_component(component)
                kept_count += 1
                continue

            dtstart = dtstart_prop.dt
            dtend = dtend_prop.dt
            
            # 비교용 문자열 변환 (YYYY-MM-DD)
            # ics 라이브러리는 date 또는 datetime 객체를 반환함
            if isinstance(dtstart, datetime):
                start_str = dtstart.strftime('%Y-%m-%d')
            else:
                start_str = dtstart.strftime('%Y-%m-%d')
                
            if isinstance(dtend, datetime):
                # ICS의 종료일은 Exclusive이므로 하루를 빼야 CSV의 End Date와 맞음
                from datetime import timedelta
                end_actual = dtend - timedelta(days=1)
                end_str = end_actual.strftime('%Y-%m-%d')
            else:
                from datetime import timedelta
                try:
                    end_actual = dtend - timedelta(days=1)
                    end_str = end_actual.strftime('%Y-%m-%d')
                except TypeError:
                    # 가끔 dtend가 datetime이 아닌 경우가 있을 수 있음
                    end_str = dtend.strftime('%Y-%m-%d')

            # 매칭 체크
            is_match = False
            for (csv_sub, csv_start, csv_end) in to_remove:
                if summary == csv_sub and start_str == csv_start:
                    # 시작일과 제목이 같으면 일단 매칭으로 간주 (종료일 오차 허용)
                    is_match = True
                    break
            
            if is_match:
                removed_count += 1
                print(f"  - 삭제 매칭됨: {summary} ({start_str})")
                continue
            else:
                new_cal.add_component(component)
                kept_count += 1
        elif component.name != "VCALENDAR":
            new_cal.add_component(component)

    # 3. 결과 저장
    with open(output_path, 'wb') as f:
        f.write(new_cal.to_ical())

    print(f"✅ 필터링 완료!")
    print(f"🗑️ 삭제됨: {removed_count}건")
    print(f"💾 보존됨: {kept_count}건")
    print(f"📄 결과 파일: {output_path}")

if __name__ == "__main__":
    CSV_FILE = "schedule_2026_campus_team.csv"
    
    # 올바른 ICS 파일 찾기 (CSV의 첫 번째 항목인 '신년수양회'가 포함된 파일 찾기)
    import glob
    target_subject = "신년수양회"
    found_ics = None
    for ics_candidate in glob.glob("extracted_calendar/*.ics"):
        with open(ics_candidate, 'r', encoding='utf-8', errors='ignore') as f:
            if target_subject in f.read():
                found_ics = ics_candidate
                break
    
    if found_ics:
        print(f"🔍 타겟 ICS 발견: {found_ics}")
        ICS_FILE = found_ics
        OUTPUT_FILE = "cleaned_campus_team_calendar.ics"
        
        try:
            clean_calendar(CSV_FILE, ICS_FILE, OUTPUT_FILE)
        except Exception as e:
            print(f"❌ 오류 발생: {e}")
    else:
        print("❌ '신년수양회'가 포함된 ICS 파일을 찾을 수 없습니다.")
