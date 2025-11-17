from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, JSON
from datetime import date

class SurveyBase(SQLModel):
    firstName: str
    lastName: str
    street: str
    city: str
    state: str
    zip: str
    telephone: str
    email: str
    dateOfSurvey: date
    likes: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    interest: str
    recommend: str
    raffleNumbers: List[int] = Field(default_factory=list, sa_column=Column(JSON))
    comments: Optional[str] = None

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class SurveyCreate(SurveyBase):
    pass

class SurveyRead(SurveyBase):
    id: int

class SurveyUpdate(SQLModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    dateOfSurvey: Optional[date] = None
    likes: Optional[List[str]] = None
    interest: Optional[str] = None
    recommend: Optional[str] = None
    raffleNumbers: Optional[List[int]] = None
    comments: Optional[str] = None
