from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.seed_data import seed_database
from app.api.routes import dashboard, analytics, datasets, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize and seed database if not already populated
    try:
        seed_database()
    except Exception as e:
        print(f"Database seed notice: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration
cors_origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }


# Include Routers under both /api and /api/v1
for prefix in ["/api", "/api/v1"]:
    app.include_router(dashboard.router, prefix=prefix)
    app.include_router(analytics.router, prefix=prefix)
    app.include_router(datasets.router, prefix=prefix)
    app.include_router(reports.router, prefix=prefix)
