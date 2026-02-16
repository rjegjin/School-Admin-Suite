# =============================================================================
# Script Name: organize_project.ps1
# Description: '전기고, 행운권' 폴더의 파일들을 4개의 구조화된 프로젝트로 분리/이동
# Encoding: UTF-8 with BOM (한글 깨짐 방지 필수)
# Author: The Code Architect
# =============================================================================

# [Encoding Fix] PowerShell 세션의 인코딩을 UTF-8로 강제 설정 (한글 깨짐 방지)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# 1. 경로 설정
$SourceDir = "C:\Projects\전기고, 행운권"
$BaseTargetDir = "C:\Projects"

Write-Host "🚀 프로젝트 폴더 정리를 시작합니다..." -ForegroundColor Cyan
Write-Host "   - 원본 위치: $SourceDir"
Write-Host "   - 이동 위치: $BaseTargetDir (하위 폴더 생성)"

# 원본 폴더 존재 확인
if (-not (Test-Path $SourceDir)) {
    Write-Host "❌ 오류: 원본 폴더를 찾을 수 없습니다: $SourceDir" -ForegroundColor Red
    exit
}

# 2. 임시 파일 삭제 (.~lock.*)
Write-Host "`n🧹 [Step 1] 임시 파일 청소 중..." -ForegroundColor Yellow
$TempFiles = Get-ChildItem "$SourceDir\.~lock.*" -ErrorAction SilentlyContinue
if ($TempFiles) {
    $TempFiles | Remove-Item -Force -Verbose
    Write-Host "   [완료] 임시 파일 삭제됨"
} else {
    Write-Host "   [알림] 삭제할 임시 파일이 없습니다." -ForegroundColor Gray
}

# 3. 폴더 구조 생성 함수
function Create-DirectoryStructure {
    param ([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "   [생성] $Path" -ForegroundColor Green
    }
}

# 4. 파일 이동 함수
function Move-File {
    param (
        [string]$FileName,
        [string]$TargetSubPath
    )
    
    $SrcFile = Join-Path $SourceDir $FileName
    $DestDir = Join-Path $BaseTargetDir $TargetSubPath
    
    # 목적지 폴더가 없으면 생성
    Create-DirectoryStructure $DestDir

    # 와일드카드(*) 처리
    if ($FileName -like "*") {
        $Files = Get-ChildItem $SourceDir -Filter $FileName -File
        foreach ($File in $Files) {
            Move-Item -Path $File.FullName -Destination $DestDir -Force
            Write-Host "   [이동] $($File.Name) -> $TargetSubPath"
        }
    }
    else {
        # 단일 파일 처리
        if (Test-Path $SrcFile) {
            Move-Item -Path $SrcFile -Destination $DestDir -Force
            Write-Host "   [이동] $FileName -> $TargetSubPath"
        } else {
            Write-Host "   [건너뜀] 파일 없음: $FileName" -ForegroundColor Gray
        }
    }
}

# =============================================================================
# [실행] 파일 이동 로직
# =============================================================================

Write-Host "`n📦 [Step 2] 파일 이동 및 구조화 시작..." -ForegroundColor Yellow

# -----------------------------------------------------------
# 1. Project_Analytics (데이터 분석)
# -----------------------------------------------------------
$P1 = "Project_Analytics"
Move-File "pii_masking.py" "$P1\src"
Move-File "research_analytics.py" "$P1\src"
Move-File "statistical_deep_research.py" "$P1\src"
Move-File "stat_reliability.py" "$P1\src"
Move-File "final_dashboard_generator.py" "$P1\src"

Move-File "2025_후기고_배정결과.xlsx" "$P1\data\input"

Move-File "2025_후기고_분석결과_Report.xlsx" "$P1\data\processed"
Move-File "2025_후기고_심층연구보고서.xlsx" "$P1\data\processed"
Move-File "2025_후기고_최종분석결과.xlsx" "$P1\data\processed"
Move-File "2025_후기고_통계적_심층분석_신뢰도검증.xlsx" "$P1\data\processed"
Move-File "2025_후기고_통계적_심층분석_최종.xlsx" "$P1\data\processed"

Move-File "전체학생명렬표(3학년).csv" "$P1\data\reference"
Move-File "2025_후기고_최종리포트.html" "$P1\output"

# -----------------------------------------------------------
# 2. Project_School_Dashboard (웹 리포트)
# -----------------------------------------------------------
$P2 = "Project_School_Dashboard"
Move-File "mokil_high_school_results_gen.py" "$P2\generators"
Move-File "mokil_high_school_results_gen xls.py" "$P2\generators"
Move-File "generate_dashboard.py" "$P2\generators"
Move-File "generate_table.py" "$P2\generators"

Move-File "neis_helper web.py" "$P2\neis_tools"
Move-File "service_key.json" "$P2\neis_tools"

Move-File "teacher_work_predict.py" "$P2\predictions"

Move-File "main.html" "$P2\reports"
Move-File "목일중_*.html" "$P2\reports" 
Move-File "목일중_*.xlsx" "$P2\reports" 

# -----------------------------------------------------------
# 3. Project_Utilities_Event (유틸리티/행사)
# -----------------------------------------------------------
$P3 = "Project_Utilities_Event"
Move-File "converter.py" "$P3\file_tools"
Move-File "xl_merger.py" "$P3\file_tools"
Move-File "combined_sheets.xlsx" "$P3\file_tools"
Move-File "merged_all_sheets.xlsx" "$P3\file_tools"

Move-File "pick.html" "$P3\lottery_event"
Move-File "행운권뽑기.csv" "$P3\lottery_event"

# -----------------------------------------------------------
# 4. Archive (보관소)
# -----------------------------------------------------------
$P4 = "Archive"
Move-File "requirements_전기고, 행운권.txt" "$P4"
Move-File "전기고, 행운권_structure.txt" "$P4"
Move-File "student_list_output.txt" "$P4"

# Old 폴더 이동
$OldSrc = Join-Path $SourceDir "old"
$OldDest = Join-Path $BaseTargetDir "$P4\old"
if (Test-Path $OldSrc) {
    if (-not (Test-Path $OldDest)) { New-Item -ItemType Directory -Path $OldDest -Force | Out-Null }
    Move-Item -Path "$OldSrc\*" -Destination $OldDest -Force
    Remove-Item -Path $OldSrc -Force
    Write-Host "   [이동] old 폴더 -> $P4\old"
}

# -----------------------------------------------------------
# 5. 빈 원본 폴더 처리
# -----------------------------------------------------------
Write-Host "`n🗑 [Step 3] 정리 완료 후 처리" -ForegroundColor Yellow
$RemainingItems = Get-ChildItem $SourceDir -ErrorAction SilentlyContinue
if (-not $RemainingItems) {
    Write-Host "   원본 폴더($SourceDir)가 비어있습니다." -ForegroundColor Green
    Write-Host "   -> 안전을 위해 원본 폴더는 남겨두었습니다. 수동으로 삭제하셔도 됩니다." -ForegroundColor Gray
} else {
    Write-Host "   ⚠ 원본 폴더에 아직 파일이 남아있습니다. 확인해주세요." -ForegroundColor Red
    $RemainingItems | ForEach-Object { Write-Host "     - $($_.Name)" }
}

Write-Host "`n✅ 모든 작업이 완료되었습니다!" -ForegroundColor Cyan
Write-Host "📢 [중요] 파일 경로가 변경되었으므로 Python 코드 내 경로를 수정해야 합니다!" -BackgroundColor DarkRed -ForegroundColor White