from fastapi import FastAPI
from model_task import Task
from fastapi.middleware.cors import CORSMiddleware
from db import get_tasks, insert_task, update_task, delete_task
from bson import ObjectId


app = FastAPI()


@app.get("/")
async def return_tasks():
    tasks = get_tasks()  # Call the function (remove await if get_tasks is synchronous)
    return [task.dict(by_alias=True) for task in tasks]  # Convert Task objects to dictionaries and serialize ObjectId

@app.post("/")
async def register_task(data: dict):
    insert_task(data)
    return {"result": "ok"}

@app.patch("/update/{task_id}")
async def renew_task(task_id: str, data: dict):
    update_task(task_id, data)
    return {"result": "ok"}

@app.delete("/delete/{task_id}")
async def remove_task(task_id: str):
    delete_task(task_id)
    return {"result": "ok"}