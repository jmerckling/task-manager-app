from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

# CREATE operation: Add a new task
def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)  # Refresh the instance to get its ID
    return db_task

# READ operation: Get a list of all tasks
def get_tasks(db: Session, skip: int = 0, limit: int = 10) -> List[models.Task]:
    return db.query(models.Task).offset(skip).limit(limit).all()

# READ operation: Get a task by ID
def get_task_by_id(db: Session, task_id: int) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id).first()

# UPDATE operation: Update a task's status
def update_task(db: Session, task_id: int, task: schemas.TaskCreate):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        return None
    db_task.title = task.title
    db_task.description = task.description
    db_task.due_date = task.due_date
    db_task.status = task.status
    db.commit()
    db.refresh(db_task)
    return db_task

# DELETE operation: Delete a task by ID
def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True
