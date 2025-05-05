import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from model_task import Task
from bson import ObjectId
from dotenv import load_dotenv
import certifi

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variable or use a default for development
uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/taskmanager")

# Create a new client with proper SSL configuration
# Using certifi to provide the CA certificate bundle
client = MongoClient(
    uri,
    server_api=ServerApi('1'),
    tlsCAFile=certifi.where()
)

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

def get_tasks():
    documents = client["tasks"]["tasks"].find()
    tasks = [
        Task(
            **{
                **doc,
                "_id": str(doc["_id"]),  # Convert ObjectId to string
            }
        )
        for doc in documents
    ]
    return tasks

def insert_task(p_task: dict):
    task = Task(**p_task)
    client["tasks"]["tasks"].insert_one(task.dict())

def update_task(p_id: str, p_task: dict):
    task = Task(**p_task)
    client["tasks"]["tasks"].update_one({"_id": ObjectId(p_id)}, {"$set": task.dict()})

def delete_task(p_id: str):
    client["tasks"]["tasks"].delete_one({"_id": ObjectId(p_id)})

# client["tasks"]["tasks"].update_one({"_id": ObjectId("6814bb16f915bd84f105ebd2")}, {"$set": {"name": "Titan"}})

# print(get_collection("users"))