from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import engine
from ..models import Survey, SurveyCreate, SurveyRead, SurveyUpdate

router = APIRouter(prefix="/surveys", tags=["surveys"])

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=SurveyRead, status_code=status.HTTP_201_CREATED)
def create_survey(payload: SurveyCreate, session: Session = Depends(get_session)):
    survey = Survey.model_validate(payload)  # SQLModel 0.0.22+ / Pydantic v2
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

@router.get("/", response_model=List[SurveyRead])
def list_surveys(session: Session = Depends(get_session)):
    return session.exec(select(Survey)).all()

@router.get("/{survey_id}", response_model=SurveyRead)
def get_survey(survey_id: int, session: Session = Depends(get_session)):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey

@router.put("/{survey_id}", response_model=SurveyRead)
def update_survey(survey_id: int, payload: SurveyUpdate, session: Session = Depends(get_session)):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    updates = payload.model_dump(exclude_unset=True)
    for k, v in updates.items():
        setattr(survey, k, v)
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey(survey_id: int, session: Session = Depends(get_session)):
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    session.delete(survey)
    session.commit()
    return None
