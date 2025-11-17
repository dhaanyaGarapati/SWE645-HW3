# Team Members:
# Lasya Reddy Mekala (G01473683)
# Supraja Naraharisetty (G01507868)
# Trinaya Kodavati (G01506073)
# Dhaanya S Garapati (G01512900)

from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import surveys

app = FastAPI(title="Survey API")


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


app.include_router(surveys.router)
