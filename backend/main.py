import json
import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware to allow requests from the frontend
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/state")
async def get_state():
    with open("state.json") as f:
        data = json.load(f)
    return data

@app.get("/api/public-data")
async def get_public_data():
    response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
    return response.json()

@app.get("/")
async def read_index():
    return FileResponse("../frontend/index.html")

@app.get("/{filename:path}")
async def read_static_file(filename: str):
    return FileResponse(f"../frontend/{filename}")
