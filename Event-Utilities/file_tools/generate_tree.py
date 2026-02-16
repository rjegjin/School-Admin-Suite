import os
import sys
from pathlib import Path

# ==========================================
# [설정] 무시할 폴더 및 파일 패턴 목록
# ==========================================
IGNORE_DIRS = {
    '__pycache__', 
    'venv', 
    'env', 
    '.git', 
    '.idea', 
    '.vscode', 
    'node_modules', 
    'cache', 
    '.pytest_cache',
    'site-packages',
    'Lib',       
    'Scripts',   
    'Include',
    'build',
    'dist'
}

IGNORE_FILES = {
    '.DS_Store', 
    'Thumbs.db', 
    'tree.txt',          # 결과 파일 제외
    'generate_tree.py',  
    'generate_project_tree.py', # 이 스크립트 제외
    'pip.exe',           
    'python.exe'
}

EXT_FILTER = [] # 예: ['.py', '.js'] 

OUTPUT_FILENAME = 'tree.txt'

def get_projects_root() -> Path:
    """
    현재 스크립트 위치를 기준으로 C:/Projects (2단계 상위) 경로를 반환합니다.
    만약 구조가 다르다면 수정이 필요할 수 있습니다.
    """
    # 현재 파일: .../Projects/Project_Utilities_Event/file_tools/generate_tree.py
    # parents[0]: file_tools
    # parents[1]: Project_Utilities_Event
    # parents[2]: Projects
    current_script_path = Path(__file__).resolve()
    projects_root = current_script_path.parents[2]
    
    return projects_root

def generate_tree_content(dir_path: Path, prefix: str = ""):
    """
    재귀적으로 디렉토리 트리를 문자열 리스트로 생성합니다.
    """
    tree_lines = []
    
    try:
        entries = list(os.scandir(dir_path))
        entries.sort(key=lambda e: e.name.lower())

        filtered_entries = []
        for entry in entries:
            if entry.is_dir():
                if entry.name not in IGNORE_DIRS:
                    filtered_entries.append(entry)
            else:
                if entry.name not in IGNORE_FILES:
                    if EXT_FILTER and Path(entry.name).suffix not in EXT_FILTER:
                        continue
                    filtered_entries.append(entry)

        entry_count = len(filtered_entries)

        for index, entry in enumerate(filtered_entries):
            is_last = (index == entry_count - 1)
            connector = "└─ " if is_last else "├─ "
            
            tree_lines.append(f"{prefix}{connector}{entry.name}")

            if entry.is_dir():
                extension = "    " if is_last else "│   "
                tree_lines.extend(generate_tree_content(Path(entry.path), prefix + extension))

    except PermissionError:
        tree_lines.append(f"{prefix}[Access Denied]")
    except Exception as e:
        tree_lines.append(f"{prefix}[Error: {str(e)}]")

    return tree_lines

def save_tree_to_file(target_dir: Path):
    """
    특정 디렉토리의 트리를 생성하고 해당 디렉토리 안에 tree.txt로 저장합니다.
    """
    print(f"\nProcessing: {target_dir.name}...")
    
    lines = [f"{target_dir.name}/"]
    lines.extend(generate_tree_content(target_dir))
    
    output_path = target_dir / OUTPUT_FILENAME
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"✅ Saved: {output_path}")
    except Exception as e:
        print(f"❌ Error saving to {output_path}: {e}")

def main():
    projects_root = get_projects_root()
    
    print(f"==========================================")
    print(f" Projects Root: {projects_root}")
    print(f"==========================================")

    if not projects_root.exists():
        print(f"Error: 경로를 찾을 수 없습니다: {projects_root}")
        print("스크립트 위치가 C:/Projects/SomeProject/file_tools/ 내부에 있는지 확인하세요.")
        return

    # Projects 폴더 바로 아래의 디렉토리만 리스팅 (숨김 폴더 제외)
    sub_projects = [
        p for p in projects_root.iterdir() 
        if p.is_dir() and not p.name.startswith('.') and p.name not in IGNORE_DIRS
    ]
    
    # 이름순 정렬
    sub_projects.sort(key=lambda x: x.name.lower())

    if not sub_projects:
        print("탐색할 하위 프로젝트 폴더가 없습니다.")
        return

    # 메뉴 출력
    print("Select a project to generate tree map:")
    print("0. [ALL PROJECTS] (Generate for all folders)")
    for i, proj in enumerate(sub_projects):
        print(f"{i + 1}. {proj.name}")

    # 사용자 입력
    try:
        selection = input("\nNumber > ").strip()
        if not selection.isdigit():
            print("숫자를 입력해주세요.")
            return
        
        choice = int(selection)
        
        if choice == 0:
            # 전체 처리
            print("\nGenerating trees for ALL projects...")
            for proj in sub_projects:
                save_tree_to_file(proj)
        elif 1 <= choice <= len(sub_projects):
            # 단일 선택 처리
            selected_proj = sub_projects[choice - 1]
            save_tree_to_file(selected_proj)
        else:
            print("잘못된 번호입니다.")

    except KeyboardInterrupt:
        print("\nCancelled.")
    except Exception as e:
        print(f"\nUnexpected Error: {e}")

    print("\nJob Finished.")

if __name__ == "__main__":
    main()