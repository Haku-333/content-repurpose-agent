import os
import json
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.services.gemini_service import generate_content
from app.dependencies import get_current_user
from app.services.supabase_service import supabase_admin

# ─── Layer 3: Rate Limiter Setup ───────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="reprop.io API")

# Attach the rate limiter error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── Layer 1a: CORS — restrict to known origins ─────────────────────────────
# When deploying to production, add your live domain here.
# e.g., "https://reprop.io", "https://www.reprop.io"
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # TODO: Add your production domain here before deploying
    # "https://your-production-domain.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],   # Restrict to only used HTTP methods
    allow_headers=["Authorization", "Content-Type"],
)

# ─── Layer 1b: Secure HTTP Headers Middleware ────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response


@app.get("/")
def read_root():
    return {"message": "Welcome to the reprop.io API"}


# ─── Layer 3: Input Validation via Pydantic constraints ─────────────────────
class repurposerequest(BaseModel):
    content: str = Field(..., min_length=10, max_length=5000, description="The source content to repurpose. Min 10, max 5000 characters.")
    platform: str = Field(..., min_length=1, max_length=200, description="The target platform(s).")


@app.get("/projects")
def get_projects(current_user=Depends(get_current_user)):
    try:
        response = supabase_admin.table("projects").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []


@app.get("/projects/{project_id}")
def get_project(project_id: str, current_user=Depends(get_current_user)):
    try:
        response = supabase_admin.table("projects").select("*").eq("id", project_id).eq("user_id", current_user.id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ─── Layer 2 + Layer 3: Auth check + Rate limit + Input validation ───────────
@app.post("/generate")
@limiter.limit("5/minute")   # Layer 3: Max 5 generations per minute per IP
def generate(request: Request, req: repurposerequest, current_user=Depends(get_current_user)):  # Layer 2: JWT required
    result = generate_content(req.content, req.platform)

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

        # Layer 4: Save to Supabase — user_id tied to RLS policies
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
