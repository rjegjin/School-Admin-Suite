import pandas as pd
import os

# [설정] 입력 파일명과 출력 파일명
INPUT_FILE = "전체학생명렬표(3학년).csv"
OUTPUT_FILE = "student_list_output.txt"

def main():
    print(f"🔄 '{INPUT_FILE}' 변환 작업을 시작합니다...")

    # 1. 파일 존재 여부 확인
    if not os.path.exists(INPUT_FILE):
        print(f"❌ 오류: '{INPUT_FILE}' 파일이 같은 폴더에 없습니다.")
        return

    # 2. CSV 파일 읽기 (인코딩 자동 감지 로직)
    # 윈도우 엑셀(cp949)과 일반 utf-8 형식을 모두 지원합니다.
    try:
        df = pd.read_csv(INPUT_FILE, encoding='utf-8')
    except UnicodeDecodeError:
        print("ℹ️ UTF-8 인코딩 실패, CP949(윈도우 엑셀 형식)로 재시도합니다.")
        try:
            df = pd.read_csv(INPUT_FILE, encoding='cp949')
        except Exception as e:
            print(f"❌ 파일 읽기 실패: {e}")
            return

    # 3. 컬럼명 자동 찾기 ('학번', 그리고 '이름' 또는 '성명')
    if '학번' not in df.columns:
        print(f"❌ 오류: '학번' 컬럼이 없습니다. (현재 컬럼: {df.columns.tolist()})")
        return

    if '이름' in df.columns:
        name_col = '이름'
    elif '성명' in df.columns:
        name_col = '성명'
    else:
        print(f"❌ 오류: '이름' 또는 '성명' 컬럼이 없습니다. (현재 컬럼: {df.columns.tolist()})")
        return

    # 4. 데이터 변환 및 저장
    try:
        count = 0
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            for index, row in df.iterrows():
                # 데이터 정제 (공백 제거, 문자열 변환)
                num = str(row['학번']).strip()
                name = str(row[name_col]).strip()
                
                # 유효한 데이터만 쓰기 (빈 칸이나 nan 제외)
                if num and name and num.lower() != 'nan' and name.lower() != 'nan':
                    f.write(f"{num} {name}\n")
                    count += 1
        
        print(f"✅ 성공! 총 {count}명의 명단이 '{OUTPUT_FILE}'로 저장되었습니다.")
        print(f"📄 생성된 파일을 열어 내용을 복사해서 사용하세요.")

    except Exception as e:
        print(f"❌ 변환 중 알 수 없는 오류 발생: {e}")

if __name__ == "__main__":
    main()