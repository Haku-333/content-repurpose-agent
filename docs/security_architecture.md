# Security Architecture: 4-Layer Defense Model

This document explains the security architecture implemented in **Reprop.io** before production deployment. We use a **defense-in-depth** strategy with 4 distinct layers of protection.

---

## Layer 1: Network & Protocol Security

**Files Modified**: `backend/app/main.py`

### 1a. CORS (Cross-Origin Resource Sharing) Lockdown
Instead of allowing any origin to call the API, we maintain a strict allowlist of trusted domains.

```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add production domain here before deploying
    # "https://your-app.vercel.app"
]
```

We also restrict the HTTP methods to only what is actually used (`GET` and `POST`), and restrict headers to only `Authorization` and `Content-Type`. This prevents the API from being called from any unauthorized website.

### 1b. Secure HTTP Response Headers
Every single API response from the backend now automatically includes these protective headers:

| Header | Value | What it Prevents |
|--------|-------|-----------------|
| `X-Content-Type-Options` | `nosniff` | Browser MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Clickjacking via iframes |
| `X-XSS-Protection` | `1; mode=block` | Reflected Cross-Site Scripting (XSS) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leaking URLs in referrer headers |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Unauthorized device access |

---

## Layer 2: API Authentication (JWT Verification)

**Files**: `backend/app/dependencies.py`, `backend/app/main.py`

Every single protected endpoint (`/generate`, `/projects`, `/projects/{id}`) requires a valid, unexpired Supabase JWT token in the request header.

```
Authorization: Bearer <supabase_access_token>
```

The `get_current_user` dependency in `dependencies.py` intercepts each request, calls Supabase to verify the token's cryptographic signature, and rejects it with a `401 Unauthorized` response if the token is missing, tampered with, or expired.

**Result**: No anonymous user can call any data endpoint whatsoever.

---

## Layer 3: Application Defense (Rate Limiting + Input Validation)

**Files**: `backend/app/main.py`

### 3a. API Rate Limiting (`slowapi`)
The `/generate` endpoint (which calls the paid Gemini AI API) is limited to **5 requests per minute per IP address**.

```python
@app.post("/generate")
@limiter.limit("5/minute")
def generate(request: Request, ...):
```

If exceeded, the user receives a `429 Too Many Requests` response. This prevents:
- Automated scripts from hammering and running up your Gemini API bill.
- Denial-of-service (DoS) attacks targeting the AI.

### 3b. Pydantic Input Validation & Constraints
The request body is validated at the framework level before the function even runs:

```python
class repurposerequest(BaseModel):
    content: str = Field(..., min_length=10, max_length=5000)
    platform: str = Field(..., min_length=1, max_length=200)
```

This enforces:
- **Minimum length (10)**: Prevents empty or meaningless generation requests.
- **Maximum length (5000)**: Prevents prompt injection payloads and memory exhaustion attacks that come from sending extremely large strings.

---

## Layer 4: Database Access Control (Supabase RLS)

**Configured in**: Supabase Dashboard → SQL Editor

PostgreSQL's Row Level Security (RLS) acts as the final line of defense. Even if an attacker somehow bypassed Layers 1-3, the database itself enforces ownership rules.

```sql
-- Users can only READ their own rows
create policy "Users can view their own projects."
  on projects for select
  using ( auth.uid() = user_id );

-- Users can only INSERT rows where user_id matches their own ID
create policy "Users can insert their own projects."
  on projects for insert
  with check ( auth.uid() = user_id );
```

The backend also always writes the authenticated `current_user.id` (validated by JWT in Layer 2) as the `user_id`, making it impossible for a user to forge ownership of another user's data.

---

## Pre-Deployment Checklist

> [!IMPORTANT]
> Before going live, complete these final steps:

- `[ ]` Add your production domain to `ALLOWED_ORIGINS` in `backend/app/main.py`
- `[ ]` Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY` as server environment variables on your hosting platform (NOT in a `.env` file on the server)
- `[ ]` Verify RLS policies are active in your Supabase dashboard (`Table Editor` → your table → `RLS enabled`)
- `[ ]` Test the rate limiter by sending 6 rapid `/generate` requests and confirming the 6th returns a `429` error
