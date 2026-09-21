from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from models.experiment import ExperimentHistory as ExperimentModel
from schemas.experiment import ExperimentHistory, ExperimentHistoryCreate

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/", response_model=List[ExperimentHistory])
def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    experiments = db.query(ExperimentModel).offset(skip).limit(limit).all()
    return experiments

@router.post("/", response_model=ExperimentHistory)
def create_history(experiment: ExperimentHistoryCreate, db: Session = Depends(get_db)):
    db_experiment = ExperimentModel(**experiment.model_dump())
    db.add(db_experiment)
    db.commit()
    db.refresh(db_experiment)
    return db_experiment

@router.delete("/{id}", status_code=204)
def delete_history(id: int, db: Session = Depends(get_db)):
    db_experiment = db.query(ExperimentModel).filter(ExperimentModel.id == id).first()
    if not db_experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    db.delete(db_experiment)
    db.commit()
    return None
