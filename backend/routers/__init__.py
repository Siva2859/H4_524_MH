from .health import router as health_router
from .normalization import router as normalization_router
from .diagnosis import router as diagnosis_router
from .safety import router as safety_router
from .patients import router as patients_router
from .reference import router as reference_router
from .evaluation import router as evaluation_router
from .ingestion import router as ingestion_router

__all__ = [
    "health_router",
    "normalization_router",
    "diagnosis_router",
    "safety_router",
    "patients_router",
    "reference_router",
    "evaluation_router",
    "ingestion_router"
]
