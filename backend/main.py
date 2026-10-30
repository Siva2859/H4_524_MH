import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .routers import (
    health_router,
    normalization_router,
    diagnosis_router,
    safety_router,
    patients_router,
    reference_router,
    evaluation_router,
    ingestion_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure directories exist
    os.makedirs(settings.data_dir, exist_ok=True)
    os.makedirs(settings.ingestion_dir, exist_ok=True)
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "Explainable Clinical Decision Support API for Medication Safety screening. "
        "Engineered by Team Logic Legends for Talent AP Mega Hackathon 2026 (Problem Statement H4)."
    ),
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers for structured JSON responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": str(exc),
            "path": request.url.path
        }
    )

# Mount API Routers
app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(normalization_router, prefix=settings.api_prefix)
app.include_router(diagnosis_router, prefix=settings.api_prefix)
app.include_router(safety_router, prefix=settings.api_prefix)
app.include_router(patients_router, prefix=settings.api_prefix)
app.include_router(reference_router, prefix=settings.api_prefix)
app.include_router(evaluation_router, prefix=settings.api_prefix)
app.include_router(ingestion_router, prefix=settings.api_prefix)

@app.get("/")
def root():
    return {
        "service": settings.app_title,
        "version": settings.app_version,
        "docs_url": "/docs",
        "health_check": f"{settings.api_prefix}/health",
        "api_prefix": settings.api_prefix
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.host, port=settings.port, reload=True)
