import pandas as pd
from icalendar import Calendar
from datetime import datetime, timedelta

def ics_to_df(ics_path):
    with open(ics_path, 'rb') as f:
        gcal = Calendar.from_ical(f.read())
    
    data = []
    for component in gcal.walk():
        if component.name == "VEVENT":
            summary = str(component.get('summary', '')).strip()
            dtstart = component.get('dtstart').dt
            dtend = component.get('dtend').dt
            
            # YYYY-MM-DD 형식으로 변환
            start_str = dtstart.strftime('%Y-%m-%d')
            
            # ICS 종료일 처리 (All day는 다음날 00시로 되어있으므로 하루 빼줌)
            if hasattr(dtend, 'strftime'):
                end_actual = dtend - timedelta(days=1)
                end_str = end_actual.strftime('%Y-%m-%d')
            else:
                end_str = start_str # 종료일 없는 경우

            data.append({
                'Subject': summary,
                'Start Date': start_str,
                'End Date': end_str,
                'All Day Event': 'True',
                'Description': str(component.get('description', '')).strip()
            })
    return pd.DataFrame(data)

def clean_csv_logic():
    # 1. '교제일정2026' (현재 섞여있는 전체 데이터)
    ics_path = "extracted_calendar/421349fb7837894705ef20f750d4d9ab6d1dabcf8cd6c02e01650453546ba220@group.calendar.google.com.ics"
    df_messy = ics_to_df(ics_path)
    print(f"📊 현재 캘린더 전체 데이터: {len(df_messy)}건")

    # 2. '제거해야 할 일정' (2026학년도 전체 학사일정)
    df_remove = pd.read_csv("../Attendance-sheet/schedule_2026_전체학년.csv")
    print(f"🚫 제거할 학사일정: {len(df_remove)}건")

    # 3. 필터링 (제목과 시작일이 같으면 제거대상)
    # 비교를 위해 (제목, 시작일) 세트 생성
    remove_keys = set()
    for _, row in df_remove.iterrows():
        remove_keys.add((str(row['Subject']).strip(), str(row['Start Date']).strip()))

    # 필터링 수행
    cleaned_rows = []
    removed_count = 0
    
    for _, row in df_messy.iterrows():
        subject = str(row['Subject'])
        desc = str(row['Description'])
        key = (subject.strip(), str(row['Start Date']).strip())
        
        # 1. 학사일정 CSV와 매칭되거나
        # 2. 내용/제목에 '학사일정' 키워드가 포함된 경우 제거
        if key in remove_keys or "학사일정" in desc or "학사일정" in subject:
            removed_count += 1
            continue
        cleaned_rows.append(row)

    df_cleaned = pd.DataFrame(cleaned_rows)
    
    # 4. 결과 저장
    output_path = "교제일정2026_CLEAN.csv"
    df_cleaned.to_csv(output_path, index=False, encoding='utf-8-sig')
    
    print(f"✅ 필터링 완료!")
    print(f"🗑️ 제거됨 (3학년 일정): {removed_count}건")
    print(f"✨ 남은 일정 (순수 교제일정): {len(df_cleaned)}건")
    print(f"💾 저장된 파일: {output_path}")

if __name__ == "__main__":
    clean_csv_logic()
