import gspread
from google.oauth2.service_account import Credentials
import random
import os

def randomize_seats_to_gsheet(json_key_path, spreadsheet_id, sheet_name, student_list):
    """
    학생 명단을 무작위로 섞어 구글 스프레드시트에 배치합니다.
    :param json_key_path: 서비스 계정 JSON 키 경로
    :param spreadsheet_id: 스프레드시트 ID (URL에서 확인 가능)
    :param sheet_name: 데이터를 입력할 시트 이름
    :param student_list: 학생 이름 리스트
    """
    # 1. 인증 설정
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    try:
        # 경로가 존재하지 않으면 상위 디렉토리에서 찾아봄 (C:\Projects\service_key.json 등)
        if not os.path.exists(json_key_path):
            alt_path = os.path.join("..", "..", "service_key.json")
            if os.path.exists(alt_path):
                json_key_path = alt_path
        
        creds = Credentials.from_service_account_file(json_key_path, scopes=scopes)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(spreadsheet_id).worksheet(sheet_name)
    except Exception as e:
        print(f"[Error] 인증 또는 시트 접근 실패: {e}")
        return

    # 2. 로직: 학생 명단 셔플 (Fisher-Yates Shuffle 기반)
    shuffled_students = random.sample(student_list, len(student_list))
    
    # 3. 5열 배치를 위한 그리드 데이터 생성 (6행 5열 기준)
    cols = 5
    rows = (len(shuffled_students) + cols - 1) // cols
    grid = []
    
    for i in range(rows):
        start_idx = i * cols
        row_data = shuffled_students[start_idx : start_idx + cols]
        # 빈 자리는 공백으로 채움
        row_data += [""] * (cols - len(row_data))
        grid.append(row_data)

    # 4. 시트에 데이터 쓰기 (B3:F8 영역에 배치한다고 가정)
    try:
        # 셀 범위를 지정하여 한 번에 업데이트 (API 호출 최적화)
        target_range = f'B3:F{3 + rows - 1}'
        sheet.update(target_range, grid)
        print(f"[Success] '{sheet_name}' 시트에 자리가 성공적으로 배치되었습니다.")
    except Exception as e:
        print(f"[Error] 데이터 쓰기 중 오류 발생: {e}")

if __name__ == "__main__":
    # 테스트 데이터
    STU_LIST = ["김나현", "김민재", "김승원", "김아율", "김지윤", "김채연", "문도영", "박건우", "박영민", "박은빈", 
                "박정익", "배유원", "송인유", "심민겸", "우혜준", "이라엘", "이예닮", "이재준", "이준우", "이지훈", 
                "이초명", "이태희", "이해승", "임효림", "장연우", "전호윤", "정주현", "정예원", "홍서준"]
    
    # 실행 예시 (실제 사용 시 ID와 경로 수정 필요)
    # JSON_KEY = "service_key.json"
    # SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"
    # SHEET_NAME = "자리배치결과"
    # randomize_seats_to_gsheet(JSON_KEY, SPREADSHEET_ID, SHEET_NAME, STU_LIST)
    
    print("Python 스크립트가 준비되었습니다. 'seat_manager.py' 파일에서 구글 API 키와 스프레드시트 ID 설정을 완료한 후 실행하세요.")
