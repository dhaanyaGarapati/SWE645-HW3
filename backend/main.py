from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

from .database import init_db
from .routers import surveys

app = FastAPI(title="Survey API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health")
def health():
    return {"ok": True}

# Router lives at /surveys (frontend will call /api/surveys, nginx strips /api)
app.include_router(surveys.router)
