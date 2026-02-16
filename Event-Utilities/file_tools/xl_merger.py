import pandas as pd
import glob
import os
import unicodedata

# 1. 원본 폴더 경로 설정 (마지막 역슬래시 주의)
folder_path = r'C:\Users\rjegj\OneDrive\문서\학교근무\목일중\세특'

# 2. 해당 폴더 내의 모든 .xlsx 파일 검색
file_list = glob.glob(os.path.join(folder_path, '*.xlsx'))

# 한글 자소 분리 현상(NFD)을 방지하기 위한 NFC 정규화 함수
def normalize_name(name):
    return unicodedata.normalize('NFC', name)

if not file_list:
    print("❌ 지정된 폴더에 엑셀 파일이 존재하지 않습니다. 경로를 확인해주세요.")
else:
    # 3. 첫 번째 파일명을 기반으로 출력 파일명 생성
    first_file_name = os.path.splitext(os.path.basename(file_list[0]))[0]
    first_file_name = normalize_name(first_file_name)
    output_filename = f"{first_file_name}_merged.xlsx"
    
    # 4. 결과 파일을 원본 폴더 내에 저장하도록 경로 설정
    output_full_path = os.path.join(folder_path, output_filename)
    
    print(f"📂 작업 폴더: {folder_path}")
    print(f"📝 생성될 파일명: {output_filename}")
    print(f"🔍 총 {len(file_list)}개의 파일을 병합합니다...")

    # ExcelWriter 객체 생성 (openpyxl 엔진 사용)
    with pd.ExcelWriter(output_full_path, engine='openpyxl') as writer:
        for file in file_list:
            # 생성될 결과 파일이 검색 리스트에 포함되어 다시 읽히는 것 방지
            if os.path.abspath(file) == os.path.abspath(output_full_path):
                continue
                
            # 현재 처리 중인 파일명 추출
            current_file_base = os.path.splitext(os.path.basename(file))[0]
            current_file_base = normalize_name(current_file_base)

            try:
                # 파일 내 모든 시트를 딕셔너리 형태로 로드
                # sheet_name=None 은 모든 시트를 불러오는 핵심 옵션입니다.
                all_sheets = pd.read_excel(file, sheet_name=None, engine='openpyxl')

                for sheet_name, df in all_sheets.items():
                    # 한글 시트명 정규화
                    normalized_sheet_name = normalize_name(sheet_name)
                    
                    # 엑셀 시트 이름 제약(최대 31자)을 고려하여 시트명 생성
                    # 형식: [파일명]_[시트명]
                    combined_sheet_name = f"{current_file_base}_{normalized_sheet_name}"[:31]
                    
                    # 데이터프레임을 새 엑셀 파일의 시트로 기록
                    df.to_excel(writer, sheet_name=combined_sheet_name, index=False)
                    print(f"✅ 병합 완료: {current_file_base} > {normalized_sheet_name}")

            except Exception as e:
                print(f"⚠️ 오류 발생 [{current_file_base}]: {e}")

    print(f"\n✨ 모든 작업이 성공적으로 완료되었습니다.")
    print(f"📍 최종 경로: {output_full_path}")