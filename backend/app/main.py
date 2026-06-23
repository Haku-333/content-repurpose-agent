from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.gemini_service import generate_content
app = FastAPI(title="reprop.io API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the reprop.io API"}

class repurposerequest(BaseModel):
    content: str
    platform: str


import json

@app.post("/generate")
def generate(req: repurposerequest):
    result = generate_content(
        req.content,
        req.platform
    )

    try:
        # Clean markdown code fences if present
        text_content = result.strip()
        if text_content.startswith("```json"):
            text_content = text_content[7:]
        elif text_content.startswith("```"):
            text_content = text_content[3:]
        if text_content.endswith("```"):
            text_content = text_content[:-3]
        text_content = text_content.strip()
        
        return json.loads(text_content)
    except Exception as e:
        return {
            "linkedin": result,
            "x": result,
            "instagram": result,
            "tiktok": result,
            "newsletter": result,
            "error": str(e)
        }
