from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.gemini_service import generate_content
from app.dependencies import get_current_user
from app.services.supabase_service import supabase_admin
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
def generate(req: repurposerequest, current_user = Depends(get_current_user)):
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
        
        parsed_data = json.loads(text_content)
        
        # Save to Supabase (fails silently if table doesn't exist yet)
        try:
            supabase_admin.table("projects").insert({
                "user_id": current_user.id,
                "original_content": req.content,
                "platforms": req.platform,
                "generated_data": parsed_data
            }).execute()
        except Exception as db_err:
            print(f"Warning: Could not save to Supabase: {db_err}")
            
        return parsed_data
    except Exception as e:
        return {
            "linkedin": result,
            "x": result,
            "instagram": result,
            "tiktok": result,
            "newsletter": result,
            "error": str(e)
        }
