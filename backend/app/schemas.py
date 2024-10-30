from pydantic import BaseModel
from datetime import date

class TaskBase(BaseModel):
    title: str
    description: str
    status: bool
    due_date: date

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int

    class Config:
        orm_mode = True
