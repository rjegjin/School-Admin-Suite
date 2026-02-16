# ==========================================
# 1. 경로 설정 (여기를 본인 경로로 수정하세요!)
# ==========================================

# A. 실제 데이터가 있는 곳 (OneDrive) - 따옴표 안에 경로를 넣으세요
$RealDataPath = "C:\Users\rjegj\OneDrive\문서\학교근무\목일중\Attendance\"

# B. 코드가 있는 곳 (Git Repository)
$CodeRepoPath = "C:\Projects\Attendance_sheet\"

# ==========================================
# 2. 심볼릭 링크 생성 실행
# ==========================================

# input 폴더 연결 (Code -> OneDrive)
New-Item -ItemType SymbolicLink -Path "$CodeRepoPath\input" -Target "$RealDataPath\input"

# reports 폴더 연결 (Code -> OneDrive)
# reports 폴더 안에 checklist 등 세부 폴더가 있다면 그것도 OneDrive에 연결됩니다.
New-Item -ItemType SymbolicLink -Path "$CodeRepoPath\reports" -Target "$RealDataPath\reports"

Write-Host "심볼릭 링크 생성 완료! 탐색기에서 화살표 아이콘이 붙은 폴더를 확인하세요."