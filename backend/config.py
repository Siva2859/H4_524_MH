import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    app_title: str = "MediGuard AI — The Medication Safety Second Pair of Eyes"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    data_dir: Path = BASE_DIR / "data"
    h4_data_dir: Path = BASE_DIR.parent / "H4_Medication_Safety_Checker" / "data"
    submission_dir: Path = BASE_DIR.parent / "submission"
    ingestion_dir: Path = BASE_DIR / "ingestion_files"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Official evaluation data presence flag
    official_data_loaded: bool = False

    class Config:
        env_prefix = "MEDIGUARD_"
        case_sensitive = False

settings = Settings()
