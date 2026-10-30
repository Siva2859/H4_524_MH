"""
MediGuard AI - Hackathon Submission Packager
Creates the official submission archive according to hackathon root structure guidelines:
teamID_psID.zip containing:
  - README.md
  - .gitignore
  - submission/
  - FULL_CODE/ (clean codebase without node_modules, dist, .git, or __pycache__)
"""

import os
import sys
import shutil
import zipfile
import argparse
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

EXCLUDE_DIRS = {
    "node_modules",
    "dist",
    "dist-ssr",
    "__pycache__",
    ".pytest_cache",
    ".git",
    "venv",
    "env",
    ".idea",
    ".vscode",
    "temp_submission_stage"
}

EXCLUDE_EXTENSIONS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".zip",
    ".tar.gz"
}

def remove_readonly(func, path, excinfo):
    """Clear the readonly bit and reattempt the removal."""
    try:
        os.chmod(path, 0o777)
        func(path)
    except Exception:
        pass

def safe_rmtree(path: Path):
    if not path.exists():
        return
    for attempt in range(5):
        try:
            shutil.rmtree(path, onerror=remove_readonly)
            break
        except Exception:
            time.sleep(0.5)

def create_submission_package(team_id: str, ps_id: str, output_dir: Path):
    archive_name = f"{team_id}_{ps_id}.zip"
    output_zip_path = output_dir / archive_name
    temp_stage_dir = output_dir / "temp_submission_stage"

    safe_rmtree(temp_stage_dir)
    temp_stage_dir.mkdir(parents=True, exist_ok=True)

    try:
        # 1. Create root README.md and .gitignore in stage
        shutil.copy2(ROOT_DIR / "README.md", temp_stage_dir / "README.md")
        if (ROOT_DIR / ".gitignore").exists():
            shutil.copy2(ROOT_DIR / ".gitignore", temp_stage_dir / ".gitignore")

        # 2. Create submission/ folder
        submission_dir = temp_stage_dir / "submission"
        submission_dir.mkdir(exist_ok=True)
        if (ROOT_DIR / "submission").exists():
            for sub_file in (ROOT_DIR / "submission").iterdir():
                if sub_file.is_file():
                    shutil.copy2(sub_file, submission_dir / sub_file.name)
        if (ROOT_DIR / ".env.example").exists():
            shutil.copy2(ROOT_DIR / ".env.example", submission_dir / ".env.example")

        # 3. Create FULL_CODE/ folder
        full_code_dir = temp_stage_dir / "FULL_CODE"
        full_code_dir.mkdir(exist_ok=True)

        for item in ROOT_DIR.iterdir():
            if item.name in EXCLUDE_DIRS or item.suffix in EXCLUDE_EXTENSIONS:
                continue
            if item.name.startswith(".") and item.name not in [".env.example", ".gitignore"]:
                continue

            target = full_code_dir / item.name
            if item.is_dir():
                shutil.copytree(
                    item,
                    target,
                    ignore=shutil.ignore_patterns(
                        *EXCLUDE_DIRS,
                        "*.pyc",
                        "*.log"
                    )
                )
            else:
                shutil.copy2(item, target)

        # 4. Create ZIP archive
        print(f"Creating archive: {output_zip_path}...")
        with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(temp_stage_dir):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(temp_stage_dir)
                    zipf.write(file_path, arcname)

        size_kb = os.path.getsize(output_zip_path) / 1024
        print(f"[SUCCESS] Submission archive created: {output_zip_path} ({size_kb:.1f} KB)")
        return output_zip_path

    finally:
        safe_rmtree(temp_stage_dir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Package MediGuard AI project for hackathon submission")
    parser.add_argument("--team-id", default="teamID", help="Team Identifier (default: teamID)")
    parser.add_argument("--ps-id", default="psID", help="Problem Statement Identifier (default: psID)")
    parser.add_argument("--out-dir", default=str(ROOT_DIR), help="Output directory")

    args = parser.parse_args()
    create_submission_package(args.team_id, args.ps_id, Path(args.out_dir))
