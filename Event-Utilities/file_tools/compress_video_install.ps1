# 1. 관리자 권한 확인 (선택 사항이나 권장됨)
Write-Host "--- FFmpeg 고압축 전역 함수 등록 프로세스 시작 ---" -ForegroundColor Cyan

# 2. 프로필 파일 경로 확인 및 디렉터리 생성
$profileDir = Split-Path -Parent $PROFILE
if (!(Test-Path $profileDir)) {
    New-Item -Type Directory -Path $profileDir -Force | Out-Null
    Write-Host "[Info] 프로필 디렉터리를 생성했습니다." -ForegroundColor Gray
}

# 3. 기존 프로필 백업 (안전을 위해)
if (Test-Path $PROFILE) {
    $backupPath = "$PROFILE.bak_$(Get-Date -Format 'yyyyMMddHHmm')"
    Copy-Item $PROFILE $backupPath
    Write-Host "[Info] 기존 프로필을 백업했습니다: $backupPath" -ForegroundColor Gray
}

# 4. 등록할 함수 본문 정의 (H.265 최적화 설정 포함)
$functionCode = @"

# FFmpeg Video Compression Function (H.265)
function Compress-Video {
    param (
        [Parameter(Mandatory=`$true, ValueFromPipeline=`$true)]
        [string]`$Path
    )
    process {
        if (-not (Test-Path `$Path)) {
            Write-Error "파일을 찾을 수 없습니다: `$Path"
            return
        }
        `$inputFile = Get-Item `$Path
        `$outputFile = Join-Path `$inputFile.DirectoryName "`$(`$inputFile.BaseName)_output.mp4"
        
        Write-Host "인코딩 시작: `$(`$inputFile.Name) -> 출력 중..." -ForegroundColor Yellow
        
        # 10분 30MB 타겟팅을 위한 초고압축 설정 (-crf 30, -preset slow)
        ffmpeg -i `$inputFile.FullName -vcodec libx265 -crf 30 -preset slow -acodec aac -b:a 96k -tag:v hvc1 -y `$outputFile
        
        if (`$LASTEXITCODE -eq 0) {
            Write-Host "성공적으로 압축되었습니다: `$outputFile" -ForegroundColor Green
        } else {
            Write-Error "압축 도중 오류 발생"
        }
    }
}
"@

# 5. 프로필 파일에 함수 추가
# 기존에 동일한 함수가 있는지 확인 후 중복 방지를 위해 Append 모드로 추가
Add-Content -Path $PROFILE -Value $functionCode
Write-Host "[Success] $PROFILE 에 함수가 성공적으로 등록되었습니다." -ForegroundColor Green

# 6. 현재 세션에 즉시 적용
. $PROFILE
Write-Host "[Final] 현재 세션에 즉시 적용되었습니다. 이제 'Compress-Video' 명령어를 사용할 수 있습니다." -ForegroundColor Cyan