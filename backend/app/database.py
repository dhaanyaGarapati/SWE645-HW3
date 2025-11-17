# database.py — DB engine builder for SQLModel/SQLAlchemy
# Supports DATABASE_URL or individual pieces (DB_USER/DB_PASS/DB_HOST/DB_PORT/DB_NAME)
import os
from sqlmodel import SQLModel, create_engine # type: ignore

def _build_url_from_parts() -> str:
    user = os.getenv("DB_USER", "admin")          
    pwd  = os.getenv("DB_PASS", "adminsurveydb")              
    host = os.getenv("DB_HOST", "surveydb.cxic486y49se.us-west-2.rds.amazonaws.com")     
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "surveydb")
    return f"mysql+pymysql://{user}:{pwd}@{host}:{port}/{name}"

# Prefer full URL if provided
DATABASE_URL = os.getenv("DATABASE_URL") or _build_url_from_parts()

# Optional SSL (recommended for RDS). If you want to enforce TLS:
# 1) Download the bundle: https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
# 2) Mount it in container and set RDS_SSL_CA=/path/to/global-bundle.pem
connect_args = {}
ssl_ca = os.getenv("RDS_SSL_CA")
if ssl_ca:
    connect_args = {"ssl": {"ca": ssl_ca}}

# Robust engine defaults for cloud DBs
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,           # detects stale connections
    pool_recycle=280,             # recycle before AWS closes idle (~300s)
    connect_args=connect_args,    # TLS if provided
    echo=False
)

def init_db() -> None:
    # Create tables if they don't exist
    SQLModel.metadata.create_all(engine)
