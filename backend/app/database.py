# database.py — DB engine builder for SQLModel/SQLAlchemy

# Team Members:
# Lasya Reddy Mekala (G01473683)
# Supraja Naraharisetty (G01507868)
# Trinaya Kodavati (G01506073)
# Dhaanya S Garapati (G01512900)

import os
from sqlmodel import SQLModel, create_engine # type: ignore

def _build_url_from_parts() -> str:
    user = os.getenv("DB_USER", "admin")          
    pwd  = os.getenv("DB_PASS", "adminsurveydb")              
    host = os.getenv("DB_HOST", "surveydb.cxic486y49se.us-west-2.rds.amazonaws.com")     
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "surveydb")
    return f"mysql+pymysql://{user}:{pwd}@{host}:{port}/{name}"


DATABASE_URL = os.getenv("DATABASE_URL") or _build_url_from_parts()

connect_args = {}
ssl_ca = os.getenv("RDS_SSL_CA")
if ssl_ca:
    connect_args = {"ssl": {"ca": ssl_ca}}


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,          
    pool_recycle=280,            
    connect_args=connect_args,   
    echo=False
)

def init_db() -> None:
   
    SQLModel.metadata.create_all(engine)
