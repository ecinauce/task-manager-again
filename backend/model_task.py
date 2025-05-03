from pydantic import BaseModel, Field
from typing import Optional
from pyobjectid import PyObjectId
from bson import ObjectId

class Task(BaseModel):
    """
    A class representing a task with a name, description, and status.
    """
    id: Optional[PyObjectId] = Field(None, alias="_id", description="The unique identifier for the task")
    name: str = Field(..., description="The name of the task")
    description: Optional[str] = Field(None, description="A brief description of the task")
    status: str = Field(..., description="The current status of the task (e.g., 'pending', 'completed')")

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}